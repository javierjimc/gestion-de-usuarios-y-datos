// Punto central de modelos: define las asociaciones entre entidades.
// Relaciones exigidas por el módulo 7: 1:1, 1:N y N:M.
const { sequelize } = require('../config/database');
const User = require('./User');
const Profile = require('./Profile');
const Order = require('./Order');
const Product = require('./Product');

// 1:1 -> Un usuario tiene un perfil, un perfil pertenece a un usuario.
User.hasOne(Profile, { foreignKey: 'userId', as: 'perfil', onDelete: 'CASCADE' });
Profile.belongsTo(User, { foreignKey: 'userId', as: 'usuario' });

// 1:N -> Un usuario tiene muchos pedidos, un pedido pertenece a un usuario.
User.hasMany(Order, { foreignKey: 'userId', as: 'pedidos', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'usuario' });

// N:M -> Un pedido tiene muchos productos y un producto está en muchos pedidos.
// Tabla intermedia 'pedido_productos' con cantidad por línea.
const OrderProduct = sequelize.define(
  'OrderProduct',
  {
    cantidad: {
      type: require('sequelize').DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  { tableName: 'pedido_productos', timestamps: false }
);

Order.belongsToMany(Product, {
  through: OrderProduct,
  foreignKey: 'orderId',
  as: 'productos',
});
Product.belongsToMany(Order, {
  through: OrderProduct,
  foreignKey: 'productId',
  as: 'pedidos',
});

module.exports = {
  sequelize,
  User,
  Profile,
  Order,
  Product,
  OrderProduct,
};
