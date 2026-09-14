// Capa de servicio: acceso a datos de usuarios vía ORM (Sequelize).
// Aísla la lógica de base de datos de los controladores.
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { sequelize, User, Profile, Order, Product } = require('../models');
const { logTransaction } = require('./log.service');

// Atributos públicos: nunca devolvemos el password.
const PUBLIC_ATTRS = { exclude: ['password'] };

// Listado con filtros dinámicos por query params y paginación (tarea PLUS M7).
async function findAll({ nombre, email, page = 1, limit = 10 } = {}) {
  const where = {};
  if (nombre) where.nombre = { [Op.iLike]: `%${nombre}%` };
  if (email) where.email = { [Op.iLike]: `%${email}%` };

  const offset = (Number(page) - 1) * Number(limit);
  const { count, rows } = await User.findAndCountAll({
    where,
    attributes: PUBLIC_ATTRS,
    limit: Number(limit),
    offset,
    order: [['id', 'ASC']],
  });

  return {
    total: count,
    page: Number(page),
    pages: Math.ceil(count / Number(limit)),
    usuarios: rows,
  };
}

async function findById(id) {
  return User.findByPk(id, { attributes: PUBLIC_ATTRS });
}

// Devuelve el usuario con sus pedidos y los productos de cada pedido (include, relaciones).
async function findWithOrders(id) {
  return User.findByPk(id, {
    attributes: PUBLIC_ATTRS,
    include: [
      { model: Profile, as: 'perfil' },
      {
        model: Order,
        as: 'pedidos',
        include: [{ model: Product, as: 'productos', through: { attributes: ['cantidad'] } }],
      },
    ],
  });
}

async function findByEmail(email) {
  return User.findOne({ where: { email } });
}

// Registro con TRANSACCIÓN: crea usuario + perfil de forma atómica.
// Si algo falla, rollback y se registra en el log de transacciones (M7 lección 4).
async function createWithProfile({ nombre, email, password, rol, bio, telefono }) {
  const t = await sequelize.transaction();
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create(
      { nombre, email, password: hash, rol },
      { transaction: t }
    );
    await Profile.create(
      { userId: user.id, bio: bio || null, telefono: telefono || null },
      { transaction: t }
    );
    await t.commit();
    console.log(`✅ Transacción OK: usuario ${user.id} + perfil creados.`);
    const plain = user.toJSON();
    delete plain.password;
    return plain;
  } catch (err) {
    await t.rollback();
    logTransaction(`ROLLBACK creando usuario "${email}": ${err.message}`);
    console.error('↩️  Rollback ejecutado:', err.message);
    throw err;
  }
}

// Actualización parcial: solo campos permitidos (no se toca el password aquí).
async function update(id, data) {
  const user = await User.findByPk(id);
  if (!user) return null;
  const permitidos = ['nombre', 'email', 'rol', 'avatar'];
  const cambios = {};
  for (const campo of permitidos) {
    if (data[campo] !== undefined) cambios[campo] = data[campo];
  }
  await user.update(cambios);
  const plain = user.toJSON();
  delete plain.password;
  return plain;
}

async function remove(id) {
  const user = await User.findByPk(id);
  if (!user) return false;
  await user.destroy();
  return true;
}

module.exports = {
  findAll,
  findById,
  findWithOrders,
  findByEmail,
  createWithProfile,
  update,
  remove,
};
