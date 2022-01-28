const mysql = require('mysql');

const {promisify} = require('util');

var database;

const { database_dev, database_prod } = require('./keys');


if (process.env.NODE_ENV === 'produccion'){
    console.log('PRODUCCION');
    //var pool = mysql.createPool(database_prod);
    database = database_prod
}else{
    //const pool = mysql.createPool(database_dev);
    console.log('DESARROLLO');
    //var pool = mysql.createPool(database_dev);
    database = database_dev
}


 


//CREAMOS LA CONEXION CON LA BASE DE DATOS
const pool = mysql.createPool(database);
pool.getConnection((err, connection) => {

    if (err) {
        
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('DATABASE CONNECTION WAS CLOSED');
        }

        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }

        if (err.code === 'ECONNREFUSED') {
            console.error('DATABASE CONNECTION WAS REFUSED');
        }

    }

    if (connection){
        connection.release();
        console.log('DB is Connected');
    }

    return;

});

pool.query = promisify(pool.query); 
module.exports = pool;