import request from 'supertest';
import app from '../src/app';
import faker from 'faker'

const baseUrl = "http://localhost:3000"
let allowedTlds = ['com', 'net', 'de', 'io'] // supported TLD-s(top level domains)
const randomFirstName = faker.name.firstName();
const randomLastName = faker.name.lastName();
let fullName = `${randomFirstName} ${randomLastName}`
const emailAddress = `${randomFirstName}.${randomLastName}@hotmail.${allowedTlds[Math.floor(Math.random() * 4)]}`.toLowerCase();
const badEmail = `${randomFirstName}@live.co.uk`.toLowerCase();

const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTZlZTU5MDJlM2Q3NDNiZjQ1NThlNTYiLCJpYXQiOjE2MzQ2NTc5OTV9.1okRPNSJk4kQq1McwlwAZyXvoKCl_MmdODkPpVzD9b8"
const userId = "616ee5902e3d743bf4558e56"


describe('Test Signup Endpoint', () => {
  test('GET /random-url should return 404', done => {
    request(baseUrl).get('/reset')
      .expect(404, done);
  });

  test('POST /signup should return 200', done => {
    request(baseUrl).post("/signup").send({ name: fullName, email: emailAddress, password: "testpassword" }).expect(200, done)
  })

  test('POST /signup should return 400 when providing the same email', done => {
    request(baseUrl).post("/signup").send({ name: fullName, email: emailAddress, password: "testpassword" }).expect(400, done)
  })

  test('POST /signup should return 400 when providing an unsupported email', done => {
    request(baseUrl).post("/signup").send({ name: fullName, email: badEmail, password: "testpassword" }).expect(400, done)
  })

});

describe('Test Login Endpoint', () => {

  test('POST /login should return 200', done => {
    request(baseUrl).post("/login").send({ email: emailAddress, password: "testpassword" }).expect(200, done)
  })

  test('POST /login should return 400 when providing an incorrect password', done => {
    request(baseUrl).post("/login").send({ email: emailAddress, password: "badpassword" }).expect(400, done)
  })

})

describe('Test Self-Info Endpoint', () => {

  test('GET /me should return 200', done => {
    request(baseUrl).get("/me").set("Authorization", testToken).expect(200, done)
  })

  test('GET /me should return 400 when providing no token or bad token ', done => {
    request(baseUrl).get("/me").set("Authorization", "badtoken").expect(400, done)
  })
})

describe('Test Update Password Endpoint', () => {

  test('PATCH /update-password should return 400 when providing an incorrect old password', done => {
    request(baseUrl).patch("/me/update-password").set("Authorization", testToken).send({ oldPassword: "testpassword", newPassword: "newtestpassword", confirmPassword: "newtestpassword" }).expect(400, done)
  })

  test('PATCH /update-password should return 400 when new password is not confirmed 2 times', done => {
    request(baseUrl).patch("/me/update-password").set("Authorization", testToken).send({ oldPassword: "newtestpassword", newPassword: "newnewtestpassword", confirmPassword: "newtestpassword" }).expect(400, done)
  })
})

describe('Test Find Endpoint', () => {

  test('GET /user/:id should return 200', done => {
    request(baseUrl).get(`/user/${userId}`).expect(200, done);
  });

  test('GET /user/:id should return 500 when using a bad path', done => {
    request(baseUrl).get(`/user/badIdPath`).expect(400, done);
  });
})

describe('Test Like Endpoint', () => {

  test('POST /user/:id/like should return 200', done => {
    request(baseUrl).post(`/user/${userId}/like`).set("Authorization", testToken).expect(200, done);
  });

  test('POST /user/:id/like should return 400 when liking more than once', done => {
    request(baseUrl).post(`/user/${userId}/like`).set("Authorization", testToken).expect(400, done);
  });
})

describe('Test Unlike Endpoint', () => {

  test('POST /user/:id/unlike should return 200', done => {
    request(baseUrl).post(`/user/${userId}/unlike`).set("Authorization", testToken).expect(200, done);
  });

  test('POST /user/:id/unlike should return 400 when unliking someone without liking them first', done => {
    request(baseUrl).post(`/user/${userId}/unlike`).set("Authorization", testToken).expect(400, done);
  });
})

describe('Test Most-Liked Endpoint', () => {

  test('GET /most-liked should return 200', done => {
    request(baseUrl).get('/most-liked').expect(200, done);
  });

})