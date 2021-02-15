import mongoose, { Document, Schema } from 'mongoose';

import { baseEntitySchema } from './base-entity-schema';

export interface IBookingModel extends Document {
    _id: string;
    name: string;
    authorEmail: string;
    createdAt: Date;
    updatedAt: Date;
    authorMetaData: any;
    hotelId: string;
    hotelMetaData: any;
    fromDate: Date;
    toDate: Date;
    roomsCount: number;
    guestsCount: number;
}

export const BookingSchema = new mongoose.Schema(
    {
        ...baseEntitySchema,
        authorMetaData: Schema.Types.Mixed,
        hotelId: String,
        hotelMetaData: Schema.Types.Mixed,
        fromDate: Date,
        toDate: Date,
        roomsCount: Number,
        guestsCount: Number,
    },
    { timestamps: true },
);

export const BookingModel = mongoose.model<IBookingModel>(
    'Booking',
    BookingSchema,
);
