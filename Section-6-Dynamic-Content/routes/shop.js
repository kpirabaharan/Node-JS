const path = require('path');
const express = require('express');

const rootDir = require(path.join(__dirname, '..', 'util', 'path.js'));
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log(adminData.products);
  res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;