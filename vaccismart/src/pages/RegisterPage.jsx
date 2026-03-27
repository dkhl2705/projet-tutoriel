import React, { useState } from 'react';
import Stars from '../components/Stars';
import { useApp } from '../context/AppContext';
import { loginUser, registerUser } from '../services/api';

const STEPS = ['Profil', 'Identite', 'Enfant', 'Compte'];

const Err = ({ msg }) =>
  msg ? <p style={{ fontSize: 11, color: '#f87171', marginTop: -10, marginBottom: 10 }}>{msg}</p> : null;

const RegisterPage = () => {
  const { isNight: N, toggleMode, setPage, loginSuccess } = useApp();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    role: 'parent',
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    profession: '',
    childFirst: '',
    childLast: '',
    childBirth: '',
    childGender: '',
    childBlood: '',
    childAllergy: '',
    email: '',
    password: '',
    confirm: '',
    hospitalCode: '',
  });

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 12,
    fontSize: 14,
    fontFamily: 'var(--font-body)',
    outline: 'none',
    border: `1px solid ${N ? 'rgba(100,180,255,0.22)' : '#c0d8f0'}`,
    background: N ? 'rgba(255,255,255,0.06)' : '#f0f7fd',
    color: 'var(--t-primary)',
    marginBottom: 14,
    transition: 'border-color .2s',
    boxSizing: 'border-box',
  };

  const label = (text) => (
    <label
      style={{
        fontSize: 12,
        fontWeight: 700,
        color: N ? '#7eb8e8' : '#1a5a8a',
        display: 'block',
        marginBottom: 6,
        fontFamily: 'var(--font-main)',
        textTransform: 'uppercase',
        letterSpacing: '.04em',
      }}
    >
      {text}
    </label>
  );

  const pill = (value, current, onClick, children) => (
    <button
      type="button"
      onClick={() => onClick(value)}
      style={{
        flex: 1,
        padding: '12px 8px',
        borderRadius: 12,
        cursor: 'pointer',
        border: `1.5px solid ${
          current === value ? (N ? '#4da8f0' : '#1a7bca') : N ? 'rgba(100,180,255,0.18)' : '#c0d8f0'
        }`,
        background: current === value ? (N ? 'rgba(77,168,240,0.15)' : '#e0f0fb') : 'transparent',
        color: current === value ? (N ? '#4da8f0' : '#1a7bca') : 'var(--t-muted)',
        fontFamily: 'var(--font-main)',
        fontWeight: 700,
        fontSize: 13,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
      }}
    >
      {children}
    </button>
  );

  const validate = () => {
    const nextErrors = {};

    if (step === 1) {
      if (!form.firstName.trim()) nextErrors.firstName = 'Prenom requis';
      if (!form.lastName.trim()) nextErrors.lastName = 'Nom requis';
      if (!form.phone.trim()) nextErrors.phone = 'Telephone requis';
      if (!form.city.trim()) nextErrors.city = 'Ville requise';
    }

    if (step === 2 && form.role === 'parent') {
      if (!form.childFirst.trim()) nextErrors.childFirst = 'Prenom requis';
      if (!form.childLast.trim()) nextErrors.childLast = 'Nom requis';
      if (!form.childBirth) nextErrors.childBirth = 'Date de naissance requise';
      if (!form.childGender) nextErrors.childGender = 'Genre requis';
    }

    if (step === 3) {
      if (!form.email.trim()) nextErrors.email = 'Email requis';
      if (form.password.length < 6) nextErrors.password = 'Minimum 6 caracteres';
      if (form.password !== form.confirm) nextErrors.confirm = 'Les mots de passe ne correspondent pas';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submitRegistration = async () => {
    setLoading(true);
    setApiError('');

    const payload = {
      email: form.email,
      password: form.password,
      confirm_password: form.confirm,
      first_name: form.firstName,
      last_name: form.lastName,
      role: form.role,
      phone: form.phone,
      city: form.city,
      profession: form.profession,
      hospital_code: form.hospitalCode,
    };

    if (form.role === 'parent') {
      payload.child = {
        first_name: form.childFirst,
        last_name: form.childLast,
        birth_date: form.childBirth,
        gender: form.childGender,
        blood_type: form.childBlood,
        allergies: form.childAllergy,
        notes: '',
      };
    }

    try {
      await registerUser(payload);
      const loginData = await loginUser({ email: form.email, password: form.password });
      loginSuccess(loginData);
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    if (!validate()) return;
    if (step < 3) {
      setApiError('');
      setErrors({});
      setStep((current) => current + 1);
      return;
    }
    submitRegistration();
  };

  const renderStep = () => {
    if (step === 0) {
      return (
        <>
          <p style={{ fontSize: 13, color: 'var(--t-muted)', marginBottom: 20, lineHeight: 1.6 }}>
            Choisissez le profil a creer pour personnaliser l'espace VacciSmart.
          </p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            {pill(
              'parent',
              form.role,
              (value) => setField('role', value),
              <>
                <span style={{ fontSize: 32 }}>Parent</span>
                <span>Parent / Tuteur</span>
                <span style={{ fontSize: 10, opacity: 0.7 }}>Suivi des enfants</span>
              </>
            )}
            {pill(
              'medecin',
              form.role,
              (value) => setField('role', value),
              <>
                <span style={{ fontSize: 32 }}>Med</span>
                <span>Medecin</span>
                <span style={{ fontSize: 10, opacity: 0.7 }}>Suivi des patients</span>
              </>
            )}
          </div>
        </>
      );
    }

    if (step === 1) {
      return (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              {label('Prenom *')}
              <input value={form.firstName} onChange={(e) => setField('firstName', e.target.value)} style={inputStyle} />
              <Err msg={errors.firstName} />
            </div>
            <div>
              {label('Nom *')}
              <input value={form.lastName} onChange={(e) => setField('lastName', e.target.value)} style={inputStyle} />
              <Err msg={errors.lastName} />
            </div>
          </div>
          {label('Telephone *')}
          <input value={form.phone} onChange={(e) => setField('phone', e.target.value)} style={inputStyle} />
          <Err msg={errors.phone} />
          {label('Ville *')}
          <input value={form.city} onChange={(e) => setField('city', e.target.value)} style={inputStyle} />
          <Err msg={errors.city} />
          {label('Profession')}
          <input value={form.profession} onChange={(e) => setField('profession', e.target.value)} style={inputStyle} />
          {form.role === 'medecin' && (
            <>
              {label('Code hopital')}
              <input value={form.hospitalCode} onChange={(e) => setField('hospitalCode', e.target.value)} style={inputStyle} />
            </>
          )}
        </>
      );
    }

    if (step === 2 && form.role === 'medecin') {
      return (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: 16, color: 'var(--t-primary)', marginBottom: 8 }}>
            Le profil medecin est pret.
          </p>
          <p style={{ fontSize: 13, color: 'var(--t-muted)', lineHeight: 1.7 }}>
            Continuez pour creer vos identifiants et acceder au tableau de bord.
          </p>
        </div>
      );
    }

    if (step === 2) {
      return (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              {label('Prenom enfant *')}
              <input value={form.childFirst} onChange={(e) => setField('childFirst', e.target.value)} style={inputStyle} />
              <Err msg={errors.childFirst} />
            </div>
            <div>
              {label('Nom enfant *')}
              <input value={form.childLast} onChange={(e) => setField('childLast', e.target.value)} style={inputStyle} />
              <Err msg={errors.childLast} />
            </div>
          </div>
          {label('Date de naissance *')}
          <input type="date" value={form.childBirth} onChange={(e) => setField('childBirth', e.target.value)} style={inputStyle} />
          <Err msg={errors.childBirth} />
          {label('Genre *')}
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            {pill('fille', form.childGender, (value) => setField('childGender', value), <span>Fille</span>)}
            {pill('garcon', form.childGender, (value) => setField('childGender', value), <span>Garcon</span>)}
          </div>
          <Err msg={errors.childGender} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              {label('Groupe sanguin')}
              <select value={form.childBlood} onChange={(e) => setField('childBlood', e.target.value)} style={{ ...inputStyle, marginBottom: 0 }}>
                <option value="">Selectionner</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
            <div>
              {label('Allergies')}
              <input value={form.childAllergy} onChange={(e) => setField('childAllergy', e.target.value)} style={{ ...inputStyle, marginBottom: 0 }} />
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        {label('Email *')}
        <input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} style={inputStyle} />
        <Err msg={errors.email} />
        {label('Mot de passe *')}
        <input type="password" value={form.password} onChange={(e) => setField('password', e.target.value)} style={inputStyle} />
        <Err msg={errors.password} />
        {label('Confirmer le mot de passe *')}
        <input type="password" value={form.confirm} onChange={(e) => setField('confirm', e.target.value)} style={inputStyle} />
        <Err msg={errors.confirm} />
      </>
    );
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 16px', position: 'relative' }}>
      <Stars />
      <button
        onClick={toggleMode}
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 200,
          background: N ? 'rgba(100,180,255,0.1)' : 'rgba(255,255,255,0.6)',
          border: `0.5px solid ${N ? 'rgba(100,180,255,0.25)' : 'rgba(255,255,255,0.85)'}`,
          borderRadius: 20,
          padding: '7px 16px',
          fontSize: 12,
          fontWeight: 700,
          cursor: 'pointer',
          color: N ? '#4da8f0' : '#1a5a8a',
          fontFamily: 'var(--font-main)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {N ? 'Mode jour' : 'Mode nuit'}
      </button>

      <div className="fade-in-up" style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#1a7bca,#2196f3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 6px 28px rgba(33,150,243,0.45)',
            }}
          >
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 22 }}>VS</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-main)', fontSize: 26, fontWeight: 900, color: N ? '#e2f0ff' : '#1a3a5c', marginBottom: 4 }}>
            VacciSmart
          </h1>
          <p style={{ fontSize: 13, color: 'var(--t-muted)' }}>Creation de compte</p>
        </div>

        <div
          style={{
            background: N ? 'rgba(6,16,42,0.92)' : '#fff',
            border: `0.5px solid ${N ? 'rgba(100,180,255,0.18)' : 'rgba(255,255,255,0.95)'}`,
            borderRadius: 24,
            padding: '28px 28px 24px',
            boxShadow: N ? '0 12px 60px rgba(0,0,0,0.5)' : '0 12px 60px rgba(26,90,138,0.14)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
            {STEPS.map((item, index) => (
              <React.Fragment key={item}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 800,
                      fontFamily: 'var(--font-main)',
                      background:
                        index < step
                          ? 'linear-gradient(135deg,#22c55e,#4ade80)'
                          : index === step
                            ? 'linear-gradient(135deg,#1a7bca,#2196f3)'
                            : 'transparent',
                      color: index <= step ? '#fff' : N ? '#3d6080' : '#9ab8cc',
                      border: index > step ? `1.5px solid ${N ? 'rgba(100,180,255,0.2)' : '#c0d8f0'}` : 'none',
                    }}
                  >
                    {index < step ? 'OK' : index + 1}
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: index === step ? (N ? '#4da8f0' : '#1a7bca') : 'var(--t-muted)' }}>{item}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: index < step ? 'linear-gradient(90deg,#22c55e,#4ade80)' : 'var(--border)', borderRadius: 2, margin: '0 6px', marginBottom: 18 }} />
                )}
              </React.Fragment>
            ))}
          </div>

          <h2 style={{ fontFamily: 'var(--font-main)', fontWeight: 800, fontSize: 19, color: N ? '#e2f0ff' : '#1a3a5c', marginBottom: 4 }}>
            {step === 0 && 'Choisissez votre profil'}
            {step === 1 && 'Vos informations'}
            {step === 2 && (form.role === 'parent' ? "Informations de l'enfant" : 'Profil medecin')}
            {step === 3 && 'Creez votre compte'}
          </h2>
          <p style={{ fontSize: 12, color: 'var(--t-muted)', marginBottom: 20 }}>Seuls le register et le login sont relies a l'API pour le moment.</p>

          {apiError && (
            <div
              style={{
                background: N ? 'rgba(248,113,113,0.12)' : '#fee2e2',
                border: `0.5px solid ${N ? 'rgba(248,113,113,0.35)' : '#fca5a5'}`,
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 13,
                color: N ? '#f87171' : '#dc2626',
                marginBottom: 16,
              }}
            >
              {apiError}
            </div>
          )}

          {renderStep()}

          <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
            {step > 0 && (
              <button
                type="button"
                onClick={() => {
                  setStep((current) => current - 1);
                  setErrors({});
                  setApiError('');
                }}
                style={{
                  flex: 1,
                  padding: '13px',
                  borderRadius: 14,
                  border: `1px solid ${N ? 'rgba(100,180,255,0.22)' : '#c0d8f0'}`,
                  background: 'transparent',
                  color: 'var(--t-secondary)',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-main)',
                }}
              >
                Retour
              </button>
            )}
            <button
              type="button"
              onClick={next}
              disabled={loading}
              style={{
                flex: 2,
                padding: '13px',
                borderRadius: 14,
                border: 'none',
                background: loading ? '#5a9ec8' : 'linear-gradient(135deg,#1a7bca,#2196f3)',
                color: '#fff',
                fontSize: 14,
                fontWeight: 800,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-main)',
              }}
            >
              {loading ? 'Creation en cours...' : step < 3 ? 'Continuer' : 'Creer mon compte'}
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--t-muted)', marginTop: 16 }}>
            Deja inscrit ?{' '}
            <button
              onClick={() => setPage('login')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: N ? '#4da8f0' : '#1a7bca', fontWeight: 800, fontSize: 12, fontFamily: 'var(--font-main)' }}
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
