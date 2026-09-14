// Rutas web que sirven contenido dinámico con EJS (módulo 6).
// Renderizan vistas del lado del servidor a partir de datos reales de la DB.
const router = require('express').Router();
const userService = require('../services/user.service');
const { log } = require('../services/log.service');

// Home dinámico.
router.get('/', (req, res) => {
  log(`Visita a home desde ${req.ip}`);
  res.render('index', { titulo: 'Node & Express Web App' });
});

// Listado de usuarios renderizado en HTML (datos anidados en tabla).
router.get('/usuarios-web', async (req, res, next) => {
  try {
    const { usuarios } = await userService.findAll({ limit: 100 });
    res.render('users', { titulo: 'Usuarios', usuarios });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
