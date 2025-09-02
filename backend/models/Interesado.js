const mongoose = require('mongoose');

const interesadoSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interesado', interesadoSchema);
