import { Router } from 'express';
import { BookingsController } from './bookings-controller';
import { HotelsController } from './hotels-controller';

export class ApiRouter {
    tokenAuth;

    constructor({ tokenAuth }) {
        this.tokenAuth = tokenAuth;
    }

    build() {
        const router = Router();

        const bookingsController = new BookingsController();
        const hotelsController = new HotelsController();

        router.get('/healthcheck', (req, res) => {
            const healthcheck = {
                uptime: process.uptime(),
                message: 'OK',
                timestamp: Date.now()
            };
            try {
                return res.status(200).send(healthcheck);
            } catch (e) {
                healthcheck.message = e;
                return res.status(503).send();
            }
        });

        // router.use(this.tokenAuth.checkAuthMiddleware({}));

        // Bookings api
        router.use('/bookings', bookingsController.router);

        // Bookings api
        router.use('/hotels', hotelsController.router);

        return router;
    }
}
