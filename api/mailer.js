import nodemailer from 'nodemailer';

export default {

  createConfirmationMail(name, key) {
    const msgTxt = `Hey ${name} ! Welcome to Matcha :)
    To finalize tour inscription please use this confirmation key:
    ${key}
    at http://localhost:3000/activation`;
    const msgHtml = `<html><body><h1>Hey ${name} ! Welcome to Matcha :)</h1>
    <br/>
    <p>To finalize your inscription please use this confirmation key:</p>
    <p><b>${key}</b></p>
    <p>at http://localhost:3000/activation</p></body></html>`;
    return {'txt': msgTxt, 'html': msgHtml};
  },

  createResetPwMail(login, newPassword) {
    const msgTxt = `Hey ${login} !
    Your new password is: ${newPassword}`;
    const msgHtml = `<html><body><h1>Hey ${login} !</h1>
    <br/>
    Your new password is: ${newPassword}`;
    return {'txt': msgTxt, 'html': msgHtml};
  },

  sendMail(to, subject, msgTxt, msgHtml) {
    const transporter = nodemailer.createTransport(config.mailerConfig);
    const mail = {
      from: '"Matcha" <matcha-epillot@laposte.net>',
      to: to,
      subject: subject,
      text: msgTxt,
      html: msgHtml
    };
    transporter.sendMail(mail, (error, info) => {
      if (error) console.log('An error occured during when sending mail');
      else console.log('Mail sent: ', info.response);
    });
  },

}
