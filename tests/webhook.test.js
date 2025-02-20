const request = require('supertest');
const app = require('../index');

describe('Webhook Tests', () => {
    it('should process a failed payment event', async () => {
        const response = await request(app)
            .post('/webhook')
            .send({ type: 'payment.failed', data: { transaction_id: '12345', amount: 5000, customer: { email: 'test@example.com' } } });

        expect(response.status).toBe(200);
    });
});
