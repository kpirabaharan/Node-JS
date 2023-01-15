const products = [];

module.exports = class Product {
  constructor(title, price, description) {
    this.title = title;
    this.price = price;
    this.description = description;
  }

  save() {
    products.push(this);
  }

  static fetchAll() {
    return products;
  }
};
