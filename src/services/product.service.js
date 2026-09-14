// Capa de servicio: acceso a datos de productos vía ORM.
const { Op } = require('sequelize');
const { Product } = require('../models');

async function findAll({ nombre, page = 1, limit = 10 } = {}) {
  const where = {};
  if (nombre) where.nombre = { [Op.iLike]: `%${nombre}%` };

  const offset = (Number(page) - 1) * Number(limit);
  const { count, rows } = await Product.findAndCountAll({
    where,
    limit: Number(limit),
    offset,
    order: [['id', 'ASC']],
  });

  return {
    total: count,
    page: Number(page),
    pages: Math.ceil(count / Number(limit)),
    productos: rows,
  };
}

async function findById(id) {
  return Product.findByPk(id);
}

async function create(data) {
  return Product.create(data);
}

async function update(id, data) {
  const product = await Product.findByPk(id);
  if (!product) return null;
  const permitidos = ['nombre', 'precio', 'stock'];
  const cambios = {};
  for (const campo of permitidos) {
    if (data[campo] !== undefined) cambios[campo] = data[campo];
  }
  await product.update(cambios);
  return product;
}

async function remove(id) {
  const product = await Product.findByPk(id);
  if (!product) return false;
  await product.destroy();
  return true;
}

module.exports = { findAll, findById, create, update, remove };
