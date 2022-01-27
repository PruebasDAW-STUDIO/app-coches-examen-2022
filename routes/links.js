var express = require('express');
var router = express.Router();
require('connect-flash');

const pool = require('../database');

const { isLoggedIn } = require('../lib/protect');

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.send("LINKS!!!");
});*/

router.get('/add', isLoggedIn, function(req, res, next){
  res.render('links/add');
  //res.send("FORM");
});

router.post('/add', isLoggedIn, async function(req, res){
  //res.render('links/add');
  const {title, url, description} = req.body;
  const newLink = {
    title,
    url,
    description,
    user_id: req.user.id
  };
  console.log(newLink);
  await pool.query('INSERT INTO links SET ?', [newLink]);
  //res.send("Received");
  //req.session.variable = 'Link saved successfully'
  req.flash('correcto', 'Link agregado correctamente');
  res.redirect('/links');
});

router.get('/', isLoggedIn, async function(req, res){
  
  const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
  //console.log(links);
  //res.send('Las listas irán aquí');
  res.render('links/list', {links});
  
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
  const {id} = req.params;
  await pool.query('DELETE FROM links WHERE id = ? AND user_id = ?', [id, req.user.id]);
  req.flash('correcto', 'Link borrado correctamente');
  res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
  const {id} = req.params;
  //console.log(id);
  //res.send('Received Edit');
  const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
  console.log(links[0]);
  res.render('links/edit', {link: links[0]});
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
  const {id} = req.params;
  const {title, url, description} = req.body;
  const newLink = {
    title,
    url,
    description
  };

  await pool.query('UPDATE links SET ? WHERE id = ? ', [newLink, id]);
  req.flash('correcto', 'Link actualizado correctamente');
  res.redirect('/links');
});


module.exports = router;