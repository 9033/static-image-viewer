var express = require('express');
var router = express.Router();
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');

const toHash = (password) =>{
  return crypto.createHash('sha512').update(password).digest('base64')  
}
require('dotenv').config();
const users = {
  admin:{
    password:process.env.ADMIN_PW,
  },
}

const check = function(req, res, next) {
  if(req.isAuthenticated()){
    console.log(req.session.passport.user);
    return next()
  }
  res.redirect('/login')
}

router.get('/',function(req, res, next) {
  req.logout();
  
  res.render('login', {
    title:'login',
  });
})

// 로그인 처리.
passport.use(new LocalStrategy(
  function(username, password, done) {
    if( users[username] && toHash(password) === users[username].password ){
      return done(null, username); // success
    }
    return done(null, false); // fail
  }
));

passport.serializeUser(function(user, done) {
  console.log('serializeUser', user);
  done(null, user)
});

passport.deserializeUser(function(id, done) {
  // 로그인 되어 있을때 passport.session에서 호출.
  console.log('deserializeUser', id);
  if( users[id] ){
    done(null, id)
  } else {
    done(null, false)
  }
});

// 로그인 정보 받는 라우터
router.post('/', 
passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
}),
)

module.exports = {
  check,
  router,
}
