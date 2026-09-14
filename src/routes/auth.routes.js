// Rutas de autenticación.
const router = require('express').Router();
const auth = require('../controllers/auth.controller');
const { authRequired } = require('../middlewares/auth.middleware');

router.post('/register', auth.register); // pública
router.post('/login', auth.login); // pública
router.get('/me', authRequired, auth.me); // protegida

module.exports = router;
