const Product = require('../models/product');

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render('shop/index', {
      pageTitle: 'Shop',
      path: '/',
      prods: products,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render('shop/product-list', {
      pageTitle: 'Add Products',
      path: '/products',
      prods: products,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  try {
    const product = await Product.findById(prodId);
    res.render('shop/product-detail', {
      pageTitle: product.title,
      path: '/products',
      product: product,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const user = await req.user.populate('cart.items.productId');
    const products = user.cart.items;
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const product = await Product.findById(prodId);
    await req.user.addToCart(product);
  } catch (err) {
    console.log(err);
  } finally {
    res.redirect('/cart');
  }
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  req.user
    .deleteItemFromCart(productId)
    .then(result => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
      });
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedProducts;
  let fetchedCart;
  req.user
    .addOrder()
    .then(_ => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};
