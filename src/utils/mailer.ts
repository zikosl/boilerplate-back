import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const sendEmail = ({ url, email, additional = "" }: { url: string, email: string, additional?: string }) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Hello From BusMapper',
        text: `You can validate Your email by visiting this link ${url}`
    };
    const htmlMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Hello From BusMapper',
        html: `<p>You can validate Your email by visiting this link ${url}<br/>
        Password : ${additional}
        <p>`
    };
    return new Promise((resolve, reject) => {
        transporter.sendMail(additional.length > 0 ? htmlMailOptions : mailOptions, (error, info) => {
            if (error) {
                reject(error.message);
            } else {
                resolve(info.response);
            }
        });
    });
}


export const sendEmailAttached = ({ url, email, additional = "", file }: { url: string, email: string, additional?: string, file: Buffer }) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Hello From BusMapper',
        html: `<div>
        <p>You will find attached your ticket</p>
        </div>`,
        attachments: [
            {
                filename: 'ticket.pdf',
                content: file,
                contentType: 'application/pdf',
            },
        ],
    };
    const htmlMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Hello From BusMapper',

        html: `<div>
        <p>You will find attached your ticket</p>
        <p>also we create an account for you and you can validate Your email by visiting this link ${url}<br/>
        <p>
        <p>
        Your Password : ${additional}
        </p>
        </div>`,
        attachments: [
            {
                filename: 'ticket.pdf',
                content: file,
                contentType: 'application/pdf',
            },
        ],
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(additional.length > 0 ? htmlMailOptions : mailOptions, (error, info) => {
            if (error) {
                reject(error.message);
            } else {
                resolve(info.response);
            }
        });
    });
}

// Email options
