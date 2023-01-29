const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuth: req.session.user,
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const user = await User.findById('63d5e4e076c03048425e7604');
    req.session.isLoggedIn = true;
    req.session.user = user;
  } catch (err) {
    console.log(err);
  } finally {
    res.redirect('/');
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
