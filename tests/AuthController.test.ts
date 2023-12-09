import request from 'supertest';
import app from '../server';
import mongoose from 'mongoose';

describe('AuthController Endpoints', () => {
    let refreshToken: string;
    beforeAll(done => {
        done();
    })
      
    afterAll(done => {
        // Closing the DB and app connection allows Jest to exit successfully.
        mongoose.connection.close();
        app.close();
        done();
    })

    it('should register a new user', async () => {
        const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password',
        role: 'admin',
        };
        const response = await request(app)
        .post('/api/v1/register')
        .send(userData);
        expect(response.status).toBe(201);
    });

    it('should login with valid credentials', async () => {
        const loginData = {
        email: 'test@example.com',
        password: 'password',
        };

        const response = await request(app)
        .post('/api/v1/login')
        .send(loginData);
        refreshToken = response.body.data.refreshToken;
        expect(response.status).toBe(200);
    });

  it('should exchange refresh token', async () => {
    // Obtain a refresh token from a previous login or other means
    const response = await request(app)
      .post('/api/v1/exchange')
      .send({ refreshToken });
    expect(response.status).toBe(200);
  });
});
