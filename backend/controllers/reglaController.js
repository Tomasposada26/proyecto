// Duplicar una regla
exports.duplicarRegla = async (req, res) => {
  try {
    const regla = await Regla.findById(req.params.id);
    if (!regla) return res.status(404).json({ error: 'Regla no encontrada' });
    // Crear copia sin el _id ni timestamps
    const copia = regla.toObject();
    delete copia._id;
    delete copia.createdAt;
    delete copia.updatedAt;
    const nuevaRegla = new Regla(copia);
    await nuevaRegla.save();
    res.status(201).json(nuevaRegla);
  } catch (err) {
    console.error('Error al duplicar regla:', err);
    res.status(500).json({ error: 'Error al duplicar regla' });
  }
};
// Cambiar solo el estado de una regla
exports.updateEstadoRegla = async (req, res) => {
  try {
    const { estado } = req.body;
    if (!estado) return res.status(400).json({ error: 'Estado requerido' });
    const regla = await Regla.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    );
    if (!regla) return res.status(404).json({ error: 'Regla no encontrada' });
    res.json(regla);
  } catch (err) {
    console.error('Error al cambiar estado de regla:', err);
    res.status(500).json({ error: 'Error al cambiar estado de regla' });
  }
};
const Regla = require('../models/Regla');

exports.createRegla = async (req, res) => {
  try {
    const nuevaRegla = new Regla(req.body);
    await nuevaRegla.save();
    res.status(201).json(nuevaRegla);
  } catch (err) {
    console.error('Error al crear regla:', err);
    res.status(500).json({ error: 'Error al crear regla' });
  }
};

exports.getReglas = async (req, res) => {
  try {
    const reglas = await Regla.find();
    res.json(reglas);
  } catch (err) {
    console.error('Error al obtener reglas:', err);
    res.status(500).json({ error: 'Error al obtener reglas' });
  }
};

exports.updateRegla = async (req, res) => {
  try {
    const regla = await Regla.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!regla) return res.status(404).json({ error: 'Regla no encontrada' });
    res.json(regla);
  } catch (err) {
    console.error('Error al actualizar regla:', err);
    res.status(500).json({ error: 'Error al actualizar regla' });
  }
};

exports.deleteRegla = async (req, res) => {
  try {
    const regla = await Regla.findByIdAndDelete(req.params.id);
    if (!regla) return res.status(404).json({ error: 'Regla no encontrada' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al eliminar regla:', err);
    res.status(500).json({ error: 'Error al eliminar regla' });
  }
};
