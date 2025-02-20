require('dotenv').config();
const axios = require('axios');

const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

const getFailedPayments = async () => {
    // Mock failed transactions
    const failedPayments = [
        {
            id: "txn_001",
            user: "user@example.com",
            amount: 5000,
            status: "failed",
            reason: "Insufficient funds",
            timestamp: new Date().toISOString(),
        },
        {
            id: "txn_002",
            user: "anotheruser@example.com",
            amount: 10000,
            status: "failed",
            reason: "Card declined",
            timestamp: new Date().toISOString(),
        }
    ];
    
    console.log("Mock failed payments:", failedPayments);
    return failedPayments;
};
  
module.exports = { getFailedPayments };

// Function to fetch transactions from Flutterwave
async function getFlutterwaveTransactions() {
    try {
        const response = await axios.get('https://api.flutterwave.com/v3/transactions', {
            headers: {
                Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching Flutterwave transactions:', error);
        return null;
    }
}

// Function to fetch transactions from Paystack
async function getPaystackTransactions() {
    try {
        const response = await axios.get('https://api.paystack.co/transaction', {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching Paystack transactions:', error);
        return null;
    }
}

module.exports = {
    getFlutterwaveTransactions,
    getPaystackTransactions,
};
