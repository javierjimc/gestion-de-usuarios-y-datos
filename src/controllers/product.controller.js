// Controlador de productos: CRUD completo (segunda entidad clave).
const productService = require('../services/product.service');
const { success, error } = require('../utils/response');

// GET /api/productos  (soporta ?nombre= &page= &limit=)
async function list(req, res, next) {
  try {
    const data = await productService.findAll(req.query);
    return success(res, { message: 'Listado de productos', data });
  } catch (err) {
    next(err);
  }
}

// GET /api/productos/:id
async function getOne(req, res, next) {
  try {
    const product = await productService.findById(req.params.id);
    if (!product) return error(res, { code: 404, message: 'Producto no encontrado' });
    return success(res, { message: 'Producto encontrado', data: product });
  } catch (err) {
    next(err);
  }
}

// POST /api/productos
async function create(req, res, next) {
  try {
    const { nombre, precio } = req.body;
    if (!nombre || precio === undefined) {
      return error(res, { code: 400, message: 'nombre y precio son obligatorios' });
    }
    const product = await productService.create(req.body);
    return success(res, { code: 201, message: 'Producto creado', data: product });
  } catch (err) {
    next(err);
  }
}

// PUT /api/productos/:id
async function update(req, res, next) {
  try {
    const product = await productService.update(req.params.id, req.body);
    if (!product) return error(res, { code: 404, message: 'Producto no encontrado' });
    return success(res, { message: 'Producto actualizado', data: product });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/productos/:id
async function remove(req, res, next) {
  try {
    const ok = await productService.remove(req.params.id);
    if (!ok) return error(res, { code: 404, message: 'Producto no encontrado' });
    return success(res, { message: 'Producto eliminado', data: { id: Number(req.params.id) } });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, create, update, remove };
