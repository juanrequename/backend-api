import request from 'request';
import { HttpStatus } from '../common';
import applicationConfig from '../../config/application';
import { logger } from '../../app';
import joi from 'joi';

export const validationSchema = joi.object().keys({
    coordinates: joi
        .string()
        .required()
});

export class HotelProviderService {
    async getHotels(coordinates: string) {
        const query = `?q=hotel&lang=en-US&apiKey=${applicationConfig.hotelProvider.appKey}&at=${coordinates}`;
        const uri = `${applicationConfig.hotelProvider.hotelUrl}${query}`;
        const options = {
            method: 'GET',
            uri,
            json: true,
        };

        const res = await new Promise((resolve, reject) => {
            return request(options, (err, response, body) => {
                if (err) {
                    logger.error(`Error during ${uri}: `, err);
                    return resolve(err);
                }

                if (response.statusCode >= HttpStatus.BAD_REQUEST) {
                    logger.error( new Error(`Unable to get hotels. ErrorCode: ${response.statusCode}`));
                    reject(new Error(`Unable to get hotels. ErrorCode: ${response.statusCode}`));
                }

                const { items } = body;
                if (!items) {
                    resolve([]);
                }
                return resolve(items);
            });
        });

        return res;
    }
}
