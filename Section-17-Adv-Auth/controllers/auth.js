const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
// const { MailtrapClient} = require('mailtrap');

const User = require('../models/user');

// Email
const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '649c090631f9dd',
    pass: '43c4c55d75d7a8',
  },
});

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
  });
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });
    // User does not exist
    if (!user) {
      req.flash('error', 'Invalid email or password.');
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
    req.flash('error', 'Invalid email or password.');
    return res.redirect('/login');
  } catch (err) {
    console.log(err);
    return res.redirect('/login');
  }
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuth: false,
    errorMessage: message,
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
      req.flash('error', 'Email exists already, please enter a different one.');
      return res.redirect('/signup');
    }
    const hashPass = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashPass,
      cart: { items: [] },
    });
    await user.save();
    const mailOptions = {
      to: email,
      from: 'shop@nodeapp.com',
      subject: 'Signup succeeded!',
      text: 'Hey there, it’s our first message sent with Nodemailer 😉 ',
      html: '<h1>You successfully signed up!</h1>',
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });
    return res.redirect('/login');
  } catch (err) {
    console.log(err);
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reser',
    pageTitle: 'Reset Password',
    isAuth: false,
    errorMessage: message,
  });
};
