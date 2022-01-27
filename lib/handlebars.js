const {format} = require('timeago.js');

//OBJETO QUE SERÁ USADO POR NUESTRAS VISTAS DE HBS
const helpers = {};

//DENTRO DE ESTE OBJETO CREAMOS UN MÉTODO PARA USAR EN NUESTRA VISTA
helpers.timeago = (timestamp) => {

    return format(timestamp);

};

module.exports = helpers;