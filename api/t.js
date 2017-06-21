import mail from './mailer';

const content = mail.createConfirmationMail('Etienne', 'aRandomKey');
mail.sendMail('etiennepillot@gmail.com', 'TEST', content['txt'], content['html']);
