const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  //   let testAccount = await nodemailer.createTestAccount();
  // Debugging the environment variables
  console.log("SMTP Configurations: ");
  console.log(process.env.SMTP_HOST); // Should be "smtp.mailtrap.io"
  console.log(process.env.SMTP_PORT); // Should be 2525
  console.log(process.env.SMTP_USER);
  console.log(process.env.SMTP_PASS);

  // Looking to send emails in production? Check out our Email API/SMTP product!
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: "1b4a4b0736c42a",
      pass: "6767c8185f9dbe",
    },
  });

  //   const message = {
  //     from: `${process.env.SMTP_FROM_NAME}<${process.env.SMTP_FROM_EMAIL}>`, // Your sender email
  //     to: options.email, // Recipient email
  //     subject: options.subject, // Subject line
  //     text: options.message, // Message content
  //   };

  await transport.sendMail({
    from: `${process.env.SMTP_FROM_NAME}<${process.env.SMTP_FROM_EMAIL}>`, // Your sender email
    to: options.email, // Recipient email
    subject: options.subject, // Subject line
    text: options.message, // Message content
  });
  console.log("Email sent successfully");
};

module.exports = sendEmail;
