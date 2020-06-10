const sgMail = require('@sendgrid/mail')

//const sendgridAPIKey = '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'
//sgMail.setApiKey(sendgridAPIKey)

sgMail.setApiKey(process.env.SEND_GRID_API_KEY)
const sendWelcomeEmail = (email, name) => {
    sgMail.send ({
        to: email,
        from: 'dohuycuong92@gmail.com',
        subject: 'testing email',
        text: `welcome ${name} join the app`
    })
}

const cancelEmail = (email, name) => {
    sgMail.send ({
        to: email,
        from: 'dohuycuong92@gmail.com',
        subject: 'goodbye',
        text: ` bye ${name}, tks for using my app `
    })
}

module.exports = {
    //short hand ES6
    sendWelcomeEmail,
    cancelEmail
}