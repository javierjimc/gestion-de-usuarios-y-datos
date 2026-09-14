// Modelo Order (pedido): pertenece a un User.
// Relación 1:N (un usuario tiene muchos pedidos).
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'pagado', 'cancelado'),
      defaultValue: 'pendiente',
    },
  },
  {
    tableName: 'pedidos',
    timestamps: true,
  }
);

module.exports = Order;
