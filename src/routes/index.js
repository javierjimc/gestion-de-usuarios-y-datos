// Router principal de la API. Agrupa todos los recursos bajo /api.
const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/usuarios', require('./user.routes'));
router.use('/productos', require('./product.routes'));

// Endpoint de salud.
router.get('/health', (req, res) =>
  res.json({ status: 'success', message: 'API operativa', data: { uptime: process.uptime() } })
);

module.exports = router;
