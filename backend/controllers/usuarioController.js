const Usuario = require('../models/Usuario');
const { hashPassword } = require('../services/bcryptService');
const sendMail = require('../services/mailService');
const { generateToken, verifyToken } = require('../services/jwtService');

exports.resetPassword = async (req, res) => {
  const { email, password, repeat } = req.body;
  if (!email || !password || !repeat) return res.status(400).json({ error: 'Faltan datos' });
  const isSecure = password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
  if (!isSecure) return res.status(400).json({ error: 'La contraseña no cumple con los requisitos de seguridad.' });
  if (password !== repeat) return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
  try {
    const user = await Usuario.findOne({ correo: email });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  const hash = await hashPassword(password);
    user.contrasena = hash;
    user.codigo_recuperacion = null;
    user.codigo_recuperacion_enviado = null;
    await user.save();
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al cambiar la contraseña:', err);
    res.status(500).json({ error: 'Error al cambiar la contraseña' });
  }
};

exports.getUserInfo = async (req, res) => {
  const { usuario } = req.query;
  if (!usuario) return res.status(400).json({ error: 'Falta el parámetro usuario' });
  try {
    const user = await Usuario.findOne({ $or: [{ usuario }, { correo: usuario }] });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({
      nombre: user.nombre,
      apellidos: user.apellidos,
      username: user.usuario,
      email: user.correo,
      ultimaConexion: user.ultima_conexion
    });
  } catch (err) {
    console.error('Error al obtener usuario:', err);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

exports.updateUser = async (req, res) => {
  const { nombre, apellidos, correo } = req.body;
  if (!nombre || !apellidos || !correo) return res.status(400).json({ error: 'Faltan datos' });
  try {
    const user = await Usuario.findOne({ correo });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    user.nombre = nombre;
    user.apellidos = apellidos;
    await user.save();
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};
