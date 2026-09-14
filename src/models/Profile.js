// Modelo Profile: datos extendidos del usuario.
// Relación 1:1 con User (un usuario tiene un perfil).
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Profile = sequelize.define(
  'Profile',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'perfiles',
    timestamps: true,
  }
);

module.exports = Profile;
