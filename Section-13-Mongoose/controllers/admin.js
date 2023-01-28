const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().select('price -_id').populate('userId');
    console.log(products);
    res.render('admin/products', {
      pageTitle: 'Admin Products',
      path: '/admin/products',
      prods: products,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;

  console.log(req.user);

  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user,
  });

  try {
    await product.save();
  } catch (err) {
    console.log(err);
  } finally {
    console.log('Created Product');
    res.redirect('/admin/products');
  }
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;

  try {
    const product = await Product.findById(prodId);
    if (!product) {
      res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

exports.postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const title = req.body.title;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;

  try {
    await Product.findByIdAndUpdate(prodId, {
      title,
      price,
      description,
      imageUrl,
    });
  } catch (err) {
    console.log(err);
  } finally {
    res.redirect('/admin/products');
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    await Product.findByIdAndRemove(prodId);
  } catch (err) {
    console.log(err);
  } finally {
    res.redirect('/admin/products');
  }
};
