// Controlador de autenticación: registro y login con JWT.
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userService = require('../services/user.service');
const { success, error } = require('../utils/response');
const { log } = require('../services/log.service');

// POST /api/auth/register -> crea usuario + perfil (transacción).
async function register(req, res, next) {
  try {
    const { nombre, email, password, bio, telefono } = req.body;
    if (!nombre || !email || !password) {
      return error(res, { code: 400, message: 'nombre, email y password son obligatorios' });
    }
    const existe = await userService.findByEmail(email);
    if (existe) {
      return error(res, { code: 409, message: 'El email ya está registrado' });
    }
    const user = await userService.createWithProfile({ nombre, email, password, bio, telefono });
    log(`Nuevo registro: ${email}`);
    return success(res, { code: 201, message: 'Usuario registrado', data: user });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login -> valida credenciales y devuelve JWT.
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return error(res, { code: 400, message: 'email y password son obligatorios' });
    }
    const user = await userService.findByEmail(email);
    if (!user) {
      return error(res, { code: 401, message: 'Credenciales inválidas' });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return error(res, { code: 401, message: 'Credenciales inválidas' });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
    log(`Login OK: ${email}`);
    return success(res, {
      message: 'Login exitoso',
      data: { token, usuario: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me -> datos del usuario autenticado (ruta protegida).
async function me(req, res, next) {
  try {
    const user = await userService.findById(req.user.id);
    if (!user) return error(res, { code: 404, message: 'Usuario no encontrado' });
    return success(res, { message: 'Usuario autenticado', data: user });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me };
