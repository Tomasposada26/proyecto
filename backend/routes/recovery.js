const express = require('express');
const router = express.Router();
const recoveryController = require('../controllers/recoveryController');

router.post('/recovery', recoveryController.sendRecoveryCode);
router.post('/recovery/verify', recoveryController.verifyRecoveryCode);
router.post('/recovery/reset', recoveryController.resetPassword);
router.post('/reenviar-codigo', recoveryController.resendRecoveryCode);

module.exports = router;
