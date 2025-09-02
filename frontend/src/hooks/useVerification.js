import { useState } from 'react';

export function useVerification() {
  const [verifyError, setVerifyError] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Handler para verificar código de verificación
  const handleVerify = async (code, setShowVerify, toast) => {
    setVerifyError('');
    try {
      const res = await fetch('/api/verificar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: pendingEmail, codigo: code })
      });
      if (!res.ok) {
        const errorData = await res.json();
        setVerifyError(errorData.error || 'Código incorrecto');
        toast.error(errorData.error || 'Código incorrecto');
        return;
      }
      setShowVerify(false);
      setRegisterSuccess(true);
      toast.success('¡Cuenta verificada! Ya puedes iniciar sesión.');
    } catch (err) {
      setVerifyError('Error al verificar la cuenta');
      toast.error('Error al verificar la cuenta');
    }
  };

  return {
    verifyError,
    setVerifyError,
    pendingEmail,
    setPendingEmail,
    registerSuccess,
    setRegisterSuccess,
    handleVerify
  };
}
