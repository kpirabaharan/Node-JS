const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');

const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('63d489878ad3d1fbece5da7f')
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
app.use(authRoutes);

// Error Page for if nothing is catched
app.use(errorController.error);

mongoose.set('strictQuery', true);

mongoose.connect('mongodb://localhost:27017/shop').then(async () => {
  console.log('Connected');
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
