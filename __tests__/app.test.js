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

const logIn = async (userInfo = {}) => {
  const password = userInfo.password ?? fakeUser.password;

  const agent = request.agent(app);

  const user = await UserService.create({ ...fakeUser, ...userInfo });

  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
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

  it('returns existing in user', async () => {
    await request(app).post('/api/v1/users').send(fakeUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'mrman@man.com', password: 'imtheman' });
    expect(res.status).toEqual(200);
  });

  it('tests if a user is authenticated', async () => {
    const res = await request(app).get('/api/v1/users/me');
    expect(res.status).toEqual(401);
  });

  it('tests if user is or is not an admin', async () => {
    const [agent] = await logIn();
    const res = await agent.get('/api/v1/users');
    expect(res.status).toEqual(401);
  });

  it('DELETE /sessions deletes the user session', async () => {
    const [agent] = await logIn();
    const resp = await agent.delete('/api/v1/users/sessions');
    expect(resp.status).toBe(204);
  });


  afterAll(() => {
    pool.end();
  });
});
