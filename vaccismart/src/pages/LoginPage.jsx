import React, { useState } from 'react';
import Stars from '../components/Stars';
import { useApp } from '../context/AppContext';
import { loginUser } from '../services/api';

const LoginPage = () => {
  const { isNight: N, loginSuccess, setPage } = useApp();
  const [role, setRole] = useState('parent');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showHospital, setShowHospital] = useState(false);

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 12,
    fontSize: 14,
    fontFamily: 'var(--font-body)',
    outline: 'none',
    border: `1px solid ${N ? 'rgba(126,200,248,0.25)' : '#c8dff0'}`,
    background: N ? 'rgba(255,255,255,0.06)' : '#f5f9fd',
    color: 'var(--text-primary)',
    marginBottom: 14,
    boxSizing: 'border-box',
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!email) {
      setError('Email requis');
      return;
    }
    if (!password) {
      setError('Mot de passe requis');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      if (data.user.role !== role) {
        setRole(data.user.role);
      }
      loginSuccess(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', position: 'relative' }}>
      <Stars />
      <div style={{ marginBottom: 14, position: 'relative', zIndex: 1 }}>
        <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'linear-gradient(135deg,#1a7bca,#2196f3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 28px rgba(33,150,243,0.45)' }}>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 24 }}>VS</span>
        </div>
      </div>

      <h1 className="fade-in-up" style={{ fontFamily: 'var(--font-main)', fontSize: 28, fontWeight: 900, color: N ? '#e2eeff' : '#1a3a5c', marginBottom: 4, position: 'relative', zIndex: 1 }}>
        VacciSmart
      </h1>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24, position: 'relative', zIndex: 1 }}>Connexion a l'API Django REST</p>

      <div style={{ display: 'flex', background: N ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.65)', borderRadius: 50, padding: 4, marginBottom: 22, border: `0.5px solid ${N ? 'rgba(126,200,248,0.2)' : 'rgba(255,255,255,0.95)'}`, backdropFilter: 'blur(8px)', position: 'relative', zIndex: 1 }}>
        {[['parent', 'Parent'], ['medecin', 'Medecin']].map(([currentRole, label]) => (
          <button
            key={currentRole}
            onClick={() => setRole(currentRole)}
            style={{
              padding: '10px 28px',
              borderRadius: 50,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              fontFamily: 'var(--font-main)',
              background: role === currentRole ? (N ? 'rgba(126,200,248,0.18)' : '#fff') : 'transparent',
              color: role === currentRole ? (N ? '#7ec8f8' : '#1a5a8a') : N ? '#4a6a8a' : '#7aa0b8',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="fade-in-up" style={{ background: N ? 'rgba(8,22,55,0.92)' : '#fff', border: `0.5px solid ${N ? 'rgba(126,200,248,0.2)' : 'rgba(255,255,255,0.95)'}`, borderRadius: 22, padding: '28px 28px 22px', width: '100%', maxWidth: 400, boxShadow: N ? '0 10px 50px rgba(0,0,0,0.45)' : '0 10px 50px rgba(26,90,138,0.13)', position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontFamily: 'var(--font-main)', fontSize: 19, fontWeight: 800, color: N ? '#e2eeff' : '#1a3a5c', marginBottom: 4 }}>
          {role === 'parent' ? 'Connexion Parent' : 'Connexion Medecin'}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 22 }}>Entrez vos identifiants crees via l'inscription.</p>

        <form onSubmit={handleLogin}>
          <label style={{ fontSize: 13, fontWeight: 700, color: N ? '#b8d4f0' : '#1a3a5c', display: 'block', marginBottom: 6, fontFamily: 'var(--font-main)' }}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={role === 'parent' ? 'parent@exemple.com' : 'medecin@hopital.cm'} style={inputStyle} />

          <label style={{ fontSize: 13, fontWeight: 700, color: N ? '#b8d4f0' : '#1a3a5c', display: 'block', marginBottom: 6, fontFamily: 'var(--font-main)' }}>Mot de passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Votre mot de passe" style={inputStyle} />

          {error && (
            <div className="fade-in" style={{ background: N ? 'rgba(248,113,113,0.12)' : '#fee2e2', border: `0.5px solid ${N ? 'rgba(248,113,113,0.35)' : '#fca5a5'}`, borderRadius: 10, padding: '10px 14px', fontSize: 13, color: N ? '#f87171' : '#dc2626', marginBottom: 14 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: loading ? '#5a9ec8' : 'linear-gradient(135deg,#1a7bca,#2196f3)', color: '#fff', fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-main)', marginBottom: 18 }}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
          Pas de compte ?{' '}
          <button type="button" onClick={() => setPage('register')} style={{ background: 'none', border: 'none', fontWeight: 800, color: N ? '#7ec8f8' : '#1a7bca', cursor: 'pointer', fontFamily: 'var(--font-main)', fontSize: 13 }}>
            S'inscrire
          </button>
        </p>

        <div onClick={() => setShowHospital((current) => !current)} style={{ textAlign: 'center', fontSize: 12, color: N ? '#5b8db5' : '#4a7a9b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontWeight: 600 }}>
          Connecter un hopital {showHospital ? '▲' : '▼'}
        </div>
        {showHospital && (
          <div className="fade-in" style={{ marginTop: 14, padding: 16, background: N ? 'rgba(33,150,243,0.07)' : '#f0f8ff', borderRadius: 14, border: `0.5px solid ${N ? 'rgba(126,200,248,0.2)' : '#bfdbfe'}` }}>
            <input placeholder="Code : HOPITAL-CENTRAL-001" style={{ ...inputStyle, marginBottom: 10, fontSize: 13 }} />
            <button type="button" style={{ width: '100%', padding: '10px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#00b894,#00cba9)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-main)' }}>
              Connecter l'etablissement
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
