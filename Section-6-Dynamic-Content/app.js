const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

var hbs = exphbs.create({
  // layoutsDir: 'views/layouts',
  // defaultLayout: 'main-layout',
  // extname: 'hbs',
});

// Register `hbs.engine` with the Express app.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

// Error Page for if nothing is catched
app.use((req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

app.listen(3000);
