import { useState } from 'react';

export function useRecovery() {
  const [recoveryStep, setRecoveryStep] = useState('email');
  const [recoveryError, setRecoveryError] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');

  // Handler para enviar código de recuperación
  const handleSendRecovery = async (email, setShowRecovery, setShowReset, toast) => {
    setRecoveryError('');
    setRecoveryEmail(email);
    try {
  const res = await fetch(process.env.REACT_APP_API_URL + '/api/recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!res.ok) {
        const errorData = await res.json();
        setRecoveryError(errorData.error || 'No se pudo enviar el correo');
        toast.error(errorData.error || 'No se pudo enviar el correo');
        return;
      }
      setShowRecovery(false);
      setShowReset(true);
      setRecoveryStep('code');
      toast.success('¡Código de recuperación enviado!');
    } catch (err) {
      setRecoveryError('Error al enviar el correo de recuperación');
      toast.error('Error al enviar el correo de recuperación');
    }
  };

  // Handler para verificar el código recibido
  const handleVerifyRecoveryCode = async (code, toast) => {
    setRecoveryError('');
    setRecoveryCode(code);
    try {
  const res = await fetch(process.env.REACT_APP_API_URL + '/api/recovery/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail, code })
      });
      if (!res.ok) {
        const errorData = await res.json();
        setRecoveryError(errorData.error || 'Código inválido');
        toast.error(errorData.error || 'Código inválido');
        return;
      }
      setRecoveryStep('newpass');
      toast.success('¡Código verificado! Ahora restablece tu contraseña.');
    } catch (err) {
      setRecoveryError('Código inválido o expirado');
      toast.error('Código inválido o expirado');
    }
  };

  // Handler para cambiar la contraseña
  const handleResetPassword = async (password, repeat, setShowReset, toast) => {
    setRecoveryError('');
    if (password !== repeat) {
      setRecoveryError('Las contraseñas no coinciden');
      toast.error('Las contraseñas no coinciden');
      return;
    }
    // Seguridad de contraseña
    const isPasswordSecure = pw =>
      pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw);
    if (!isPasswordSecure(password)) {
      setRecoveryError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.');
      toast.error('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.');
      return;
    }
    try {
  const res = await fetch(process.env.REACT_APP_API_URL + '/api/recovery/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail, code: recoveryCode, password })
      });
      if (!res.ok) {
        const errorData = await res.json();
        setRecoveryError(errorData.error || 'No se pudo cambiar la contraseña');
        toast.error(errorData.error || 'No se pudo cambiar la contraseña');
        return;
      }
      setShowReset(false);
      setRecoveryStep('email');
      setRecoveryCode('');
      setRecoveryEmail('');
      toast.success('¡Contraseña restablecida! Ahora puedes iniciar sesión.');
    } catch (err) {
      setRecoveryError('Error al cambiar la contraseña');
      toast.error('Error al cambiar la contraseña');
    }
  };

  return {
    recoveryStep,
    setRecoveryStep,
    recoveryError,
    setRecoveryError,
    recoveryCode,
    setRecoveryCode,
    recoveryEmail,
    setRecoveryEmail,
    handleSendRecovery,
    handleVerifyRecoveryCode,
    handleResetPassword
  };
}
