const fs = require('fs');

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>Section 3: Assignment Website</title><head>');
    res.write('<body><h1>Howdy, Welcome to the Website!</h1>');
    res.write('<a href="/users"><button>Click</button></a>');
    res.write(
      '<form action="/create-user" method="POST"><input type="text" name="username" /><button type="submit">Username</button></form></body>',
    );
    res.write('</html>');
    return res.end();
  }

  if (url === '/users') {
    res.setHeader('Content-Type', 'text/html');
    const users = '<ul><li>User 1</li><li>User 2</li></ul>';
    res.write(users);
    return res.end();
  }

  if (url === '/create-user' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    });
    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];
      console.log(message);
      return res.end();
    });
  }
};

module.exports = requestHandler;
