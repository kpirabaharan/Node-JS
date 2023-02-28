const crypto = require('crypto');

// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const bcrypt = require('bcryptjs');
// const nodemailer = require('nodemailer');
// let aws = require('@aws-sdk/client-ses');
// let { defaultProvider } = require('@aws-sdk/credential-provider-node');

const User = require('../models/user');

// const ses = new aws.SES({
//   apiVersion: '2010-12-01',
//   region: 'us-east-1',
//   defaultProvider,
// });

// // Email
// let transporter = nodemailer.createTransport({
//   SES: { ses, aws },
// });

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
    // const mailOptions = {
    //   to: email,
    //   from: 'kpirabaharan3@gmail.com',
    //   subject: 'Signup succeeded!',
    //   text: 'Hey there, it’s our first message sent with Nodemailer 😉 ',
    //   html: '<h1>You successfully signed up!</h1>',
    // };
    // transporter.sendMail(mailOptions, (err, info) => {
    //   if (err) {
    //     return console.log(err);
    //   }
    //   console.log('Message sent: %s', info.messageId);
    // });
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
    path: '/reset',
    pageTitle: 'Reset Password',
    isAuth: false,
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  const emailAddr = req.body.email;
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    try {
      const user = await User.findOne({ email: emailAddr });
      if (!user) {
        req.flash('error', 'No account with that email found.');
        return res.redirect('/reset');
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      await user.save();
      // const mailOptions = {
      //   to: emailAddr,
      //   from: 'kpirabaharan3@gmail.com',
      //   subject: 'Password Reset',
      //   text: 'You requested a password reset.',
      //   html: `<h1>You requested a password reset.</h1>
      //         <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>`,
      // };
      // transporter.sendMail(mailOptions, (err, info) => {
      //   if (err) {
      //     return console.log(err);
      //   }
      //   console.log('Message sent: %s', info.messageId);
      // });
      return res.redirect('/login');
    } catch (err) {
      console.log(err);
    }
  });
};

exports.getNewPassword = async (req, res, next) => {
  const token = req.params.token;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'New Password',
      isAuth: false,
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken: token,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postNewPassword = async (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const token = req.body.passwordToken;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    });
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
    res.redirect('/login');
  } catch (err) {
    console.log(err);
  }
};
