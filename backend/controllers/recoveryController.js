const Usuario = require('../models/Usuario');
const sendMail = require('../services/mailService');
const { hashPassword } = require('../services/bcryptService');

function generarCodigo() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
exports.sendRecoveryCode = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Correo requerido' });
  try {
    const user = await Usuario.findOne({ correo: email });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    const codigo = generarCodigo();
    const now = new Date();
    user.codigo_recuperacion = codigo;
    user.codigo_recuperacion_enviado = now;
    await user.save();
    await sendMail({
      from: 'Aura <aurainstacms@gmail.com>',
      to: email,
      subject: 'Restablece tu contraseña en Aura',
      html: `
      <div style="font-family: Arial, sans-serif; background: #181c20; padding: 0; margin: 0;">
        <div style="max-width: 420px; margin: 0 auto; background: #23272b; border-radius: 16px 16px 0 0; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.10);">
          <div style="background: #1796e6; color: #fff; padding: 24px 0; text-align: center; font-size: 2rem; font-weight: bold; letter-spacing: 1px; border-radius: 16px 16px 0 0;">Restablece tu contraseña</div>
          <div style="padding: 32px 24px 24px 24px; color: #fff;">
            <p>Hola <b>${user.nombre}</b>,</p>
            <p>Recibimos una solicitud para restablecer tu contraseña en Aura.<br>Utiliza el siguiente código para continuar con el proceso:</p>
            <div style="background: #181c20; border-radius: 12px; padding: 18px 0; margin: 24px 0; text-align: center;">
              <span style="display: inline-block; font-size: 1.35rem; letter-spacing: 2px; color: #7ecbff; border: 2px solid #7ecbff; border-radius: 8px; padding: 6px 18px; font-weight: bold; background: #23272b;">${codigo}</span>
            </div>
            <p style="color: #bbb; font-size: 1rem;">Este código es válido por los próximos <b>10 minutos</b>.<br>Si no solicitaste este restablecimiento, puedes ignorar este correo.</p>
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
    console.error('Error en recovery:', err);
    res.status(500).json({ error: 'Error al enviar el código de recuperación' });
  }
};

exports.verifyRecoveryCode = async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Faltan datos' });
  try {
    const user = await Usuario.findOne({ correo: email });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (user.codigo_recuperacion !== code) return res.status(400).json({ error: 'Código incorrecto' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Error en recovery verify:', err);
    res.status(500).json({ error: 'Error al verificar el código' });
  }
};


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

exports.resendRecoveryCode = async (req, res) => {
  const { correo } = req.body;
  if (!correo) return res.status(400).json({ error: 'Correo requerido' });
  try {
    const user = await Usuario.findOne({ correo });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    const codigo = generarCodigo();
    const now = new Date();
    user.codigo_recuperacion = codigo;
    user.codigo_recuperacion_enviado = now;
    await user.save();
    await sendMail({
      from: 'Aura <aurainstacms@gmail.com>',
      to: correo,
      subject: 'Nuevo código de recuperación',
      html: `
        <div style="font-family: Arial, sans-serif; background: #181c20; padding: 0; margin: 0;">
          <div style="max-width: 420px; margin: 0 auto; background: #23272b; border-radius: 16px 16px 0 0; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.10);">
            <div style="background: #1796e6; color: #fff; padding: 24px 0; text-align: center; font-size: 2rem; font-weight: bold; letter-spacing: 1px; border-radius: 16px 16px 0 0;">Nuevo código de recuperación</div>
            <div style="padding: 32px 24px 24px 24px; color: #fff;">
              <p>Hola <b>${user.nombre}</b>,</p>
              <p>Tu nuevo código de recuperación es:</p>
              <div style="background: #181c20; border-radius: 12px; padding: 18px 0; margin: 24px 0; text-align: center;">
                <span style="display: inline-block; font-size: 1.35rem; letter-spacing: 2px; color: #7ecbff; border: 2px solid #7ecbff; border-radius: 8px; padding: 6px 18px; font-weight: bold; background: #23272b;">${codigo}</span>
              </div>
              <p style="color: #bbb; font-size: 1rem;">Este código es válido por los próximos <b>10 minutos</b>.<br>Si no solicitaste este restablecimiento, puedes ignorar este correo.</p>
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
    console.error('Error al reenviar código de recuperación:', err);
    res.status(500).json({ error: 'Error al reenviar el código de recuperación' });
  }
};
