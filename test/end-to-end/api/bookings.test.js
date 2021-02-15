const supertest = require('supertest');

const request = supertest('http://localhost:3000');
const prefix = '/v1/';
const jsonContentTypeExpected = ['Content-Type', 'application/json; charset=utf-8'];

function api(path) {
  return prefix + path;
}

const credentials = {
  'x-auth-token': '',
};

const bodyRequest = {
  authorEmail: "test@test.test",
  name:"Apartments Ante",
  fromDate: "2021-07-01",
  toDate: "2021-07-10",
  hotelId: "here:pds:place:191srg0t-38781aafcc414eed9314ea3b7c47b0fc",
  roomsCount: 2,
  guestsCount: 4,
};

describe('Bookings Test', () => {

  beforeAll(async () => {});

  describe('Create booking [POST] /api/v1/bookings', () => {

    it('should fail when body is not provided', async () => {
      await request
        .post(api('bookings'))
        .set(credentials)
        .send({})
        .expect(...jsonContentTypeExpected)
        .expect(400)
        .expect((response) => {
          const { body } = response;
          const { errors } = body;

          expect(body).toHaveProperty('errors');
          expect(errors.length).toBeGreaterThan(0);
        });
    });

    it('should fail when body is not valid: parameters required missing', async () => {
      await request
        .post(api('bookings'))
        .set(credentials)
        .send({
          "name":"Apartments Ante",
          "fromDate": "2021-07-01",
          "toDate": "2021-07-10",
          "hotelId": "here:pds:place:191srg0t-38781aafcc414eed9314ea3b7c47b0fc",
          "roomsCount": 2,
          "guestsCount": 4,
        })
        .expect(...jsonContentTypeExpected)
        .expect(400)
        .expect((response) => {
          const { body } = response;
          const { errors } = body;

          expect(body).toHaveProperty('errors');
          expect(errors.length).toBeGreaterThan(0);
          expect(errors[0].path).toEqual(["authorEmail"]);
        });
    });

    it('should fail when body is not valid: parameter type', async () => {
      await request
        .post(api('bookings'))
        .set(credentials)
        .send({
          "authorEmail": "test@test.test",
          "name":"Apartments Ante",
          "fromDate": "---",
          "toDate": "2021-07-10",
          "hotelId": "here:pds:place:191srg0t-38781aafcc414eed9314ea3b7c47b0fc",
          "roomsCount": 2,
          "guestsCount": 4,
        })
        .expect(...jsonContentTypeExpected)
        .expect(400)
        .expect((response) => {
          const { body } = response;
          const { errors } = body;

          expect(body).toHaveProperty('errors');
          expect(errors[0].path).toEqual(["fromDate"]);
          expect(errors[0].message).toEqual('\"fromDate\" must be a valid date');
        });
    });

    it('should create new booking', async () => {
      await request
        .post(api('bookings'))
        .set(credentials)
        .send(bodyRequest)
        .expect(...jsonContentTypeExpected)
        .expect(201)
        .expect((response) => {
          const { body } = response;

          expect(body).toHaveProperty('_id');
          expect(body).toHaveProperty('authorEmail');
          expect(body).toHaveProperty('hotelId');

          expect(body.authorEmail).toBe(bodyRequest.authorEmail);
          expect(body.hotelId).toEqual(bodyRequest.hotelId);
        });
    });

    it('should create new booking and verify inserted', async () => {
      await request
        .post(api('bookings'))
        .set(credentials)
        .send(bodyRequest)
        .expect(...jsonContentTypeExpected)
        .expect(201);

      await request
        .get(api('bookings'))
        .set(credentials)
        .send()
        .expect(...jsonContentTypeExpected)
        .expect(200)
        .expect((response) => {
          const { body } = response;

          expect(body.length).toBeGreaterThanOrEqual(1);
        });
    });

  });

  describe('Get bookings [GET] /api/v1/bookings', () => {

    it('should fail when query parameters are not valid: pageSize', async () => {
      await request
        .get(api('bookings'))
        .set(credentials)
        .query({
          page: 1,
          pageSize: 1,
        })
        .expect(...jsonContentTypeExpected)
        .expect(400)
        .expect((response) => {
          const { body } = response;
          const { errors } = body;

          expect(body).toHaveProperty('errors');
          expect(errors[0].path).toEqual(["pageSize"]);
          expect(errors[0].message).toEqual('\"pageSize\" must be greater than or equal to 5');
        });
    });

    it('should get bookings: without query parameters', async () => {
      await request
        .post(api('bookings'))
        .set(credentials)
        .send(bodyRequest)
        .expect(...jsonContentTypeExpected)
        .expect(201);

      await request
        .get(api('bookings'))
        .set(credentials)
        .query({})
        .expect(...jsonContentTypeExpected)
        .expect(200)
        .expect((response) => {
          const { body, header } = response;

          expect(header).toHaveProperty('x-pagination-current-page');
          expect(header).toHaveProperty('x-pagination-pages');
          expect(header).toHaveProperty('x-pagination-page-size');

          expect(body.length).toBeGreaterThanOrEqual(1);
          expect(body[0]).toHaveProperty('_id');
          expect(body[0]).toHaveProperty('authorEmail');
          expect(body[0]).toHaveProperty('hotelId');
        });
    });

    it('should get bookings: with query parameters', async () => {
      await request
        .post(api('bookings'))
        .set(credentials)
        .send(bodyRequest)
        .expect(...jsonContentTypeExpected)
        .expect(201);

      await request
        .get(api('bookings'))
        .set(credentials)
        .query({
          page: 1,
          pageSize: 10,
        })
        .expect(...jsonContentTypeExpected)
        .expect(200)
        .expect((response) => {
          const { body, header } = response;

          expect(header).toHaveProperty('x-pagination-current-page');
          expect(header).toHaveProperty('x-pagination-pages');
          expect(header).toHaveProperty('x-pagination-page-size');

          expect(body.length).toBeGreaterThanOrEqual(1);
          expect(body[0]).toHaveProperty('_id');
          expect(body[0]).toHaveProperty('authorEmail');
          expect(body[0]).toHaveProperty('hotelId');
        });
    });

    it('should get bookings verify query parameters: page', async () => {
      await request
        .get(api('bookings'))
        .set(credentials)
        .query({
          page: 100,
        })
        .expect(...jsonContentTypeExpected)
        .expect(200)
        .expect((response) => {
          const { body } = response;

          expect(body.length).toBe(0);
        });
    });

  });
});
