const mongoDb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
  constructor(username, email, cart, _id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = _id;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  addToCart(product) {
    const db = getDb();
    // const cartProduct = this.cart.items.findIndex((cp) => {
    //   return cp._id === product.id;
    // });
    product.quantity = 1;
    const updatedCart = { item: [product] };
    return db
      .collection('users')
      .updateOne(
        { _id: new mongoDb.ObjectId(this._id) },
        { $set: { cart: updatedCart } },
      );
  }

  static async findById(userId) {
    const db = getDb();

    try {
      const user = await db
        .collection('users')
        .findOne({ _id: mongoDb.ObjectId(userId) });
      console.log(user);
      return user;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = User;
