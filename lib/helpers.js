const bcrypt = require('bcryptjs');
const pool = require('../database');
const jwt = require('jsonwebtoken');

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






helpers.sendEmailReset = (username, email, resetlink) => {


    

    const {user, pass} = mail

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        secure: false,
        auth: mail
    });

    let mensajeHTML = `   
    <h2>Información de usuario</h2>
    <ul>
    <h4><li>Username: ${username}</li></h4>
    <h4><li>Email: ${email}</li></h4>
    </ul>
    <br>
    <h3><p>Esperamos que disfrutes de nuestra web.</p></h3>
    ${resetlink}
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









helpers.existeUsuario = async (username) => {
 //console.log("EXISTE USUARIO ",username);
 const result = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
 console.log(result);
 var existe = false;

 if(result.length > 0){
    console.log('EXISTE');
    existe = true;
 }else{
    console.log('VACIO');
    existe = false;
    
 }
 console.log(result);
 return {existe, result};
};

helpers.ensureToken = (req, res, next) => {
    const cabeceraPortador = req.headers['authorization'];
    console.log("PUTA MIERDA:", cabeceraPortador);

    if(typeof cabeceraPortador !== 'undefined') {
        const portador = cabeceraPortador.split(" ");
        const token = portador[1];
        req.token = token;
        next();
    }else{
        res.sendStatus(403);
    }
};

module.exports = helpers;