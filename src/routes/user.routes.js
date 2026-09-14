// Rutas de usuarios. Todas protegidas con JWT (rutas privadas).
const router = require('express').Router();
const ctrl = require('../controllers/user.controller');
const { authRequired } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.use(authRequired); // protege todo el recurso /api/usuarios

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.get('/:id/pedidos', ctrl.getWithOrders);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
router.post('/:id/avatar', upload.single('avatar'), ctrl.uploadAvatar);

module.exports = router;
