// Controlador de usuarios: CRUD completo + subida de avatar.
const userService = require('../services/user.service');
const { success, error } = require('../utils/response');
const path = require('path');

// GET /api/usuarios  (soporta ?nombre= &email= &page= &limit=)
async function list(req, res, next) {
  try {
    const data = await userService.findAll(req.query);
    return success(res, { message: 'Listado de usuarios', data });
  } catch (err) {
    next(err);
  }
}

// GET /api/usuarios/:id
async function getOne(req, res, next) {
  try {
    const user = await userService.findById(req.params.id);
    if (!user) return error(res, { code: 404, message: 'Usuario no encontrado' });
    return success(res, { message: 'Usuario encontrado', data: user });
  } catch (err) {
    next(err);
  }
}

// GET /api/usuarios/:id/pedidos -> usuario + perfil + pedidos + productos (relaciones).
async function getWithOrders(req, res, next) {
  try {
    const user = await userService.findWithOrders(req.params.id);
    if (!user) return error(res, { code: 404, message: 'Usuario no encontrado' });
    return success(res, { message: 'Usuario con pedidos', data: user });
  } catch (err) {
    next(err);
  }
}

// PUT /api/usuarios/:id -> actualización parcial (solo campos permitidos).
async function update(req, res, next) {
  try {
    const user = await userService.update(req.params.id, req.body);
    if (!user) return error(res, { code: 404, message: 'Usuario no encontrado' });
    return success(res, { message: 'Usuario actualizado', data: user });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/usuarios/:id -> valida existencia antes de borrar.
async function remove(req, res, next) {
  try {
    const ok = await userService.remove(req.params.id);
    if (!ok) return error(res, { code: 404, message: 'Usuario no encontrado' });
    return success(res, { message: 'Usuario eliminado', data: { id: Number(req.params.id) } });
  } catch (err) {
    next(err);
  }
}

// POST /api/usuarios/:id/avatar -> sube imagen y la asocia al usuario (multer + DB).
async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) return error(res, { code: 400, message: 'No se envió ningún archivo (campo "avatar")' });
    const rutaPublica = `/uploads/${req.file.filename}`;
    const user = await userService.update(req.params.id, { avatar: rutaPublica });
    if (!user) return error(res, { code: 404, message: 'Usuario no encontrado' });
    return success(res, { message: 'Avatar subido y asociado', data: user });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, getWithOrders, update, remove, uploadAvatar };
