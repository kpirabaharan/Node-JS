const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuth: req.session.isLoggedIn,
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const user = await User.findById('63d6bb341a412e96269053fa');
    req.session.isLoggedIn = true;
    req.session.user = user;
    await req.session.save();
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuth: false,
  });
};

exports.postSignup = (req, res, next) => {};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
