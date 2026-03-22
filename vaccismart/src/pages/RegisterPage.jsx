import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Stars from '../components/Stars';

const STEPS = ['Rôle', 'Identité', 'Enfant', 'Compte'];

const Err = ({ msg }) => msg ? <p style={{fontSize:11,color:'#f87171',marginTop:-10,marginBottom:10}}>⚠ {msg}</p> : null;

const RegisterPage = () => {
  const { isNight:N, toggleMode, setPage, login } = useApp();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [f, setF] = useState({
    role:'parent',
    firstName:'', lastName:'', phone:'', city:'', profession:'',
    childFirst:'', childLast:'', childBirth:'', childGender:'', childBlood:'', childAllergy:'',
    email:'', password:'', confirm:'',
    hospitalCode:'',
  });
  const set = (k,v) => setF(x=>({...x,[k]:v}));

  const validate = () => {
    const e={};
    if(step===0){/* role always valid */}
    if(step===1){
      if(!f.firstName.trim()) e.firstName='Prénom requis';
      if(!f.lastName.trim())  e.lastName='Nom requis';
      if(!f.phone.trim())     e.phone='Téléphone requis';
      if(!f.city.trim())      e.city='Ville requise';
    }
    if(step===2){
      if(!f.childFirst.trim())  e.childFirst='Prénom requis';
      if(!f.childLast.trim())   e.childLast='Nom requis';
      if(!f.childBirth)         e.childBirth='Date de naissance requise';
      if(!f.childGender)        e.childGender='Genre requis';
    }
    if(step===3){
      if(!f.email.trim())      e.email='Email requis';
      if(f.password.length<6)  e.password='Minimum 6 caractères';
      if(f.password!==f.confirm) e.confirm='Les mots de passe ne correspondent pas';
    }
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const next = () => {
    if(!validate()) return;
    if(step<3){ setStep(s=>s+1); setErrors({}); }
    else{
      setLoading(true);
      setTimeout(()=>{ setLoading(false); login(f.role, f.firstName, f.lastName, f.email); },1400);
    }
  };

  /* shared styles */
  const inp = {
    width:'100%', padding:'12px 16px', borderRadius:12, fontSize:14,
    fontFamily:'var(--font-body)', outline:'none',
    border:`1px solid ${N?'rgba(100,180,255,0.22)':'#c0d8f0'}`,
    background:N?'rgba(255,255,255,0.06)':'#f0f7fd',
    color:'var(--t-primary)', marginBottom:14, transition:'border-color .2s',
  };
  const lbl = txt => <label style={{fontSize:12,fontWeight:700,color:N?'#7eb8e8':'#1a5a8a',display:'block',marginBottom:6,fontFamily:'var(--font-main)',textTransform:'uppercase',letterSpacing:'.04em'}}>{txt}</label>;
  const pill = (val, cur, onClick, children) => (
    <button type="button" onClick={()=>onClick(val)} style={{
      flex:1, padding:'12px 8px', borderRadius:12, cursor:'pointer',
      border:`1.5px solid ${cur===val?(N?'#4da8f0':'#1a7bca'):(N?'rgba(100,180,255,0.18)':'#c0d8f0')}`,
      background:cur===val?(N?'rgba(77,168,240,0.15)':'#e0f0fb'):'transparent',
      color:cur===val?(N?'#4da8f0':'#1a7bca'):'var(--t-muted)',
      fontFamily:'var(--font-main)', fontWeight:700, fontSize:13, transition:'all .2s',
      display:'flex', flexDirection:'column', alignItems:'center', gap:5,
    }}>{children}</button>
  );

  const renderStep = () => {
    switch(step){
      /* ─── STEP 0 : ROLE ─── */
      case 0: return (
        <>
          <p style={{fontSize:13,color:'var(--t-muted)',marginBottom:20,lineHeight:1.6}}>
            Bienvenue sur VacciSmart ! Choisissez votre profil pour personnaliser votre expérience.
          </p>
          <div style={{display:'flex',gap:12,marginBottom:24}}>
            {pill('parent',f.role,v=>set('role',v),<><span style={{fontSize:32}}>👨‍👩‍👧</span><span>Parent / Tuteur</span><span style={{fontSize:10,opacity:.7}}>Suivre mes enfants</span></>)}
            {pill('medecin',f.role,v=>set('role',v),<><span style={{fontSize:32}}>🩺</span><span>Médecin</span><span style={{fontSize:10,opacity:.7}}>Gérer mes patients</span></>)}
          </div>
          <div style={{padding:'14px 16px',borderRadius:12,background:N?'rgba(77,168,240,0.07)':'#f0f8ff',border:`0.5px solid ${N?'rgba(100,180,255,0.2)':'#bfdbfe'}`}}>
            <p style={{fontSize:12,color:N?'#4da8f0':'#1a5a8a',lineHeight:1.7}}>
              {f.role==='parent'
                ? '👨‍👩‍👧 En tant que parent, vous pourrez suivre le calendrier vaccinal de vos enfants, recevoir des rappels automatiques J-1 et consulter notre assistant IA.'
                : '🩺 En tant que médecin, vous aurez accès aux vaccins à venir de vos patients et aux rappels automatiques.'}
            </p>
          </div>
        </>
      );

      /* ─── STEP 1 : IDENTITY ─── */
      case 1: return (
        <>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div>
              {lbl('Prénom *')}
              <input value={f.firstName} onChange={e=>set('firstName',e.target.value)} placeholder="Amina" style={inp}/>
              <Err msg={errors.firstName}/>
            </div>
            <div>
              {lbl('Nom *')}
              <input value={f.lastName} onChange={e=>set('lastName',e.target.value)} placeholder="Mbarga" style={inp}/>
              <Err msg={errors.lastName}/>
            </div>
          </div>

          {lbl('Téléphone *')}
          <input type="tel" value={f.phone} onChange={e=>set('phone',e.target.value)} placeholder="+237 6XX XXX XXX" style={inp}/>
          <Err msg={errors.phone}/>

          {lbl('Ville / Localité *')}
          <input value={f.city} onChange={e=>set('city',e.target.value)} placeholder="Yaoundé, Douala..." style={inp}/>
          <Err msg={errors.city}/>

          {lbl('Profession (optionnel)')}
          <input value={f.profession} onChange={e=>set('profession',e.target.value)} placeholder={f.role==='medecin'?'Pédiatre, Généraliste...':'Enseignant, Commerçant...'} style={inp}/>

          {f.role==='medecin' && (
            <>
              {lbl("Code hôpital / établissement")}
              <input value={f.hospitalCode} onChange={e=>set('hospitalCode',e.target.value)} placeholder="Ex : HOPITAL-CENTRAL-001" style={inp}/>
            </>
          )}
        </>
      );

      /* ─── STEP 2 : CHILD (parent only) or DONE (medecin) ─── */
      case 2: return f.role==='medecin' ? (
        <div style={{textAlign:'center',padding:'20px 0'}}>
          <div style={{fontSize:60,marginBottom:16}}>🏥</div>
          <p style={{fontFamily:'var(--font-main)',fontWeight:700,fontSize:16,color:'var(--t-primary)',marginBottom:8}}>Profil médecin prêt !</p>
          <p style={{fontSize:13,color:'var(--t-muted)',lineHeight:1.7}}>Il ne reste plus qu'à créer votre compte pour accéder à votre tableau de bord et gérer vos patients.</p>
        </div>
      ) : (
        <>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div>
              {lbl("Prénom enfant *")}
              <input value={f.childFirst} onChange={e=>set('childFirst',e.target.value)} placeholder="Sophie" style={inp}/>
              <Err msg={errors.childFirst}/>
            </div>
            <div>
              {lbl("Nom enfant *")}
              <input value={f.childLast} onChange={e=>set('childLast',e.target.value)} placeholder="Mbarga" style={inp}/>
              <Err msg={errors.childLast}/>
            </div>
          </div>

          {lbl("Date de naissance *")}
          <input type="date" value={f.childBirth} onChange={e=>set('childBirth',e.target.value)} style={inp}/>
          <Err msg={errors.childBirth}/>

          {lbl("Genre *")}
          <div style={{display:'flex',gap:10,marginBottom:14}}>
            {pill('fille', f.childGender, v=>set('childGender',v), <><span style={{fontSize:24}}>👧</span><span>Fille</span></>)}
            {pill('garcon',f.childGender, v=>set('childGender',v), <><span style={{fontSize:24}}>👦</span><span>Garçon</span></>)}
          </div>
          <Err msg={errors.childGender}/>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div>
              {lbl("Groupe sanguin")}
              <select value={f.childBlood} onChange={e=>set('childBlood',e.target.value)} style={{...inp,marginBottom:0}}>
                <option value="">Sélectionner</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g=><option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              {lbl("Allergies")}
              <input value={f.childAllergy} onChange={e=>set('childAllergy',e.target.value)} placeholder="Arachides, Pénicilline..." style={{...inp,marginBottom:0}}/>
            </div>
          </div>
        </>
      );

      /* ─── STEP 3 : ACCOUNT ─── */
      case 3: return (
        <>
          {lbl("Adresse email *")}
          <input type="email" value={f.email} onChange={e=>set('email',e.target.value)} placeholder="votre@email.com" style={inp}/>
          <Err msg={errors.email}/>

          {lbl("Mot de passe *")}
          <input type="password" value={f.password} onChange={e=>set('password',e.target.value)} placeholder="Minimum 6 caractères" style={inp}/>
          <Err msg={errors.password}/>

          {lbl("Confirmer le mot de passe *")}
          <input type="password" value={f.confirm} onChange={e=>set('confirm',e.target.value)} placeholder="Répéter le mot de passe" style={inp}/>
          <Err msg={errors.confirm}/>

          <div style={{padding:'12px 14px',borderRadius:12,background:N?'rgba(77,168,240,0.07)':'#f0f8ff',border:`0.5px solid ${N?'rgba(100,180,255,0.18)':'#bfdbfe'}`,marginBottom:4}}>
            <p style={{fontSize:11,color:N?'#4da8f0':'#1a5a8a',lineHeight:1.7}}>
              🔒 En créant votre compte, vous acceptez nos <span style={{textDecoration:'underline',cursor:'pointer'}}>Conditions d'utilisation</span> et notre <span style={{textDecoration:'underline',cursor:'pointer'}}>Politique de confidentialité</span>. Vos données sont chiffrées et sécurisées.
            </p>
          </div>
        </>
      );
      default: return null;
    }
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px 16px',position:'relative'}}>
      <Stars/>

      {/* Mode toggle top right */}
      <button onClick={toggleMode} style={{position:'fixed',top:16,right:16,zIndex:200,background:N?'rgba(100,180,255,0.1)':'rgba(255,255,255,0.6)',border:`0.5px solid ${N?'rgba(100,180,255,0.25)':'rgba(255,255,255,0.85)'}`,borderRadius:20,padding:'7px 16px',fontSize:12,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:6,color:N?'#4da8f0':'#1a5a8a',fontFamily:'var(--font-main)',backdropFilter:'blur(8px)'}}>
        {N?'☀️ Mode jour':'🌙 Mode nuit'}
      </button>

      <div className="fade-in-up" style={{width:'100%',maxWidth:480,position:'relative',zIndex:1}}>
        {/* Logo */}
        <div style={{textAlign:'center',marginBottom:24}}>
          <div style={{width:70,height:70,borderRadius:'50%',background:'linear-gradient(135deg,#1a7bca,#2196f3)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px',boxShadow:'0 6px 28px rgba(33,150,243,0.45)',animation:'floatUp 3s ease-in-out infinite'}}>
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
              <path d="M28 10L32 6M32 6L36 10M32 6V14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="32" cy="17" r="2.5" fill="white"/>
              <path d="M32 19.5L25 27" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M5 23L13 31L28 14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={{fontFamily:'var(--font-main)',fontSize:26,fontWeight:900,color:N?'#e2f0ff':'#1a3a5c',marginBottom:4}}>VacciSmart</h1>
          <p style={{fontSize:13,color:'var(--t-muted)'}}>Gestion intelligente des vaccinations</p>
        </div>

        {/* Card */}
        <div style={{background:N?'rgba(6,16,42,0.92)':'#fff',border:`0.5px solid ${N?'rgba(100,180,255,0.18)':'rgba(255,255,255,0.95)'}`,borderRadius:24,padding:'28px 28px 24px',boxShadow:N?'0 12px 60px rgba(0,0,0,0.5)':'0 12px 60px rgba(26,90,138,0.14)'}}>

          {/* Step indicator */}
          <div style={{display:'flex',alignItems:'center',marginBottom:24}}>
            {STEPS.map((s,i)=>(
              <React.Fragment key={s}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                  <div style={{width:30,height:30,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,fontFamily:'var(--font-main)',background:i<step?'linear-gradient(135deg,#22c55e,#4ade80)':i===step?'linear-gradient(135deg,#1a7bca,#2196f3)':'transparent',color:i<=step?'#fff':(N?'#3d6080':'#9ab8cc'),border:i>step?`1.5px solid ${N?'rgba(100,180,255,0.2)':'#c0d8f0'}`:'none',transition:'all .3s'}}>
                    {i<step?'✓':i+1}
                  </div>
                  <span style={{fontSize:9,fontWeight:700,color:i===step?(N?'#4da8f0':'#1a7bca'):'var(--t-muted)',fontFamily:'var(--font-main)',whiteSpace:'nowrap'}}>{s}</span>
                </div>
                {i<STEPS.length-1&&<div style={{flex:1,height:2,background:i<step?'linear-gradient(90deg,#22c55e,#4ade80)':'var(--border)',borderRadius:2,margin:'0 6px',marginBottom:18,transition:'background .3s'}}/>}
              </React.Fragment>
            ))}
          </div>

          {/* Step title */}
          <h2 style={{fontFamily:'var(--font-main)',fontWeight:800,fontSize:19,color:N?'#e2f0ff':'#1a3a5c',marginBottom:4}}>
            {['Choisissez votre profil','Vos informations personnelles',f.role==='parent'?'Informations de votre enfant':'Profil médecin','Créez votre compte'][step]}
          </h2>
          <p style={{fontSize:12,color:'var(--t-muted)',marginBottom:20}}>
            {['Sélectionnez votre rôle dans VacciSmart','Ces informations nous permettent de personnaliser votre suivi',f.role==='parent'?'Renseignez les informations de votre enfant':'Votre compte médecin est presque prêt','Sécurisez votre compte VacciSmart'][step]}
          </p>

          {/* Step content */}
          {renderStep()}

          {/* Navigation */}
          <div style={{display:'flex',gap:12,marginTop:8}}>
            {step>0&&(
              <button onClick={()=>{setStep(s=>s-1);setErrors({});}} style={{flex:1,padding:'13px',borderRadius:14,border:`1px solid ${N?'rgba(100,180,255,0.22)':'#c0d8f0'}`,background:'transparent',color:'var(--t-secondary)',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-main)'}}>
                ← Retour
              </button>
            )}
            <button onClick={next} disabled={loading} style={{flex:2,padding:'13px',borderRadius:14,border:'none',background:loading?'#5a9ec8':'linear-gradient(135deg,#1a7bca,#2196f3)',color:'#fff',fontSize:14,fontWeight:800,cursor:loading?'not-allowed':'pointer',fontFamily:'var(--font-main)',boxShadow:'0 5px 20px rgba(33,150,243,0.4)',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
              {loading?<><div style={{width:16,height:16,border:'2.5px solid rgba(255,255,255,0.35)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite'}}/>Création en cours...</>
              :step<3?'Continuer →':'🚀 Créer mon compte'}
            </button>
          </div>

          {/* Login link */}
          <p style={{textAlign:'center',fontSize:12,color:'var(--t-muted)',marginTop:16}}>
            Déjà inscrit ?{' '}
            <button onClick={()=>setPage('login')} style={{background:'none',border:'none',cursor:'pointer',color:N?'#4da8f0':'#1a7bca',fontWeight:800,fontSize:12,fontFamily:'var(--font-main)'}}>
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
