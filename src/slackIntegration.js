const axios = require("axios");

const sendSlackAlert = async (failedPayment) => {
    const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

    if (!SLACK_WEBHOOK_URL) {
        console.error("Slack Webhook URL is missing!");
        return;
    }

    try {
        const response = await axios.post(SLACK_WEBHOOK_URL, {
            text: `🚨 *Failed Payment Alert*
            \n*Transaction ID:* ${failedPayment.reference}
            \n*User:* ${failedPayment.user}
            \n*Amount:* ${failedPayment.amount} ${failedPayment.currency}
            \n*Reason:* ${failedPayment.reason}`
        });

        console.log("✅ Slack alert sent:", response.data);
    } catch (error) {
        console.error("❌ Failed to send Slack alert:", error.message);
    }
};

module.exports = { sendSlackAlert };
