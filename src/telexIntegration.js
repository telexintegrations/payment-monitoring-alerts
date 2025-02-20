require('dotenv').config();
const axios = require('axios');

const TELEX_WEBHOOK_URL = process.env.TELEX_WEBHOOK_URL;

async function sendTelexAlert(failedPayment) {
    if (!TELEX_WEBHOOK_URL) {
        console.error("❌ Telex Webhook URL is missing!");
        return;
    }

    console.log("📌 Received Failed Payment Data:", failedPayment);  // Log the object

    if (!failedPayment || !failedPayment.reference) {
        console.error("❌ Invalid payment data received!");
        return;
    }

    const payload = {
        event_name: "Payment Issue",  
        username: "EstherBot",             
        status: "success",                    
        message: `🚨 Failed Payment Detected! 
        \n**Transaction ID:** ${failedPayment.reference} 
        \n**User:** ${failedPayment.user} 
        \n**Amount:** ${failedPayment.amount} ${failedPayment.currency} 
        \n**Reason:** ${failedPayment.reason}`
    };

    console.log("🔍 Telex Payload:", payload);

    try {
        const response = await axios.post(TELEX_WEBHOOK_URL, payload, {
            headers: { "Content-Type": "application/json" }
        });
        console.log("✅ Telex Alert Sent:", response.data);
    } catch (error) {
        console.error("❌ Error sending Telex alert:", error.response?.data || error.message);
    }
}

module.exports = { sendTelexAlert };
