import { ExpressController, ExpressRawPresenter } from '../../modules/core';
import { HotelProviderService, validationSchema as getAllSchema } from '../../modules/hotels/hotel-provider-service';
import { logger } from '../../app';

export class HotelsController extends ExpressController {
    constructor() {
        super();

        this.router.get(
            '/*',
            this.validator.validateQuery(getAllSchema),
            this.processHotels.bind(this),
        );
    }

    async processHotels(req, res, next) {
        const presenter = new ExpressRawPresenter(req, res, next);

        try {
            const hotelProvider = new HotelProviderService();
            const coordinates = req.query.coordinates;
            const result = await hotelProvider.getHotels(coordinates);
            return presenter.success(result);

        } catch (error) {
            logger.error(
                `[processHotels]: Error:  ${error.message}`,
                {...error, ...req.headers }
            );
            return presenter.error([error.message]);
        }
    }
}
