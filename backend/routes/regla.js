const express = require('express');
const router = express.Router();
const reglaController = require('../controllers/reglaController');


router.post('/reglas', reglaController.createRegla);
router.get('/reglas', reglaController.getReglas);
router.put('/reglas/:id', reglaController.updateRegla);
router.delete('/reglas/:id', reglaController.deleteRegla);
// Nuevo endpoint para cambiar solo el estado
router.patch('/reglas/:id/estado', reglaController.updateEstadoRegla);
// Endpoint para duplicar regla
router.post('/reglas/:id/duplicar', reglaController.duplicarRegla);

module.exports = router;
