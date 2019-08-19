require('dotenv').config();
const code = require('../services/crypto.service').generateCode();

const mailTitle = 'Diaspora Invest: Verify Account';
const verifyLink = new URL(
  `http://localhost:${process.env.PORT}/api/v1/public/verify-email/${code}`
);
const message = `<p>To very your account, please click on the following link: <a href=${verifyLink}>Verify my account</a>.</p>
          <p>If the link does not work, please copy this URL into your browser and click enter: ${verifyLink}</p>`;
const mailBody = `<!DOCTYPE html><html><head><title>Message</title></head><body>${message}</body></html>`;

module.exports = { mailTitle, mailBody };
