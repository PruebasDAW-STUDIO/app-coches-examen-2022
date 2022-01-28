const bcrypt = require('bcryptjs');

let  nodemailer = require('nodemailer');
const { mail } = require('../keys');
const helpers = {};

helpers.encryptPassword = async (password) => {
   const salt = await bcrypt.genSalt(10);
   const hash = await bcrypt.hash(password, salt);
   return hash;
};

helpers.matchPassword = async (password, savedPassword) =>{
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (e) {
        console.log(e);
    }
};

helpers.sendEmail = (fullname, username, email) => {

    const {user, pass} = mail

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        secure: false,
        auth: mail
    });

    let mensajeHTML = `
    <h1>Bienvenido a Links App ${fullname}<h1>
    <h2>Información de usuario</h2>
    <ul>
    <h4><li>Username: ${username}</li></h4>
    <h4><li>Email: ${email}</li></h4>
    </ul>
    <br>
    <h3><p>Esperamos que disfrutes de nuestra web.</p></h3>
    `

    let mensaje = "Bienvenido a Links App";
    
    let mailOptions = {
        from: 'Links App <pruebasdaw2021.gmail.com>',
        to: email,
        subject: "Registro correcto",
        html: mensajeHTML
    };

    return transporter.sendMail(mailOptions, function(error, info){

        if(error){
            console.log(error);
        }else{
            console.log('Email enviado correcto a ' + email + " Código: " + info.messageId);
        }
    });

};

module.exports = helpers;