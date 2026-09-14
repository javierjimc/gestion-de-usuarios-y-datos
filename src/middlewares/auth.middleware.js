// Middleware de autenticación JWT.
// Protege rutas: sin token válido, devuelve 401. Verifica expiración/validez.
const jwt = require('jsonwebtoken');
const { error } = require('../utils/response');

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return error(res, { code: 401, message: 'Token no proporcionado. Enviá el header Authorization: Bearer <token>' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, email, rol }
    next();
  } catch (err) {
    const msg = err.name === 'TokenExpiredError' ? 'Token expirado' : 'Token inválido';
    return error(res, { code: 401, message: msg });
  }
}

// Middleware opcional de rol: restringe a admin.
function adminRequired(req, res, next) {
  if (req.user?.rol !== 'admin') {
    return error(res, { code: 403, message: 'Requiere rol admin' });
  }
  next();
}

module.exports = { authRequired, adminRequired };
