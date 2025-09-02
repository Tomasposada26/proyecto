const Interesado = require('../models/Interesado');

exports.createInteresado = async (req, res) => {
  try {
    const nuevoInteresado = new Interesado(req.body);
    await nuevoInteresado.save();
    res.status(201).json(nuevoInteresado);
  } catch (err) {
    console.error('Error al crear interesado:', err);
    res.status(500).json({ error: 'Error al crear interesado' });
  }
};

exports.getInteresados = async (req, res) => {
  try {
    const interesados = await Interesado.find();
    res.json(interesados);
  } catch (err) {
    console.error('Error al obtener interesados:', err);
    res.status(500).json({ error: 'Error al obtener interesados' });
  }
};

exports.updateInteresado = async (req, res) => {
  try {
    const interesado = await Interesado.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!interesado) return res.status(404).json({ error: 'Interesado no encontrado' });
    res.json(interesado);
  } catch (err) {
    console.error('Error al actualizar interesado:', err);
    res.status(500).json({ error: 'Error al actualizar interesado' });
  }
};

exports.deleteInteresado = async (req, res) => {
  try {
    const interesado = await Interesado.findByIdAndDelete(req.params.id);
    if (!interesado) return res.status(404).json({ error: 'Interesado no encontrado' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al eliminar interesado:', err);
    res.status(500).json({ error: 'Error al eliminar interesado' });
  }
};
