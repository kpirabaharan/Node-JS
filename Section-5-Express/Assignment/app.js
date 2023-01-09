const express = require('express');

const app = express();

app.get('/favicon.ico', (req, res) => res.status(204));

app.use((req, res, next) => {
  console.log('In first middleware!');
  next();
});

app.use((req, res, next) => {
  console.log('In second middleware!');
  res.send('<h1>Hello From Express Assignment</h1>');
});

// app.use('/users', (req, res, next) => {
//   console.log('At Users!');
//   res.send('<h1>Hello From Users</h1>');
// });

// app.use('/', (req, res, next) => {
//   console.log('At Root!');
//   res.send('<h1>Hello From Root</h1>');
// });

app.listen(3001);
