require('dotenv').config();
const express = require('express');
const { sendTelexAlert } = require('./telexIntegration');
const { getFlutterwaveTransactions, getPaystackTransactions } = require('./paymentGateway');
const { sendSlackAlert } = require("./slackIntegration");
const { sendEmailAlert } = require("./emailIntegration");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware for parsing JSON requests

// 🔍 Monitor Payments Route
app.get('/monitor-payments', async (req, res) => {
    try {
        const flutterwaveData = await getFlutterwaveTransactions();
        const paystackData = await getPaystackTransactions();

        let failedPayments = [];

        if (flutterwaveData?.data) {
            failedPayments = failedPayments.concat(flutterwaveData.data.filter(txn => txn.status !== 'successful'));
        }

        if (paystackData?.data) {
            failedPayments = failedPayments.concat(paystackData.data.filter(txn => txn.status !== 'success'));
        }

        if (failedPayments.length > 0) {
            const alertMessage = `🚨 Alert: ${failedPayments.length} failed payments detected!`;

            await sendTelexAlert(alertMessage); // Send Telex alert

            for (const failedPayment of failedPayments) {
                await sendSlackAlert(failedPayment);  // Send Slack alert
                await sendEmailAlert(failedPayment);  // Send Email alert
            }
        }

        res.json({ message: 'Payment monitoring completed', failedPayments });
    } catch (error) {
        console.error('Error monitoring payments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 📩 Webhook for Payment Events
app.post("/webhook", async (req, res) => {
    const event = req.body;
    console.log("🔍 Received webhook event:", event);

    // Handle format from Postman (Direct request)
    if (event.status === "failed") {
        console.log(`⚠️ Failed Payment Alert: ${event.reference}`);

        await sendTelexAlert(event);  // Pass the full event object ✅
        await sendSlackAlert(event);
        await sendEmailAlert(event);
    }
    // Handle format from Telex (Webhook request)
    else if (event.event === "payment.failed") {
        const eventData = event.data;
        console.log(`⚠️ Failed Payment Alert: ${eventData.reference}`);

        await sendTelexAlert(eventData);  // Pass extracted event data ✅
        await sendSlackAlert(eventData);
        await sendEmailAlert(eventData);
    } 
    else {
        console.log("⚠️ Unrecognized event, skipping...");
    }

    res.sendStatus(200);
});


app.get("/config", (req, res) => {
    res.json({
      name: "Payment Monitoring & Alerts",
      type: "output",
      description: "Monitors failed payments, chargebacks, and revenue reports from Stripe, Flutterwave, and Paystack, sending alerts via Telex.",
      webhook_url: "https://payment-monitoring-alerts.onrender.com/webhook",
      events: ["payment.failed", "chargeback", "revenue.update"]
    });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
