const fs = require('fs')
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2

const mailer = async function(emailAddres, pdfName, stream) {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  )

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  })

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject()
      }
      resolve(token)
    })
  })

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_USER,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN
    }
    // auth: {
    //   user: process.env.EMAIL_USER,
    //   pass: process.env.EMAIL_PASSWD
    // }
  })

  // send mail with defined transport object
  await transporter.sendMail(
    {
      from: '"SEDEPTI" <sedepti.suporte@gmail.com>', // sender address
      to: emailAddres, // list of receivers
      subject: 'Ficha catalográfica - FICAT', // Subject line
      text:
        'Olá! Segue em anexo a cópia requisitada da sua ficha catalográfica.', // plain text body
      // html: '<b>Hello world?</b>', // html body
      attachments: [
        {
          filename: pdfName,
          path: stream
        }
      ]
    },
    err => {
      if (err) {
        console.log(err)
      }
      fs.unlink('./assets/pdf_location/ficha.pdf', err => {
        if (err) {
          console.error(err)
        } else {
          console.log('cleared')
        }
      })
    }
  )
}

module.exports = mailer
