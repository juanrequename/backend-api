import { BookingModel, } from '../../db/models/booking.model';

import { DEFAULT_PAGE_NUM, DEFAULT_PAGE_SIZE } from '../common/pagination';
import { MongoGateway } from '../common/persistance-gateway';
import { Booking } from './booking';
import { logger } from '../../app';

interface GetBookingsParameters {
    page: number;
    pageSize: number;
}

interface GetBookingByIdParameters {
    id: string;
}

interface GetBookingsResult {
    count: number;
    rows: any;
}

export class BookingGateway extends MongoGateway {
    private _bookingModel = BookingModel;

    setBookingModel(model: typeof BookingModel) {
        this._bookingModel = model;
        return this;
    }

    async getBookings({
                          page = DEFAULT_PAGE_NUM,
                          pageSize = DEFAULT_PAGE_SIZE,
                      }: GetBookingsParameters): Promise<GetBookingsResult> {

        const query: any = {};

        const rows = await this._bookingModel.find(query)
            .sort({ createdAt: 'descending' })
            .skip(pageSize * (page - 1))
            .limit(pageSize);

        const count = await this._bookingModel.count(query);

        return {
            count,
            rows,
        };
    }

    async createBooking(booking: Booking): Promise<Booking> {
        logger.debug('Creating booking... UserEmail: %s', booking.authorEmail);

        const modelValues = {
            ...booking.toModelValues(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        const created = await this._bookingModel.create(modelValues);

        return Booking.fromRaw(created);
    }

    async getBookingById({ id }: GetBookingByIdParameters) {
        const query = {
            _id: id,
        };
        return BookingModel.findOne(query).exec();
    }
}
