const Interesado = require('../models/Interesado');
const sendMail = require('../services/mailService');

exports.subscribe = async (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'Correo inválido' });
  }
  try {
    const existente = await Interesado.findOne({ email });
    if (existente) {
      return res.status(409).json({ error: '¡Ya te encuentras suscrito! Si no recibes nuestros correos, revisa tu bandeja de spam o promociones.' });
    }
    await Interesado.create({ email });
    await sendMail({
      from: 'Aura <aurainstacms@gmail.com>',
      to: email,
      subject: '¡Gracias por suscribirte a Aura! 🌟',
      html: `
      <div style="font-family: Arial, sans-serif; background: #f4f6f8; padding: 0; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <div style="background: #10b981; color: #fff; padding: 24px 0; text-align: center; font-size: 2rem; font-weight: bold; letter-spacing: 2px;">Aura</div>
          <div style="padding: 32px 24px 24px 24px; color: #222;">
            <p>¡Hola!</p>
            <p>¡Gracias por suscribirte a <b>Aura</b>! Ahora recibirás novedades, recursos exclusivos y noticias sobre automatización directamente en tu correo.</p>
            <p>Te invitamos a explorar nuestra plataforma y aprovechar todos los beneficios de la comunidad Aura.</p>
            <p style="color: #10b981; font-weight: bold;">¡Bienvenido y gracias por confiar en nosotros!</p>
          </div>
          <div style="background: #f4f6f8; color: #888; text-align: center; padding: 16px 24px 8px 24px; font-size: 0.95rem;">
            <p>Con entusiasmo,<br><b>El equipo de Aura</b></p>
          </div>
        </div>
      </div>
      `
    });
    res.json({ ok: true, message: '¡Suscripción exitosa! Revisa tu correo para más información y novedades.' });
  } catch (err) {
    console.error('Error al registrar interesado:', err);
    res.status(500).json({ error: 'No se pudo procesar tu solicitud.' });
  }
};
