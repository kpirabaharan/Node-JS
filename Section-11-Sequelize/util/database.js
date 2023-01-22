const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize(
  'node_complete',
  'kpirabaharan',
  'Password123',
  {
    dialect: 'mysql',
    host: '127.0.0.1',
  },
);

module.exports = sequelize;
