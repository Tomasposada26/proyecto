const Usuario = require('../models/Usuario');
const { hashPassword, comparePassword } = require('../services/bcryptService');
const { generateToken, verifyToken } = require('../services/jwtService');
const sendMail = require('../services/mailService');

function generarCodigo() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.login = async (req, res) => {
  const { usuario, contrasena } = req.body;
  if (!usuario || !contrasena) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  try {
    const user = await Usuario.findOne({ $or: [{ usuario }, { correo: usuario }] });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (!user.verificado) return res.status(403).json({ error: 'Cuenta no verificada' });
    const match = await comparePassword(contrasena, user.contrasena);
    if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });
    user.ultima_conexion = new Date();
    await user.save();
    const token = generateToken({ id: user._id, usuario: user.usuario, correo: user.correo }, '2h');
    res.json({ ok: true, token, usuario: user.usuario, correo: user.correo, ultimaConexion: user.ultima_conexion });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error en el login' });
  }
};

exports.register = async (req, res) => {
  const { nombre, apellidos, usuario, correo, contrasena } = req.body;
  if (!nombre || !apellidos || !usuario || !correo || !contrasena) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }
  try {
    const existe = await Usuario.findOne({ $or: [{ usuario }, { correo }] });
    if (existe) return res.status(409).json({ error: 'Usuario o correo ya registrado' });
    const hash = await hashPassword(contrasena);
    const codigo = generarCodigo();
    const now = new Date();
    const nuevoUsuario = new Usuario({
      nombre, apellidos, usuario, correo, contrasena: hash, verificado: false, codigo_verificacion: codigo, codigo_verificacion_enviado: now
    });
    await nuevoUsuario.save();
    await sendMail({
      from: 'Aura <aurainstacms@gmail.com>',
      to: correo,
      subject: 'Bienvenido a Aura: Verifica tu cuenta',
      html: `
      <div style="font-family: Arial, sans-serif; background: #f4f6f8; padding: 0; margin: 0;">
        <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px 16px 0 0; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <div style="background: #1796e6; color: #fff; padding: 24px 0; text-align: center; font-size: 2rem; font-weight: bold; letter-spacing: 1px; border-radius: 16px 16px 0 0;">Bienvenido a Aura</div>
          <div style="padding: 32px 24px 24px 24px; color: #222;">
            <p>Hola <b>${nombre}</b>,</p>
            <p>¡Gracias por unirte a <b>Aura</b>! Para confirmar tu cuenta y mantenerla segura, utiliza el siguiente código de verificación:</p>
            <div style="background: #f4f6f8; border-radius: 12px; padding: 24px 0; margin: 24px 0; text-align: center;">
              <span style="display: inline-block; font-size: 1.5rem; letter-spacing: 6px; color: #1796e6; border: 2px solid #1796e6; border-radius: 8px; padding: 8px 18px; font-weight: bold; background: #fff;">${codigo}</span>
            </div>
            <p style="color: #444; font-size: 1rem;">Este código es válido por los próximos <b>10 minutos</b>.<br>Si no solicitaste esta verificación, puedes ignorar este correo.</p>
            <p><a href="https://aura.com" style="color: #1796e6; text-decoration: underline; font-weight: bold;">Bienvenido a la comunidad Aura ✨</a></p>
          </div>
          <div style="color: #888; text-align: center; padding: 16px 24px 24px 24px; font-size: 0.95rem;">
            <p>Saludos,<br>El equipo de Aura</p>
          </div>
        </div>
      </div>
      `
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ error: 'Error en el registro' });
  }
};

exports.verifyAccount = async (req, res) => {
  const { correo, codigo } = req.body;
  if (!correo || !codigo) return res.status(400).json({ error: 'Faltan datos' });
  try {
    const user = await Usuario.findOne({ correo });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (user.verificado) return res.status(400).json({ error: 'Usuario ya verificado' });
    if (user.codigo_verificacion !== codigo) return res.status(401).json({ error: 'Código incorrecto' });
    if (!user.codigo_verificacion_enviado) return res.status(400).json({ error: 'No se encontró la hora de envío del código' });
    const ahora = new Date();
    const enviadoDate = new Date(user.codigo_verificacion_enviado);
    const diffMs = ahora - enviadoDate;
    if (diffMs > 10 * 60 * 1000) return res.status(400).json({ error: 'El código ha expirado. Solicita uno nuevo.' });
    user.verificado = true;
    user.codigo_verificacion = null;
    user.codigo_verificacion_enviado = null;
    await user.save();
    res.json({ ok: true });
  } catch (err) {
    console.error('Error en verificación:', err);
    res.status(500).json({ error: 'Error al verificar' });
  }
};

exports.resendVerification = async (req, res) => {
  const { correo } = req.body;
  if (!correo) return res.status(400).json({ error: 'Correo requerido' });
  try {
    const user = await Usuario.findOne({ correo });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (user.verificado) return res.status(400).json({ error: 'La cuenta ya está verificada' });
    const codigo = generarCodigo();
    const now = new Date();
    user.codigo_verificacion = codigo;
    user.codigo_verificacion_enviado = now;
    await user.save();
    await sendMail({
      from: 'Aura <aurainstacms@gmail.com>',
      to: correo,
      subject: 'Reenvío de código de verificación',
      html: `
      <div style="font-family: Arial, sans-serif; background: #181c20; padding: 0; margin: 0;">
        <div style="max-width: 420px; margin: 0 auto; background: #23272b; border-radius: 16px 16px 0 0; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.10);">
          <div style="background: #6c63ff; color: #fff; padding: 24px 0; text-align: center; font-size: 2rem; font-weight: bold; letter-spacing: 1px; border-radius: 16px 16px 0 0;">Reenvío de código</div>
          <div style="padding: 32px 24px 24px 24px; color: #fff;">
            <p>Hola <b>${user.nombre}</b>,</p>
            <p>Has solicitado un nuevo código de verificación para tu cuenta en <b>Aura</b>. Utiliza el siguiente código para continuar con la verificación:</p>
            <div style="background: #181c20; border-radius: 12px; padding: 18px 0; margin: 24px 0; text-align: center;">
              <span style="display: inline-block; font-size: 1.25rem; letter-spacing: 2px; color: #7ecbff; border: 1.5px solid #7ecbff; border-radius: 8px; padding: 6px 12px; font-weight: bold; background: #23272b;">${codigo}</span>
            </div>
            <p style="color: #bbb; font-size: 1rem;">Este código es válido por los próximos <b>10 minutos</b>.<br>Si no solicitaste este reenvío, puedes ignorar este correo.</p>
            <p><a href="https://aura.com" style="color: #6c63ff; text-decoration: underline; font-weight: bold;">¡Gracias por confiar en Aura!</a></p>
          </div>
          <div style="color: #888; text-align: center; padding: 16px 24px 24px 24px; font-size: 0.95rem; background: #181c20;">
            <p>Saludos,<br>El equipo de Aura</p>
          </div>
        </div>
      </div>
      `
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al reenviar verificación:', err);
    res.status(500).json({ error: 'Error al reenviar el correo de verificación' });
  }
};

exports.authMiddleware = (req, res, next) => {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ error: 'Token requerido' });
  const token = auth.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

exports.getProfile = (req, res) => {
  res.json({ usuario: req.user.usuario, correo: req.user.correo });
};
