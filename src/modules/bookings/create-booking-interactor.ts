import { Interactor, IRequestObject } from '../core';
import joi from 'joi';
import { BookingGateway } from './booking-gateway';
import { Booking } from './booking';
import { logger } from '../../app';

export interface CreateBookingRequestObject extends IRequestObject {
    id?: string,
    name: string,
    authorEmail: string,
    fromDate: any,
    toDate: any,
    hotelId: string,
    roomsCount: number,
    guestsCount: number
}

export const validationSchema = joi.object().keys({
    name: joi
        .string()
        .required(),
    authorEmail: joi
        .string()
        .required(),
    fromDate: joi
        .date()
        .required(),
    toDate: joi
        .date()
        .required(),
    hotelId: joi
        .string()
        .required(),
    roomsCount: joi
        .number()
        .required(),
    guestsCount: joi
        .number()
        .required()
});

export class CreateBookingInteractor extends Interactor {
    private _bookingGateway: BookingGateway = null;

    setBookingGateway(gateway: BookingGateway) {
        this._bookingGateway = gateway;
        return this;
    }


    async execute(request: CreateBookingRequestObject) {
        try {
            let booking;

            booking = Booking.fromRaw(request);
            const { id: bookingId } = await this._bookingGateway.createBooking(booking);

            const created = await this._bookingGateway.getBookingById({ id: bookingId.toString() });

            await this.presenter.success(created);

            return true;
        } catch (e) {
            logger.error('Failed to create booking', request, e);
            this.presenter.error([e.message]);

            return false;
        }
    }
}
