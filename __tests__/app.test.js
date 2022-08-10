const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

// test state
const fakeUser = {
  firstName: 'Mr',
  lastName: 'Man',
  email: 'mrman@man.com',
  password: 'imtheman'
};

describe('tests the user and auth', () => {
  beforeEach(() => {
    return setup(pool);
  });


  it('makes a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(fakeUser);
    const { firstName, lastName, email } = fakeUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      firstName,
      lastName,
      email
    });
  });


  afterAll(() => {
    pool.end();
  });
});
