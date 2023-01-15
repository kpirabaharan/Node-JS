const products = [];

exports.getAddProduct = (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  products.push({ title, price, description });
  res.redirect('/');
};

exports.getProducts = (req, res, next) => {
  res.render('shop', {
    pageTitle: 'My Shop',
    path: '/',
    prods: products,
  });
};
