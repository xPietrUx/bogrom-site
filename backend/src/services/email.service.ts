import Mailgun from 'mailgun.js';
import formData from 'form-data';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY || '',
});

export const sendContactEmail = async (
    name: string,
    email: string,
    phone: string,
    subject: string,
    message: string
) => {
    const domain = process.env.MAILGUN_DOMAIN;
    if (!domain) {
        throw new Error(
            'MAILGUN_DOMAIN nie jest zdefiniowany w zmiennych środowiskowych.'
        );
    }

    const mailData = {
        from: `Formularz Kontaktowy <mailgun@${domain}>`,
        to: [process.env.MAILGUN_EMAIL_TO || ''],
        subject: `Wiadomość z formularza: ${subject}`,
        html: `
            <h2>Wiadomość z formularza kontaktowego</h2>
            <p><strong>Imię i nazwisko:</strong> ${name}</p>
            <p><strong>Adres e-mail:</strong> ${email}</p>
            <p><strong>Telefon:</strong> ${phone}</p>
            <p><strong>Temat:</strong> ${subject}</p>
            <hr>
            <h3>Wiadomość:</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
        `,
        'h:Reply-To': email,
    };

    await mg.messages.create(domain, mailData);
};
