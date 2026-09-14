// Rutas de productos.
// GET públicas (catálogo). POST/PUT/DELETE protegidas con JWT.
const router = require('express').Router();
const ctrl = require('../controllers/product.controller');
const { authRequired } = require('../middlewares/auth.middleware');

router.get('/', ctrl.list); // pública
router.get('/:id', ctrl.getOne); // pública

router.post('/', authRequired, ctrl.create); // protegida
router.put('/:id', authRequired, ctrl.update); // protegida
router.delete('/:id', authRequired, ctrl.remove); // protegida

module.exports = router;
