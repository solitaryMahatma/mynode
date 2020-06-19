let request = require('supertest');
const { domain } = require('../src/config').app;

request = request(domain);

describe('user.test.js', () => {
  test('测试登陆 /api/user/signin', async () => {
    const res = await request
      .post('/api/user/signin')
      .send({
        phoneNumber: 13800138006,
        password: '123456789'
      });
    expect(res.status).toBe(201);
  });
});
