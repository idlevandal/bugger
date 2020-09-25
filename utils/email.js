const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1) create a transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
            auth: {
                user: process.env.SENDGRID_USERNAME,
                pass: process.env.SENDGRID_PASSWORD
            }
        // activate in gmail 'less secure app' option
    });

    // 2) define the email options
    const mailOptions = {
        from: `Dave Allen <${process.env.EMAIL_USERNAME}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
        // html:
    }
    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;