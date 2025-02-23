const nodemailer = require("nodemailer");

const sendEmailAlert = async (failedPayment) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT, 10),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Payment Alerts" <${process.env.EMAIL_USER}>`,
        to: process.env.ALERT_EMAIL,
        subject: "🚨 Failed Payment Alert",
        text: `A payment has failed!
        \n\nTransaction ID: ${failedPayment.reference}
        \nUser: ${failedPayment.user}
        \nAmount: ${failedPayment.amount} ${failedPayment.currency}
        \nReason: ${failedPayment.reason}`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        transporter.verify(function (error, success) {
            if (error) {
                console.error("SMTP Connection Error:", error);
            } else {
                console.log("SMTP Server is ready to take messages");
            }
        });
        console.log("✅ Email alert sent:", info.messageId);
    } catch (error) {
        console.error("❌ Failed to send email alert:", error.message);
    }
};

module.exports = { sendEmailAlert };
