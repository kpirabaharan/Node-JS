const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render('shop/index', {
      pageTitle: 'Shop',
      path: '/',
      prods: products,
      isAuth: req.isLoggedIn,
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
      isAuth: req.isLoggedIn,
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
      isAuth: req.isLoggedIn,
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
      isAuth: req.isLoggedIn,
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
    res.redirect('/cart');
  } catch (err) {
    console.log(err);
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const productId = req.body.productId;
  try {
    await req.user.deleteFromCart(productId);
    res.redirect('/cart');
  } catch (err) {
    console.log(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ 'user.userId': req.user });
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
      isAuth: req.isLoggedIn,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    const user = await req.user.populate('cart.items.productId');
    const products = user.cart.items.map(prod => {
      return { quantity: prod.quantity, product: { ...prod.productId._doc } };
    });
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      products: products,
    });
    await order.save();
    await req.user.clearCart();
    res.redirect('/orders');
  } catch (err) {
    console.log(err);
  }
};
