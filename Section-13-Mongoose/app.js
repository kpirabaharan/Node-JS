const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

// const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   User.findById('63ce13b89d028165c8bc5794')
//     .then(user => {
//       req.user = new User(user.name, user.email, user.cart, user._id);
//       next();
//     })
//     .catch(err => {
//       console.log(err);
//     });
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Error Page for if nothing is catched
app.use(errorController.error);

mongoose
  .connect(
    'mongodb+srv://kpirabaharan:7tTH4fUSTDZ4fcz@node-nosql.b4w22at.mongodb.net/shop?retryWrites=true&w=majority',
  )
  .then(res => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
