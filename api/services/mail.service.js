const nodemailer = require('nodemailer');
const EventEmitter = require('eventemitter3').EventEmitter;
const smtpTransportConfig = require('../../config/mail');

class Mail extends EventEmitter {
  constructor() {
    super();
    this.smtpTransport = nodemailer.createTransport(smtpTransportConfig);
  }

  connect() {
    return new Promise((resolve, reject) => {
      return this.smtpTransport.verify((err, success) => {
        return err ? reject(err) : resolve(success);
      });
    });
  }

  sendMail({ from, to, subject, html }) {
    const options = { from, to, subject, html };

    this.smtpTransport.sendMail(options, (err, success) => {
      if (err) return this.emit('error', err);

      this.emit('success', success);
    });
  }
}

module.exports = new Mail();
