const path = require('path');
const express = require('express');

// const rootDir = require(path.join(__dirname, '..', 'util', 'path.js'));

const router = express.Router();

const products = [];

router.get('/add-product', (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
  });
});

router.post('/add-product', (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  products.push({ title, price, description });
  res.redirect('/');
});

exports.routes = router;
exports.products = products;
