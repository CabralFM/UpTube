require('dotenv').config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASS
    }
    //attachDataUrls: true, // #1
    //disableFileAccess: true, // #2
    //disableUrlAccess: true, // #3

    // can generate test SMTP service account from ethereal.email
    // if you don't have a real mail account for testing
    // create reusable transporter object using the default SMTP transport:
    // host: "smtp.ethereal.email",
    // port: 587,
    //secure: false, // true for 465, false for other ports
    //host: 'smtp.gmail.com',
    //port: 465,
    //secure: false,
    //auth: {
    //    xoauth2: xoauth2.createXOAuth2Generator({
    //        user: process.env.USER,
    //        pass: process.env.PASSWORD,
    //        clientId: '',
    //        clientSecret: '',
    //        refreshToken: ''
    //    })
    //}
});

//console.log(process.env.MAIL);
//console.log(process.env.MAIL_PASS);

async function emailService(to, subject, body) {
    try {
        let info = await transporter.sendMail({
            //from: process.env.EMAIL,
            from: {name: 'UPtube', address: 'noreply.upskill.uptube@gmail.com'},
            replyTo: 'noreply.upskill.uptube@gmail.com',
            to: to,
            //to: 'jrochafonso@gmail.com',
            //to: 'pmargarida.rocha@gmail.com',
            //cc:
            subject: subject,
            //subject: 'You have a notification from UPtube',
            text: body
            //text: 'hello world!'
            //html:
            //attachments:
            //TODO: perguntar
        });
        console.log('email sent: ' + info.response);
    } catch (err) {
        console.log(err)
        //return res.status(404).json({success: false, error: err});
    }
}

/*
html: `
<div>
<a href="${process.env.CLIENT_URL}" ><img src="" alt=""/></a>
</div>
<div>
<p>Name: ${name}</p>
<p>Email: ${email}</p>
<p>Message: ${notification}</p>
</div>
`
*/

/* INFO:
#1. if true, converts data: images in the HTML content in every message to embedded attachments.
#2. if true, then does not allow to use files as content;
    use it when you want to use JSON data from untrusted source as the email;
    if an attachment or message node tries to fetch something from a file the sending returns an error.
#3. if true, then does not allow to use Urls as content.
*/

module.exports = {emailService};
