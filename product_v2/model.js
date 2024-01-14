const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:');

class Product extends Model {}

Product.init({
 users_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
 },
 name: {
    type: DataTypes.STRING,
    allowNull: false,
 },
 price: {
    type: DataTypes.INTEGER,
 },
 stok: {
    type: DataTypes.INTEGER,
 },
 status: { 
    type: DataTypes.BOOLEAN,
 },
 image_url: {
    type: DataTypes.TEXT,
 },
}, {
 sequelize,
 modelName: 'product',
});

module.exports = Product;