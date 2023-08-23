var nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASS // naturally, replace both with your real credentials or an application-specific password
    }
});


const SendMail = (data, callback) => {
  
    transporter.sendMail({
      from: 'Barshaa <bcl.invoice.system@gmail.com>',
      to: data.to,
      subject: 'Barshaa | '+data.subject,
      html: data.html,
      attachments: data.attachments
    }).then((res) => {
      callback(null, res)
    }).catch((err) => {
      callback(err, null)
      console.log('err', err)
    })
}

module.exports = {
  SendMail
};