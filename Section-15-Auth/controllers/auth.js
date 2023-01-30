const bcrypt = require('bcryptjs');
const e = require('express');

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
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });
    // User does not exist
    if (!user) {
      return res.redirect('/login');
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      console.log('Authenticated');
      req.session.isLoggedIn = true;
      req.session.user = user;
      await req.session.save();
      return res.redirect('/');
    }
    return res.redirect('/login');
  } catch (err) {
    console.log(err);
    return res.redirect('/login');
  }
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuth: false,
  });
};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  try {
    const existingUser = await User.findOne({ email: email });
    // User already exists
    if (existingUser) {
      return res.redirect('/signup');
    }
    const hashPass = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashPass,
      cart: { items: [] },
    });
    await user.save();
    return res.redirect('/login');
  } catch (err) {
    console.log(err);
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
