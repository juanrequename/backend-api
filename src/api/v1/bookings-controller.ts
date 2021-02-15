import { ExpressController, ExpressJSONSearchPresenter, ExpressJSONCreatePresenter, /*ExpressJSONShowPresenter */ } from '../../modules/core';

import { BookingGateway } from '../../modules/bookings/booking-gateway';
import { GetBookingsInteractor, GetBookingsRequestObject, validationSchema as getAllSchema } from '../../modules/bookings/get-bookings-interactor';
import { CreateBookingRequestObject, validationSchema as createSchema } from '../../modules/bookings/create-booking-interactor';
import { CreateBookingInteractor } from '../../modules/bookings/create-booking-interactor';

export class BookingsController extends ExpressController {
    constructor() {
        super();

        this.router.get('/', this.validator.validateQuery(getAllSchema), this.getBookings.bind(this));

        this.router.post('/', this.validator.validateBody(createSchema), this.createBooking.bind(this));
    }

    async getBookings(req, res, next) {
        const bookingGateway = new BookingGateway();
        const interactor = new GetBookingsInteractor();

        const presenter = new ExpressJSONSearchPresenter(req, res, next);

        const request = req.query as GetBookingsRequestObject;

        interactor.setPresenter(presenter).setBookingGateway(bookingGateway);
        await interactor.execute(request);
    }

    async createBooking(req, res, next) {
        const bookingGateway = new BookingGateway();
        const interactor = new CreateBookingInteractor();
        const presenter = new ExpressJSONCreatePresenter(req, res, next);

        // Everything is validated by the joi
        const request = req.body as CreateBookingRequestObject;

        interactor.setPresenter(presenter).setBookingGateway(bookingGateway);

        await interactor.execute(request);
    }
}
