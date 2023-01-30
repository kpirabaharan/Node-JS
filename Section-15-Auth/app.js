const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');

const User = require('./models/user');

const app = express();
const MONGODB_URI = 'mongodb://localhost:27017/shop';

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Session Init
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
      collectionName: 'sessions',
    }),
  }),
);

app.use(async (req, res, next) => {
  try {
    if (!req.session.user) {
      return next();
    }
    const user = await User.findById(req.session.user._id);
    req.user = user;
    return next();
  } catch (err) {
    console.log(err);
  }
});

// Checks all routes from separate file, admin has leading route /admin
app.use(authRoutes);
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Error Page for if nothing is catched, at end so it checks all other routes first
app.use(errorController.error);

mongoose.set('strictQuery', true);

mongoose.connect(MONGODB_URI).then(async () => {
  try {
    console.log('Mongo Connected');
    app.listen(3000);
  } catch (err) {
    console.log(err);
  }
});
