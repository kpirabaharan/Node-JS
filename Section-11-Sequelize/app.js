const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

const sequelize = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Error Page for if nothing is catched
app.use(errorController.error);

sequelize
  .sync()
  .then((res) => {
    // console.log(res);
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
