import request from 'supertest';
import app from '../server';
import mongoose from 'mongoose';

describe('SupportAgentController Endpoints', () => {
    let BEARER_TOKEN: string;

    beforeAll(done => {
        done();
    })
      
    afterAll(done => {
        mongoose.connection.close();
        app.close();
        done();
    })

    it('should get all support requests', async () => {
        const response = await request(app).get('/support_requests').set('Authorization', `Bearer ${BEARER_TOKEN}`);
        expect(response.status).toBe(200);
    });

    it('should get a support request by ID', async () => {
        const response = await request(app).get('/support_requests/REQUEST_ID').set('Authorization', `Bearer ${BEARER_TOKEN}`);
        expect(response.status).toBe(200);
    });

    it('should update support request status', async () => {
        const response = await request(app)
        .put('/support_requests/REQUEST_ID')
        .set('Authorization', `Bearer ${BEARER_TOKEN}`)
        .send({ status: 'closed'});
        expect(response.status).toBe(200);
    });

    it('should create a comment for a support request', async () => {
        const response = await request(app)
        .post('/comments/SUPPORT_REQUEST_ID')
        .set('Authorization', `Bearer ${BEARER_TOKEN}`)
        .send({
            // Your comment data here
        });
        expect(response.status).toBe(200);
    });
});