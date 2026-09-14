// Modelo User: entidad clave principal.
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'El nombre es obligatorio' } },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'El email ya está registrado' },
      validate: { isEmail: { msg: 'Email inválido' } },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
    },
    avatar: {
      // Ruta de la imagen subida (multer). Se asocia al registro (tarea PLUS M8).
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'usuarios',
    timestamps: true,
  }
);

module.exports = User;
