const nodemailer = require('nodemailer');
const config = require('../config/config');

const sendMail = async (mailOptions) => {
  let sendMailOptions = {
    ...mailOptions,
    from: "'The Idea project'",
    // sender: "smtp.mailtrap.live",
  };

  console.log('Mail Options:', sendMailOptions); // Check mail options

  var transport = nodemailer.createTransport({
    // host: "live.smtp.mailtrap.io",
    service: 'gmail',
    port: 587,
    auth: {
      user: 'ranasaif378@gmail.com',
      pass: 'ewfa ahoi gfus ykbj',
      // pass: "cugt ylpe xjrm coqs",
    },
  });

  try {
    const response = await transport.sendMail(sendMailOptions);
    console.log('Email Sent Response:', response); // Log email send response
    if (response.accepted.length > 0) {
      return true;
    } else {
      return false; // Handle if no recipients accepted the email
    }
  } catch (error) {
    console.error('Error Sending Email:', error); // Log any errors that occur
    return false;
  }
};

module.exports = { sendMail };
