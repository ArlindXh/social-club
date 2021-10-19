import request from 'supertest';
import app from '../src/app';
import dotenv from 'dotenv';
dotenv.config();

jest.mock('../src/models/Users', () => ({delete: jest.fn() }));

describe('Test App', () => {
  // test('GET /random-url should return 404', done => {
  //   request(app).get('/reset')
  //     .expect(404, done);
  // });

  test('GET /me should return 200', done => {
    request(app).get('/me').set('Authorization', process.env.TEST_TOKEN).expect(200, done);
  });
});