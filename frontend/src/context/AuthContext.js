import React, { createContext, useContext, useState } from 'react';


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');

  // Login
  const handleLogin = async (form, setShowLogin, setShowEmailVerify, setPanelActivo, toast) => {
    setLoginError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: form.usuario, contrasena: form.contrasena })
      });
      let data = null;
      try {
        data = await res.json();
      } catch (jsonErr) {
        // Si la respuesta no es JSON válido
        data = {};
      }
      if (!res.ok) {
        if (data && data.error === 'Cuenta no verificada') {
          setPendingEmail(form.usuario);
          setShowLogin(false);
          setShowEmailVerify(true);
        } else {
          const errorMsg = (data && data.error) ? data.error : 'Error al iniciar sesión';
          setLoginError(errorMsg);
          toast.error(errorMsg);
        }
        return;
      }
      const resUser = await fetch(`/api/usuario/info?usuario=${encodeURIComponent(data.usuario || form.usuario)}`);
      let userData = await resUser.json();
      setUser(userData);
      setTimeout(async () => {
        const resUser2 = await fetch(`/api/usuario/info?usuario=${encodeURIComponent(data.usuario || form.usuario)}`);
        const userData2 = await resUser2.json();
        setUser(userData2);
      }, 500);
      setSesionIniciada(true);
      setPanelActivo('inicio');
      setShowLogin(false);
      toast.success('¡Sesión iniciada correctamente!');
    } catch (err) {
      setLoginError('Error de conexión con el servidor');
      toast.error('Error al iniciar sesión.');
    }
  };

  // Registro
  const handleRegister = async (data, setShowRegister, setShowVerify, toast) => {
    setRegisterError('');
    try {
      const res = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: data.nombre,
          apellidos: data.apellidos,
          usuario: data.usuario,
          correo: data.correo,
          contrasena: data.contrasena
        })
      });
      if (!res.ok) {
        const errorData = await res.json();
        setRegisterError(errorData.error || 'Error en el registro');
        toast.error(errorData.error || 'Error en el registro');
        return;
      }
      setPendingEmail(data.correo);
      setShowRegister(false);
      setShowVerify(true);
      toast.success('¡Registro exitoso! Revisa tu correo para verificar tu cuenta.');
    } catch (err) {
      setRegisterError('Error de conexión con el servidor');
      toast.error('Error de conexión con el servidor');
    }
  };

  // Logout
  const handleLogout = (toast) => {
    setSesionIniciada(false);
    toast.info('Sesión finalizada.');
  };

  return (
    <AuthContext.Provider value={{
      user, setUser,
      sesionIniciada, setSesionIniciada,
      loginError, setLoginError,
      registerError, setRegisterError,
      verifyError, setVerifyError,
      pendingEmail, setPendingEmail,
      registerSuccess, setRegisterSuccess,
      recoveryEmail, setRecoveryEmail,
      handleLogin,
      handleRegister,
      handleLogout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
