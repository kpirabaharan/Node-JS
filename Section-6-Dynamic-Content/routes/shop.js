const path = require('path');
const express = require('express');

// const rootDir = require(path.join(__dirname, '..', 'util', 'path.js'));
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
  const products = adminData.products;
  res.render('shop', { pageTitle: 'My Shop', path: '/', prods: products });
});

module.exports = router;
