const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;

  const product = new Product(title, price, description, imageUrl);
  product
    .save()
    .then((result) => {
      // console.log(result);
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

// exports.getEditProduct = (req, res, next) => {
//   const editMode = req.query.edit;
//   if (!editMode) {
//     return res.redirect('/');
//   }
//   const prodId = req.params.productId;

//   req.user
//     .getProducts({ where: { id: prodId } })
//     .then((products) => {
//       console.log(products);
//       const product = products[0];
//       if (!product) return res.redirect('/');
//       res.render('admin/edit-product', {
//         pageTitle: 'Edit Product',
//         path: '/admin/edit-product',
//         editing: editMode,
//         product: product,
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.redirect('/');
//     });
// };

// exports.postEditProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   const updatedTitle = req.body.title;
//   const updatedPrice = req.body.price;
//   const updatedImageUrl = req.body.imageUrl;
//   const updatedDescription = req.body.description;

//   Product.findByPk(prodId)
//     .then((product) => {
//       product.title = updatedTitle;
//       product.price = updatedPrice;
//       product.imageUrl = updatedImageUrl;
//       product.description = updatedDescription;
//       return product.save();
//     })
//     .then((result) => {
//       console.log('Updated Product.');
//       res.redirect('/admin/products');
//     })
//     .catch((err) => console.log(err));
// };

// exports.postDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   Product.findByPk(prodId)
//     .then((product) => {
//       return product.destroy();
//     })
//     .then((result) => {
//       console.log('Destroyed Product');
//       res.redirect('/admin/products');
//     })
//     .catch((err) => console.log(err));
// };

// exports.getProducts = (req, res, next) => {
//   req.user
//     .getProducts()
//     .then((products) => {
//       res.render('admin/products', {
//         pageTitle: 'Admin Products',
//         path: '/admin/products',
//         prods: products,
//       });
//     })
//     .catch((err) => console.log(err));
// };
