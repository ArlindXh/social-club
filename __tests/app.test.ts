import request from 'supertest';
import app from '../src/app';
import faker from 'faker'
import mongoose from "mongoose";
import User from "../src/models/Users";
import { hashPassword } from "../src/util/auth";
import { generateToken } from "../src/util/jwt";
import dotenv from "dotenv"
dotenv.config();

let allowedTlds = ['com', 'net', 'de', 'io'] // supported TLD-s(top level domains)
const randomFirstName = faker.name.firstName();
const randomLastName = faker.name.lastName();
let fullName = `${randomFirstName} ${randomLastName}`
const emailAddress = `${randomFirstName}.${randomLastName}@hotmail.${allowedTlds[Math.floor(Math.random() * 4)]}`.toLowerCase();
const badEmail = `${randomFirstName}@live.co.uk`.toLowerCase();

var testToken = "";
var userId = "";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  const hashedPassword = await hashPassword("testpassword");
  const user = await User.create({
    email: `test${emailAddress}`,
    name: "Filan fisteku",
    password: hashedPassword,
  });
  let token = generateToken(user._id);
  testToken = token;
  userId = user._id;
})

afterAll(async () => {
  await mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  await User.deleteOne({
    email: `test${emailAddress}`,
  });


});

describe('Test Signup Endpoint', () => {

  test('GET /random-url should return 404', done => {
    request(app).get('/random-url')
      .expect(404, done);
  });

  test('POST /signup should return 200', done => {
    request(app).post("/signup").send({ name: fullName, email: emailAddress, password: "testpassword" }).expect(200, done)
  })

  test('POST /signup should return 400 when providing the same email', done => {
    request(app).post("/signup").send({ name: fullName, email: emailAddress, password: "testpassword" }).expect(400, done)
  })

  test('POST /signup should return 400 when providing an unsupported email', done => {
    request(app).post("/signup").send({ name: fullName, email: badEmail, password: "testpassword" }).expect(400, done)
  })

});

describe('Test Login Endpoint', () => {

  test('POST /login should return 200', done => {
    request(app).post("/login").send({ email: emailAddress, password: "testpassword" }).expect(200, done)
  })

  test('POST /login should return 400 when providing an incorrect password', done => {
    request(app).post("/login").send({ email: emailAddress, password: "badpassword" }).expect(400, done)
  })

})

describe('Test Self-Info Endpoint', () => {
  test('GET /me should return 200', done => {
    request(app).get("/me").set("Authorization", testToken).expect(200, done)
  })

  test('GET /me should return 400 when providing no token or bad token ', done => {
    request(app).get("/me").set("Authorization", "badtoken").expect(400, done)
  })
})

describe('Test Update Password Endpoint', () => {

  test('PATCH /update-password should return 400 when providing an incorrect old password', done => {
    request(app).patch("/me/update-password").set("Authorization", testToken).send({ oldPassword: "incorrect", newPassword: "newtestpassword", confirmPassword: "newtestpassword" }).expect(400, done)
  })

  test('PATCH /update-password should return 400 when new password is not confirmed 2 times', done => {
    request(app).patch("/me/update-password").set("Authorization", testToken).send({ oldPassword: "newtestpassword", newPassword: "newnewtestpassword", confirmPassword: "newtestpassword" }).expect(400, done)
  })
})

describe('Test Find Endpoint', () => {

  test('GET /user/:id should return 200', done => {
    request(app).get(`/user/${userId}`).expect(200, done);
  });

  test('GET /user/:id should return 500 when using a bad path', done => {
    request(app).get(`/user/badIdPath`).expect(400, done);
  });
})

describe('Test Like Endpoint', () => {

  test('POST /user/:id/like should return 200', done => {
    request(app).post(`/user/${userId}/like`).set("Authorization", testToken).expect(200, done);
  });

  test('POST /user/:id/like should return 400 when liking more than once', done => {
    request(app).post(`/user/${userId}/like`).set("Authorization", testToken).expect(400, done);
  });
})

describe('Test Unlike Endpoint', () => {

  test('POST /user/:id/unlike should return 200', done => {
    request(app).post(`/user/${userId}/unlike`).set("Authorization", testToken).expect(200, done);
  });

  test('POST /user/:id/unlike should return 400 when unliking someone without liking them first', done => {
    request(app).post(`/user/${userId}/unlike`).set("Authorization", testToken).expect(400, done);
  });
})

describe('Test Most-Liked Endpoint', () => {

  test('GET /most-liked should return 200', done => {
    request(app).get('/most-liked').expect(200, done);
  });

})