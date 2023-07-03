const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: "webdevbiv@ukr.net",
    pass: "RIdoa05jAzIC8CeY",
  },
});

async function sendEmail({ userName, userEmail, userText }) {
  const output = `  <h1 style="color: green">Hello director you got mail!</h1>
  <p>Name of sender: ${userName}</p>
  <p>Contact email is: ${userEmail}</p>
  <p style="color: blue">Email text: ${userText}</p>
`;
  const info = await transporter.sendMail({
    from: "webdevbiv@ukr.net", // sender address
    to: "webdevbiv@gmail.com", // list of receivers
    subject: "Email for director", // Subject line
    text: userText, // plain text body
    html: output,
  });

  console.log("Message sent: %s", info.messageId);
  return true;
}

module.exports = sendEmail;
