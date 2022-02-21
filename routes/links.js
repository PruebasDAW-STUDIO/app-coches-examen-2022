var express = require('express');
var router = express.Router();
require('connect-flash');

const pool = require('../database');

const { isLoggedIn } = require('../lib/protect');

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.send("cars!!!");
});*/

router.get('/add', isLoggedIn, function(req, res, next){
  res.render('cars/add');
  //res.send("FORM");
});

router.post('/add', isLoggedIn, async function(req, res){
  //res.render('cars/add');
  const {marca, modelo,potencia, url} = req.body;
  const newLink = {
    marca,
    modelo,
    potencia,
    url,
    user_id: req.user.id
  };
  console.log(newLink);
  await pool.query('INSERT INTO cars SET ?', [newLink]);
  //res.send("Received");
  //req.session.variable = 'Link saved successfully'
  req.flash('correcto', 'Link agregado correctamente');
  res.redirect('/cars');
});

router.get('/', isLoggedIn, async function(req, res){
  
  const coches = await pool.query('SELECT * FROM cars WHERE user_id = ?', [req.user.id]);
  //console.log(cars);
  //res.send('Las listas irán aquí');
  res.render('cars/list', {coches});
  
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
  const {id} = req.params;
  await pool.query('DELETE FROM cars WHERE id = ? AND user_id = ?', [id, req.user.id]);
  req.flash('correcto', 'Link borrado correctamente');
  res.redirect('/cars');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
  const {id} = req.params;
  //console.log(id);
  //res.send('Received Edit');
  const cars = await pool.query('SELECT * FROM cars WHERE id = ?', [id]);
  console.log(cars[0]);
  res.render('cars/edit', {link: cars[0]});
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
  const {id} = req.params;
  const {marca, modelo, potencia, url} = req.body;
  const newLink = {
    marca,
    modelo,
    potencia,
    url
  };

  await pool.query('UPDATE cars SET ? WHERE id = ? AND user_id = ?', [newLink, id, req.user.id]);
  req.flash('correcto', 'Link actualizado correctamente');
  res.redirect('/cars');
});


module.exports = router;