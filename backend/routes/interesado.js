const express = require('express');
const router = express.Router();
const interesadoController = require('../controllers/interesadoController');

router.post('/interesados', interesadoController.createInteresado);
router.get('/interesados', interesadoController.getInteresados);
router.put('/interesados/:id', interesadoController.updateInteresado);
router.delete('/interesados/:id', interesadoController.deleteInteresado);

module.exports = router;
