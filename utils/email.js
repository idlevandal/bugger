const nodemailer = require('nodemailer');

const sendEmail = async options => {
    console.log(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);
    // 1) create a transporter
    const transporter = nodemailer.createTransport({
        service: 'SendGrid',
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
    console.log('ma', mailOptions);
    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;