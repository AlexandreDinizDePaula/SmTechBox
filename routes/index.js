var express = require('express');
var passport = require('passport');
var router = express.Router();


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
  // req.user is available for use here
  return next(); }
  // denied. redirect to login
  res.redirect('/')
  }
  
/* GET home page. */
router.get('/', function(req, res, next) {
res.render('index');
});

router.get('/auth/github',
passport.authenticate('github'));

router.get('/auth/github/callback',
passport.authenticate('github', { failureRedirect: '/login' }),
function(req, res) {
// Successful authentication, redirect home.

res.redirect('/principal');
});

router.get('/', ensureAuthenticated, function(req, res) {
  res.render('principal', { user: req.session.passport.user })
  });
  

module.exports = router;
