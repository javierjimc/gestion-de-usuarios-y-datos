// Manejo centralizado de errores. Traduce errores comunes de Sequelize/multer
// a respuestas con formato consistente { status, message, data }.
const multer = require('multer');
const { error } = require('../utils/response');
const { log } = require('../services/log.service');

function notFound(req, res) {
  return error(res, { code: 404, message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  log(`ERROR ${req.method} ${req.originalUrl} -> ${err.message}`);

  // Errores de validación / unicidad de Sequelize.
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const detalles = err.errors.map((e) => e.message);
    return error(res, { code: 400, message: 'Error de validación', data: detalles });
  }

  // Errores de multer (tamaño, etc.).
  if (err instanceof multer.MulterError) {
    return error(res, { code: 400, message: `Error al subir archivo: ${err.message}` });
  }

  // Filtro de tipo de archivo (Error genérico lanzado en fileFilter).
  if (err.message && err.message.includes('Tipo de archivo no permitido')) {
    return error(res, { code: 400, message: err.message });
  }

  const code = err.status || 500;
  return error(res, { code, message: err.message || 'Error interno del servidor' });
}

module.exports = { notFound, errorHandler };
