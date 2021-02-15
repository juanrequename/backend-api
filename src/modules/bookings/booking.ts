import { BookingModel } from '../../db/models/booking.model';

import { IPersistableEntity, PersistableEntity } from '../common';

export interface IBooking extends IPersistableEntity {
    userEmail: string;
}

export class Booking extends PersistableEntity implements IBooking {
    private _user: KeyValueHash;
    private _userEmail: string;
    private _fromDate: Date;
    private _toDate: Date;
    private _hotelId: string;
    private _roomsCount: number;
    private _guestsCount: number;

    get user(): KeyValueHash {
        return this._user;
    }

    get userEmail(): string {
        return this._userEmail;
    }

    get fromDate() {
        return this._fromDate;
    }

    get toDate() {
        return this._toDate;
    }

    get hotelId() {
        return this._hotelId;
    }

    get roomsCount() {
        return this._roomsCount;
    }

    get guestsCount() {
        return this._guestsCount;
    }

    setUser(user: KeyValueHash): Booking {
        this._user = user;

        return this;
    }

    setFromDate(value){
        this._fromDate = value;
        return this;
    }

    setToDate(value){
        this._toDate = value;
        return this;
    }

    setHotelId(value){
        this._hotelId = value;
        return this;
    }

    setRoomsCount(value) {
        this._roomsCount = value;
        return this;
    }

    setGuestsCount(value) {
        this._guestsCount = value;
        return this;
    }

    toJSON() {
        const base = super.toJSON();

        return {
            ...base,
            user: this._user,
            userEmail: this._userEmail,
            fromDate: this._fromDate,
            toDate: this._toDate,
            hotelId: this._hotelId,
            roomsCount: this._roomsCount,
            guestsCount: this._guestsCount,
        };
    }

    toModelValues() {
        const raw = this.toJSON();

        for (const key of Object.keys(raw)) {
            if (!raw[key]) delete raw[key];
        }

        return raw;
    }

    static fromRaw(
        raw: KeyValueHash | typeof BookingModel | any,
        options?: KeyValueHash,
    ): Booking {
        const instance = new this();

        instance
            .setId(raw.id)
            .setAuthorEmail(raw.authorEmail)
            .setName(raw.name)
            .setCreatedAt(raw.createdAt)
            .setUpdatedAt(raw.updatedAt)
            .setFromDate(raw.fromDate)
            .setToDate(raw.toDate)
            .setHotelId(raw.hotelId)
            .setRoomsCount(raw.roomsCount)
            .setGuestsCount(raw.guestsCount);

        if (options) {
            const { user } = options;

            if (user) {
                instance.setUser(user);
            }
        }

        return instance;
    }
}
