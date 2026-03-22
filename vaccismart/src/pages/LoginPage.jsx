import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Stars from '../components/Stars';

const Input = ({ label, ...props }) => {
  const { isNight: N } = useApp();
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display:'block', fontSize:13, fontWeight:700, color: N ? '#b8d4f0' : '#1a3a5c', marginBottom:6, fontFamily:'var(--font-main)' }}>{label}</label>}
      <input {...props} style={{ width:'100%', padding:'12px 16px', borderRadius:12, fontSize:14, fontFamily:'var(--font-body)', outline:'none', border:`1px solid ${N ? 'rgba(126,200,248,0.25)' : '#c8dff0'}`, background: N ? 'rgba(255,255,255,0.06)' : '#f5f9fd', color:'var(--text-primary)', boxSizing:'border-box', ...props.style }} />
    </div>
  );
};

const Err = ({ msg }) => msg ? <div style={{ fontSize:12, color:'#f87171', marginTop:-10, marginBottom:12 }}>⚠️ {msg}</div> : null;

const RegisterPage = ({ onDone }) => {
  const { isNight: N } = useApp();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errs, setErrs] = useState({});
  const [form, setForm] = useState({ role:'parent', email:'', password:'', confirm:'', firstName:'', lastName:'', phone:'', city:'', childFirst:'', childLast:'', childBirth:'', childGender:'', childBlood:'A+', childAllergy:'', hospCode:'', doctorName:'' });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const validate = () => {
    const e = {};
    if (step===0) { if (!form.email) e.email='Email requis'; if (form.password.length<6) e.password='Min 6 caractères'; if (form.password!==form.confirm) e.confirm='Mots de passe différents'; }
    if (step===1) { if (!form.firstName) e.firstName='Prénom requis'; if (!form.lastName) e.lastName='Nom requis'; if (!form.phone) e.phone='Téléphone requis'; }
    if (step===2) { if (!form.childFirst) e.childFirst='Prénom requis'; if (!form.childBirth) e.childBirth='Date requise'; if (!form.childGender) e.childGender='Genre requis'; }
    setErrs(e); return Object.keys(e).length===0;
  };

  const next = () => {
    if (!validate()) return;
    if (step<3) { setStep(s=>s+1); setErrs({}); }
    else { setLoading(true); setTimeout(()=>{ setLoading(false); onDone(form); }, 1300); }
  };

  const STEPS = ['Compte','Identité','Enfant','Hôpital'];
  const card = { background: N?'rgba(8,22,55,0.92)':'#fff', border:`0.5px solid ${N?'rgba(126,200,248,0.2)':'rgba(255,255,255,0.95)'}`, borderRadius:24, padding:'32px 30px 26px', width:'100%', maxWidth:440, boxShadow: N?'0 12px 60px rgba(0,0,0,0.5)':'0 12px 60px rgba(26,90,138,0.14)', position:'relative', zIndex:1 };

  const gBtn = (val,emoji,label) => (
    <button type="button" onClick={()=>set('childGender',val)} style={{ flex:1, padding:'12px 6px', borderRadius:12, cursor:'pointer', border:`1.5px solid ${form.childGender===val?'#1a7bca':(N?'rgba(126,200,248,0.2)':'#c8dff0')}`, background: form.childGender===val?(N?'rgba(33,150,243,0.18)':'#e8f3fc'):'transparent', color: form.childGender===val?(N?'#7ec8f8':'#1a7bca'):'var(--text-muted)', fontFamily:'var(--font-main)', fontWeight:700, fontSize:13, display:'flex', flexDirection:'column', alignItems:'center', gap:4, transition:'all 0.2s' }}>
      <span style={{fontSize:22}}>{emoji}</span>{label}
    </button>
  );

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 16px', position:'relative' }}>
      <Stars />
      <div style={{ marginBottom:14, position:'relative', zIndex:1, animation:'floatUp 3s ease-in-out infinite' }}>
        <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#1a7bca,#2196f3)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 6px 28px rgba(33,150,243,0.45)' }}>
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none"><path d="M6 22L14 30L28 14" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>
      <h1 style={{ fontFamily:'var(--font-main)', fontSize:26, fontWeight:900, color: N?'#e2eeff':'#1a3a5c', marginBottom:4, position:'relative', zIndex:1 }}>Créer un compte</h1>
      <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:24, position:'relative', zIndex:1 }}>VacciSmart — Gestion intelligente des vaccinations</p>

      <div style={{ display:'flex', gap:8, marginBottom:22, position:'relative', zIndex:1, alignItems:'center' }}>
        {STEPS.map((s,i) => (
          <React.Fragment key={s}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
              <div style={{ width: i===step?32:28, height: i===step?32:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background: i<step?'#22c55e':i===step?'#1a7bca':(N?'rgba(255,255,255,0.08)':'#e8f3fc'), color: i<=step?'#fff':'var(--text-muted)', fontFamily:'var(--font-main)', fontWeight:800, fontSize:12, transition:'all 0.3s', border: i===step?'2px solid rgba(33,150,243,0.5)':'none' }}>{i<step?'✓':i+1}</div>
              <span style={{ fontSize:9, color: i===step?(N?'#7ec8f8':'#1a7bca'):'var(--text-muted)', fontWeight: i===step?700:400, fontFamily:'var(--font-main)' }}>{s}</span>
            </div>
            {i<STEPS.length-1 && <div style={{ width:24, height:1.5, background: i<step?'#22c55e':(N?'rgba(126,200,248,0.2)':'#c8dff0'), marginBottom:14, transition:'background 0.4s' }} />}
          </React.Fragment>
        ))}
      </div>

      <div style={card}>
        {step===0 && <>
          <h2 style={{ fontFamily:'var(--font-main)', fontWeight:800, fontSize:18, color: N?'#e2eeff':'#1a3a5c', marginBottom:4 }}>🔐 Informations de connexion</h2>
          <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:20 }}>Créez vos identifiants pour accéder à l'application</p>
          <div style={{ display:'flex', gap:8, marginBottom:18 }}>
            {[['parent','😊','Parent'],['medecin','🩺','Médecin']].map(([r,ic,lbl]) => (
              <button key={r} type="button" onClick={()=>set('role',r)} style={{ flex:1, padding:'10px', borderRadius:12, cursor:'pointer', border:`1.5px solid ${form.role===r?'#1a7bca':(N?'rgba(126,200,248,0.2)':'#c8dff0')}`, background: form.role===r?(N?'rgba(33,150,243,0.16)':'#e8f3fc'):'transparent', color: form.role===r?(N?'#7ec8f8':'#1a7bca'):'var(--text-muted)', fontFamily:'var(--font-main)', fontWeight:700, fontSize:13, transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>{ic} {lbl}</button>
            ))}
          </div>
          <Input label="Adresse email" type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="votre@email.com"/>
          <Err msg={errs.email}/>
          <Input label="Mot de passe" type="password" value={form.password} onChange={e=>set('password',e.target.value)} placeholder="Minimum 6 caractères"/>
          <Err msg={errs.password}/>
          <Input label="Confirmer le mot de passe" type="password" value={form.confirm} onChange={e=>set('confirm',e.target.value)} placeholder="Répéter le mot de passe"/>
          <Err msg={errs.confirm}/>
        </>}

        {step===1 && <>
          <h2 style={{ fontFamily:'var(--font-main)', fontWeight:800, fontSize:18, color: N?'#e2eeff':'#1a3a5c', marginBottom:4 }}>👤 Vos informations</h2>
          <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:20 }}>Renseignez vos coordonnées personnelles</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div><Input label="Prénom" value={form.firstName} onChange={e=>set('firstName',e.target.value)} placeholder="Marie"/><Err msg={errs.firstName}/></div>
            <div><Input label="Nom" value={form.lastName} onChange={e=>set('lastName',e.target.value)} placeholder="Dupont"/><Err msg={errs.lastName}/></div>
          </div>
          <Input label="Téléphone" type="tel" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+237 6XX XXX XXX"/>
          <Err msg={errs.phone}/>
          <Input label="Ville / Localité" value={form.city} onChange={e=>set('city',e.target.value)} placeholder="Yaoundé, Douala..."/>
          <div style={{ padding:'12px 16px', borderRadius:12, background: N?'rgba(33,150,243,0.08)':'#f0f8ff', border:`0.5px solid ${N?'rgba(126,200,248,0.2)':'#bfdbfe'}` }}>
            <p style={{ fontSize:12, color: N?'#7ec8f8':'#1a5a8a', lineHeight:1.6 }}>🔒 Vos données sont chiffrées et ne sont jamais partagées sans votre consentement.</p>
          </div>
        </>}

        {step===2 && <>
          <h2 style={{ fontFamily:'var(--font-main)', fontWeight:800, fontSize:18, color: N?'#e2eeff':'#1a3a5c', marginBottom:4 }}>👶 Informations de l'enfant</h2>
          <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:20 }}>Ajoutez les informations de votre premier enfant</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div><Input label="Prénom" value={form.childFirst} onChange={e=>set('childFirst',e.target.value)} placeholder="Sophie"/><Err msg={errs.childFirst}/></div>
            <div><Input label="Nom" value={form.childLast} onChange={e=>set('childLast',e.target.value)} placeholder="Dupont"/></div>
          </div>
          <Input label="Date de naissance" type="date" value={form.childBirth} onChange={e=>set('childBirth',e.target.value)}/>
          <Err msg={errs.childBirth}/>
          <label style={{ display:'block', fontSize:13, fontWeight:700, color: N?'#b8d4f0':'#1a3a5c', marginBottom:8, fontFamily:'var(--font-main)' }}>Genre</label>
          <div style={{ display:'flex', gap:10, marginBottom:16 }}>{gBtn('F','👧','Fille')}{gBtn('M','👦','Garçon')}{gBtn('?','🧒','Non précisé')}</div>
          <Err msg={errs.childGender}/>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:700, color: N?'#b8d4f0':'#1a3a5c', marginBottom:6, fontFamily:'var(--font-main)' }}>Groupe sanguin</label>
              <select value={form.childBlood} onChange={e=>set('childBlood',e.target.value)} style={{ width:'100%', padding:'12px 16px', borderRadius:12, fontSize:14, border:`1px solid ${N?'rgba(126,200,248,0.25)':'#c8dff0'}`, background: N?'rgba(255,255,255,0.06)':'#f5f9fd', color:'var(--text-primary)', marginBottom:16, fontFamily:'var(--font-body)', outline:'none' }}>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-','Inconnu'].map(g=><option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <Input label="Allergies" value={form.childAllergy} onChange={e=>set('childAllergy',e.target.value)} placeholder="Arachides..."/>
          </div>
        </>}

        {step===3 && <>
          <h2 style={{ fontFamily:'var(--font-main)', fontWeight:800, fontSize:18, color: N?'#e2eeff':'#1a3a5c', marginBottom:4 }}>🏥 Établissement de santé</h2>
          <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:20 }}>Connectez votre hôpital ou médecin (optionnel)</p>
          <div style={{ padding:'14px 16px', borderRadius:14, background: N?'rgba(33,150,243,0.08)':'#f0f8ff', border:`0.5px solid ${N?'rgba(126,200,248,0.2)':'#bfdbfe'}`, marginBottom:20 }}>
            <p style={{ fontSize:13, fontWeight:700, color: N?'#7ec8f8':'#1a5a8a', marginBottom:6 }}>💡 Pourquoi connecter un hôpital ?</p>
            <ul style={{ fontSize:12, color: N?'#7ec8f8':'#1a5a8a', paddingLeft:16, lineHeight:2 }}>
              <li>Partage automatique du carnet vaccinal</li>
              <li>Rappels coordonnés avec l'hôpital</li>
              <li>Accès au dossier médical unifié</li>
            </ul>
          </div>
          <Input label="Code établissement" value={form.hospCode} onChange={e=>set('hospCode',e.target.value)} placeholder="Ex : HOPITAL-CENTRAL-001"/>
          <Input label="Médecin traitant" value={form.doctorName} onChange={e=>set('doctorName',e.target.value)} placeholder="Dr. Kamga Paul"/>
          <p style={{ fontSize:12, color:'var(--text-muted)', textAlign:'center' }}>Vous pouvez ignorer cette étape et connecter un hôpital plus tard.</p>
        </>}

        <div style={{ display:'flex', gap:12, marginTop:22 }}>
          {step>0 && <button type="button" onClick={()=>{setStep(s=>s-1);setErrs({});}} style={{ flex:1, padding:'13px', borderRadius:14, border:`1px solid ${N?'rgba(126,200,248,0.25)':'#c8dff0'}`, background:'transparent', color:'var(--text-secondary)', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'var(--font-main)' }}>← Retour</button>}
          <button type="button" onClick={next} disabled={loading} style={{ flex:2, padding:'13px', borderRadius:14, border:'none', background: loading?'#5a9ec8':'linear-gradient(135deg,#1a7bca,#2196f3)', color:'#fff', fontSize:14, fontWeight:800, cursor: loading?'not-allowed':'pointer', fontFamily:'var(--font-main)', boxShadow:'0 4px 18px rgba(33,150,243,0.4)', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            {loading?<><div style={{ width:16,height:16,border:'2.5px solid rgba(255,255,255,0.35)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.7s linear infinite' }}/>Création...</>:step<3?'Continuer →':'✓ Créer mon compte'}
          </button>
        </div>
        <p style={{ textAlign:'center', fontSize:13, color:'var(--text-muted)', marginTop:16 }}>
          Déjà un compte ? <button type="button" onClick={()=>onDone(null)} style={{ background:'none', border:'none', fontWeight:800, color: N?'#7ec8f8':'#1a7bca', cursor:'pointer', fontFamily:'var(--font-main)', fontSize:13 }}>Se connecter</button>
        </p>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const { login, isNight: N } = useApp();
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('parent');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showHospital, setShowHospital] = useState(false);

  if (mode==='register') return <RegisterPage onDone={form => { if (!form) { setMode('login'); return; } login(form.role, form.email, `${form.firstName} ${form.lastName}`); }} />;

  const inp = { width:'100%', padding:'12px 16px', borderRadius:12, fontSize:14, fontFamily:'var(--font-body)', outline:'none', border:`1px solid ${N?'rgba(126,200,248,0.25)':'#c8dff0'}`, background: N?'rgba(255,255,255,0.06)':'#f5f9fd', color:'var(--text-primary)', marginBottom:14 };

  const handleLogin = e => {
    e.preventDefault();
    if (!email) { setError('Email requis'); return; }
    if (!password) { setError('Mot de passe requis'); return; }
    setError(''); setLoading(true);
    setTimeout(() => { setLoading(false); login(role, email); }, 1200);
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 16px', position:'relative' }}>
      <Stars/>
      <div style={{ marginBottom:14, position:'relative', zIndex:1, animation:'floatUp 3s ease-in-out infinite' }}>
        <div style={{ width:76, height:76, borderRadius:'50%', background:'linear-gradient(135deg,#1a7bca,#2196f3)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 6px 28px rgba(33,150,243,0.45)' }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M6 22L14 30L28 14" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>
      <h1 className="fade-in-up" style={{ fontFamily:'var(--font-main)', fontSize:28, fontWeight:900, color: N?'#e2eeff':'#1a3a5c', marginBottom:4, position:'relative', zIndex:1 }}>VacciSmart</h1>
      <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:24, position:'relative', zIndex:1 }}>Gestion intelligente des vaccinations</p>

      <div style={{ display:'flex', background: N?'rgba(255,255,255,0.07)':'rgba(255,255,255,0.65)', borderRadius:50, padding:4, marginBottom:22, border:`0.5px solid ${N?'rgba(126,200,248,0.2)':'rgba(255,255,255,0.95)'}`, backdropFilter:'blur(8px)', position:'relative', zIndex:1 }}>
        {[['parent','😊','Parent'],['medecin','🩺','Médecin']].map(([r,ic,lbl]) => (
          <button key={r} onClick={()=>setRole(r)} style={{ padding:'10px 28px', borderRadius:50, fontSize:14, fontWeight:700, cursor:'pointer', border:'none', display:'flex', alignItems:'center', gap:6, fontFamily:'var(--font-main)', transition:'all 0.25s', background: role===r?(N?'rgba(126,200,248,0.18)':'#fff'):'transparent', color: role===r?(N?'#7ec8f8':'#1a5a8a'):(N?'#4a6a8a':'#7aa0b8'), boxShadow: role===r&&!N?'0 2px 14px rgba(26,90,138,0.14)':'none' }}>{ic} {lbl}</button>
        ))}
      </div>

      <div className="fade-in-up" style={{ background: N?'rgba(8,22,55,0.92)':'#fff', border:`0.5px solid ${N?'rgba(126,200,248,0.2)':'rgba(255,255,255,0.95)'}`, borderRadius:22, padding:'28px 28px 22px', width:'100%', maxWidth:400, boxShadow: N?'0 10px 50px rgba(0,0,0,0.45)':'0 10px 50px rgba(26,90,138,0.13)', position:'relative', zIndex:1 }}>
        <h2 style={{ fontFamily:'var(--font-main)', fontSize:19, fontWeight:800, color: N?'#e2eeff':'#1a3a5c', marginBottom:4 }}>{role==='parent'?'👨‍👩‍👧 Connexion Parent':'🩺 Connexion Médecin'}</h2>
        <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:22 }}>{role==='parent'?'Gérez les vaccins de vos enfants':'Accédez au tableau de bord patients'}</p>
        <form onSubmit={handleLogin}>
          <label style={{ fontSize:13, fontWeight:700, color: N?'#b8d4f0':'#1a3a5c', display:'block', marginBottom:6, fontFamily:'var(--font-main)' }}>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder={role==='parent'?'parent@exemple.com':'medecin@hopital.cm'} style={inp}/>
          <label style={{ fontSize:13, fontWeight:700, color: N?'#b8d4f0':'#1a3a5c', display:'block', marginBottom:6, fontFamily:'var(--font-main)' }}>Mot de passe</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" style={inp}/>
          <div style={{ textAlign:'right', marginTop:-10, marginBottom:18 }}><a href="#" style={{ fontSize:12, color: N?'#7ec8f8':'#2196f3', textDecoration:'none', fontWeight:600 }}>Mot de passe oublié ?</a></div>
          {error && <div className="fade-in" style={{ background: N?'rgba(248,113,113,0.12)':'#fee2e2', border:`0.5px solid ${N?'rgba(248,113,113,0.35)':'#fca5a5'}`, borderRadius:10, padding:'10px 14px', fontSize:13, color: N?'#f87171':'#dc2626', marginBottom:14 }}>⚠️ {error}</div>}
          <button type="submit" disabled={loading} style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', background: loading?'#5a9ec8':'linear-gradient(135deg,#1a7bca,#2196f3)', color:'#fff', fontSize:15, fontWeight:800, cursor: loading?'not-allowed':'pointer', fontFamily:'var(--font-main)', marginBottom:18, boxShadow:'0 5px 20px rgba(33,150,243,0.42)', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            {loading?<><div style={{ width:16,height:16,border:'2.5px solid rgba(255,255,255,0.35)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.7s linear infinite' }}/>Connexion...</>:'Se connecter'}
          </button>
        </form>
        <p style={{ textAlign:'center', fontSize:13, color:'var(--text-muted)', marginBottom:14 }}>Pas de compte ? <button type="button" onClick={()=>setMode('register')} style={{ background:'none', border:'none', fontWeight:800, color: N?'#7ec8f8':'#1a7bca', cursor:'pointer', fontFamily:'var(--font-main)', fontSize:13 }}>S'inscrire</button></p>
        <div onClick={()=>setShowHospital(s=>!s)} style={{ textAlign:'center', fontSize:12, color: N?'#5b8db5':'#4a7a9b', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:5, fontWeight:600 }}>🏥 Connecter un hôpital {showHospital?'▲':'▼'}</div>
        {showHospital && (
          <div className="fade-in" style={{ marginTop:14, padding:16, background: N?'rgba(33,150,243,0.07)':'#f0f8ff', borderRadius:14, border:`0.5px solid ${N?'rgba(126,200,248,0.2)':'#bfdbfe'}` }}>
            <input placeholder="Code : HOPITAL-CENTRAL-001" style={{ ...inp, marginBottom:10, fontSize:13 }}/>
            <button style={{ width:'100%', padding:'10px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#00b894,#00cba9)', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'var(--font-main)' }}>✓ Connecter l'établissement</button>
          </div>
        )}
      </div>
      <div style={{ position:'fixed', bottom:18, right:18, zIndex:200, width:36, height:36, borderRadius:'50%', background: N?'rgba(126,200,248,0.12)':'rgba(255,255,255,0.6)', border:`0.5px solid ${N?'rgba(126,200,248,0.3)':'rgba(255,255,255,0.9)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, cursor:'pointer', color: N?'#7ec8f8':'#1a5a8a', fontWeight:800, backdropFilter:'blur(8px)' }}>?</div>
    </div>
  );
};

export default LoginPage;
