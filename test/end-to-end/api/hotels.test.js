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


describe('Hotels Test', () => {

  beforeAll(async () => {});

  describe('Get hotels [GET] /api/v1/hotels', () => {

    it('should fail when query parameters is not valid: parameters required missing', async () => {
      await request
        .get(api('hotels'))
        .set(credentials)
        .query()
        .expect(...jsonContentTypeExpected)
        .expect(400)
        .expect((response) => {
          const { body } = response;
          const { errors } = body;

          expect(body).toHaveProperty('errors');
          expect(errors[0].path).toEqual(["coordinates"]);
          expect(errors[0].message).toEqual('\"coordinates\" is required');
        });
    });

    it('should fail when query parameters is not valid: parameter coordinates', async () => {
      await request
        .get(api('hotels'))
        .set(credentials)
        .query({
          'coordinates': '-----'
        })
        .expect(...jsonContentTypeExpected)
        .expect(400)
        .expect((response) => {
          const { body } = response;

          expect(body).toHaveProperty('errors');
        });
    });

    it('should get hotels', async () => {
      await request
        .get(api('hotels'))
        .set(credentials)
        .query({
          'coordinates': '48.130323,11.576362'
        })
        .expect(...jsonContentTypeExpected)
        .expect(200)
        .expect((response) => {
          const { body } = response;

          expect(body.length).toBeGreaterThanOrEqual(1);
          expect(body[0]).toHaveProperty('id');
          expect(body[0]).toHaveProperty('title');
        });
    });

  });
});
