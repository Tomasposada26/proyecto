const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/registro', authController.register);
router.get('/perfil', authController.authMiddleware, authController.getProfile);
router.post('/verificar', authController.verifyAccount);
router.post('/reenviar-verificacion', authController.resendVerification);

module.exports = router;
