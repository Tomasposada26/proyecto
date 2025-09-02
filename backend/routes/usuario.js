const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/recovery/reset', usuarioController.resetPassword);
router.get('/usuario/info', usuarioController.getUserInfo);
router.post('/usuario/update', usuarioController.updateUser);

module.exports = router;
