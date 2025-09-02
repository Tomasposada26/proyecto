import React, { useState, useEffect } from 'react';
import Spinner from '../assets/components/Spinner';


const VerifyModal = ({ isOpen, onClose, onVerify, correo, errorMsg }) => {
  const [inputs, setInputs] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  // Usar useRef para mantener la referencia estable
  // Contador regresivo
  useEffect(() => {
    if (!isOpen) return;
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer, isOpen]);

  // Reenviar código solo con el botón de reenvío
  const handleResendCode = async () => {
    setCanResend(false);
    setTimer(60);
    setInputs(['', '', '', '', '', '']);
    try {
      const res = await fetch('/api/reenviar-verificacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo })
      });
      if (!res.ok) {
        setError('No se pudo reenviar el código');
      }
    } catch {
      setError('No se pudo reenviar el código');
    }
  };

  const inputRefs = React.useRef(Array.from({ length: 6 }, () => React.createRef()));
  const modalRef = React.useRef(null);

  // Focus first input when modal opens
  React.useEffect(() => {
    if (isOpen && inputRefs.current[0].current) {
      inputRefs.current[0].current.focus();
    }
  }, [isOpen]);

  // Focus trap and Escape key
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll('input,button,[tabindex]:not([tabindex="-1"])');
        const focusableArr = Array.from(focusable).filter(el => !el.disabled && el.tabIndex !== -1);
        if (focusableArr.length === 0) return;
        const first = focusableArr[0];
        const last = focusableArr[focusableArr.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9a-zA-Z]/g, '').slice(0, 1);
    const newInputs = [...inputs];
    newInputs[idx] = val;
    setInputs(newInputs);
    if (val && idx < 5) {
      inputRefs.current[idx + 1].current.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !inputs[idx] && idx > 0) {
      inputRefs.current[idx - 1].current.focus();
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const code = inputs.join('');
    if (code.length !== 6) {
      setError('Ingresa el código completo');
      return;
    }
    setError('');
    setLoading(true);
    await onVerify(code);
    setLoading(false);
  };

  // Animación suave para el modal
  return (
    <div
      ref={modalRef}
      style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: isOpen ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: isOpen ? 'auto' : 'none',
      opacity: isOpen ? 1 : 0,
      transition: 'opacity 0.3s cubic-bezier(.4,0,.2,1), background 0.3s cubic-bezier(.4,0,.2,1)'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 10,
        width: 350,
        padding: 32,
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
        position: 'relative',
        transform: isOpen ? 'scale(1)' : 'scale(0.95)',
        opacity: isOpen ? 1 : 0,
        transition: 'opacity 0.3s cubic-bezier(.4,0,.2,1), transform 0.3s cubic-bezier(.4,0,.2,1)'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>×</button>
        <h2 style={{ marginBottom: 16, textAlign: 'center', fontWeight: 700 }}>Verificar cuenta</h2>
        <div style={{ marginBottom: 12, color: '#444', fontSize: 15, textAlign: 'center' }}>
          Ingresa el código que te enviamos a <b style={{color:'#6366f1'}}>{correo}</b>
        </div>
        <form onSubmit={handleSubmit} aria-label="Formulario de verificación de cuenta">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 18 }}>
            <label htmlFor="verify-codigo-0" style={{ position: 'absolute', left: '-9999px' }}>Código de verificación</label>
            {inputs.map((val, idx) => (
              <input
                key={idx}
                id={`verify-codigo-${idx}`}
                ref={inputRefs.current[idx]}
                type="text"
                inputMode="text"
                maxLength={1}
                value={val}
                onChange={e => handleChange(e, idx)}
                onKeyDown={e => handleKeyDown(e, idx)}
                style={{
                  width: 44,
                  height: 48,
                  border: '2px solid #6366f1',
                  borderRadius: 8,
                  fontSize: 28,
                  textAlign: 'center',
                  outline: 'none',
                  background: '#fafbfc',
                  color: '#222',
                  fontWeight: 600,
                  boxShadow: 'none',
                  transition: 'border 0.2s',
                }}
                aria-label={`Dígito ${idx + 1} del código de verificación`}
                aria-required="true"
              />
            ))}
          </div>
          {error && <div style={{ color: 'red', marginBottom: 10, textAlign: 'center' }} role="alert">{error}</div>}
          {errorMsg && <div style={{ color: 'red', marginBottom: 10, textAlign: 'center' }} role="alert">{errorMsg}</div>}
          <div style={{textAlign:'center', marginBottom:10, color:'#888', fontSize:15}}>
            {canResend ? (
              <button type="button" style={{background:'none', border:'none', color:'#6366f1', textDecoration:'underline', cursor:'pointer', fontSize:15, fontWeight:600, padding:0}} onClick={handleResendCode}>
                Enviar nuevo código
              </button>
            ) : (
              <>Puedes reenviar código en {timer}s</>
            )}
          </div>
          <button
            type="submit"
            style={{ width: '100%', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: 14, fontWeight: 700, fontSize: 17, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? <Spinner size={22} color="#fff" /> : 'Verificar cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyModal;
