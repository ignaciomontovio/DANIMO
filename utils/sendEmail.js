const nodemailer = require("nodemailer");

module.exports = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    await transporter.sendMail({
        from: "DANIMO, tu diario emocional",
        to,
        subject,
        text
    });
};
