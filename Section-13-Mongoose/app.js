const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('63d356eec5ea0d7fbd989ce7')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Error Page for if nothing is catched
app.use(errorController.error);

mongoose
  .connect(
    'mongodb+srv://kpirabaharan:7tTH4fUSTDZ4fcz@node-nosql.b4w22at.mongodb.net/shop?retryWrites=true&w=majority',
  )
  .then(async res => {
    try {
      const existingUser = await User.findOne();
      if (!existingUser) {
        const user = new User({
          name: 'Keeshigan',
          email: 'Keeshigan@test.com',
          cart: { items: [] },
        });
        user.save();
      }
    } catch (err) {
      console.log(err);
    } finally {
      app.listen(3000);
    }
  });
