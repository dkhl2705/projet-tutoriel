import React from 'react';
import { useApp } from '../context/AppContext';
import { CHILDREN, HOSPITALS } from '../assets/mockData';

const StatCard = ({ icon, label, value, color, sub }) => {
  const { isNight:N } = useApp();
  return (
    <div style={{background:N?'rgba(8,20,52,0.9)':'#fff',border:`1px solid ${N?'rgba(100,180,255,0.1)':'rgba(26,123,202,0.09)'}`,borderRadius:16,padding:'20px 22px',boxShadow:N?'0 4px 20px rgba(0,0,0,0.3)':'0 4px 20px rgba(26,90,138,0.07)'}}>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
        <span style={{fontSize:16}}>{icon}</span>
        <p style={{fontSize:13,color:'var(--t-secondary)',fontWeight:600}}>{label}</p>
      </div>
      <p style={{fontFamily:'var(--font-main)',fontWeight:900,fontSize:42,color:color,lineHeight:1,marginBottom:sub?8:0}}>{value}</p>
      {sub&&<div style={{height:5,borderRadius:5,background:N?'rgba(255,255,255,0.07)':'#e8f3fc',marginTop:10,overflow:'hidden'}}><div style={{height:'100%',width:`${sub}%`,background:color,borderRadius:5,animation:'progressFill 1.2s ease'}}/></div>}
    </div>
  );
};

const DashboardPage = () => {
  const { isNight:N, user, setPage, selectedChild, setSelectedChild } = useApp();
  const child = CHILDREN[selectedChild];
  const done     = child.vaccines.filter(v=>v.status==='done').length;
  const upcoming = child.vaccines.filter(v=>v.status==='upcoming').length;

  return (
    <div style={{flex:1,overflowY:'auto',padding:'32px 36px 40px',position:'relative',zIndex:1}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:28}}>
        <div>
          <h1 style={{fontFamily:'var(--font-main)',fontWeight:900,fontSize:28,color:N?'#e2f0ff':'#1a3a5c',marginBottom:6}}>Tableau de bord</h1>
          <p style={{fontSize:14,color:'var(--t-muted)'}}>Suivi de vaccination de vos enfants</p>
        </div>
        <button onClick={()=>setPage('vaccins')} style={{display:'flex',alignItems:'center',gap:8,padding:'12px 22px',borderRadius:12,border:'none',background:'linear-gradient(135deg,#1a7bca,#2196f3)',color:'#fff',fontSize:14,fontWeight:800,cursor:'pointer',fontFamily:'var(--font-main)',boxShadow:'0 4px 16px rgba(33,150,243,0.4)'}}>
          <span style={{fontSize:18}}>+</span> Nouveau vaccin
        </button>
      </div>

      {/* Child selector */}
      <div style={{display:'flex',gap:10,marginBottom:24,overflowX:'auto',paddingBottom:4}}>
        {CHILDREN.map((ch,i)=>(
          <button key={ch.id} onClick={()=>setSelectedChild(i)} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 18px',borderRadius:50,cursor:'pointer',border:`1.5px solid ${selectedChild===i?(N?'#4da8f0':'#1a7bca'):(N?'rgba(100,180,255,0.18)':'#c0d8f0')}`,background:selectedChild===i?(N?'rgba(77,168,240,0.15)':'#e0f0fb'):'transparent',color:selectedChild===i?(N?'#4da8f0':'#1a7bca'):'var(--t-muted)',fontFamily:'var(--font-main)',fontWeight:700,fontSize:13,whiteSpace:'nowrap',transition:'all .2s'}}>
            <span style={{fontSize:18}}>{ch.gender==='Fille'?'👧':'👦'}</span> {ch.firstName} {ch.lastName}
          </button>
        ))}
        <button style={{padding:'8px 18px',borderRadius:50,border:`1.5px dashed ${N?'rgba(100,180,255,0.22)':'#c0d8f0'}`,background:'transparent',color:'var(--t-muted)',fontFamily:'var(--font-main)',fontWeight:600,fontSize:13,cursor:'pointer',whiteSpace:'nowrap'}}>
          + Ajouter un enfant
        </button>
      </div>

      {/* Child card — matches mockup */}
      <div style={{background:N?'rgba(8,20,52,0.9)':'#edf6fc',border:`1px solid ${N?'rgba(100,180,255,0.12)':'rgba(26,123,202,0.10)'}`,borderRadius:18,padding:'22px 26px',marginBottom:22,boxShadow:N?'0 4px 24px rgba(0,0,0,0.3)':'0 4px 24px rgba(26,90,138,0.08)',display:'flex',alignItems:'center',gap:22}}>
        {/* Avatar */}
        <div style={{width:80,height:80,borderRadius:'50%',background:N?'rgba(77,168,240,0.15)':'#e0f0fb',border:`3px solid ${N?'rgba(77,168,240,0.35)':'#93c5fd'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:40,flexShrink:0}}>
          {child.gender==='Fille'?'👧':'👦'}
        </div>
        <div style={{flex:1}}>
          <h2 style={{fontFamily:'var(--font-main)',fontWeight:900,fontSize:22,color:N?'#e2f0ff':'#1a3a5c',marginBottom:8}}>
            {child.firstName} {child.lastName}
          </h2>
          <div style={{display:'flex',flexWrap:'wrap',gap:16,alignItems:'center'}}>
            <span style={{fontSize:13,color:'var(--t-secondary)',display:'flex',alignItems:'center',gap:5}}>
              <svg width="15" height="15" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.3" fill="none"/><path d="M2.5 16c0-3 2.9-5 6.5-5s6.5 2 6.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none"/></svg>
              {child.age}
            </span>
            <span style={{fontSize:13,color:'var(--t-secondary)',display:'flex',alignItems:'center',gap:5}}>
              <svg width="15" height="15" viewBox="0 0 18 18" fill="none"><rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.3" fill="none"/><path d="M2 7h14M6 1v4M12 1v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              Né(e) le {child.birthdate}
            </span>
            <span style={{fontSize:13,color:'var(--t-secondary)'}}>Groupe sanguin : <strong style={{color:N?'#4da8f0':'#1a7bca'}}>{child.bloodType}</strong></span>
          </div>
          {child.allergies!=='Aucune'&&(
            <div style={{marginTop:10,display:'flex',alignItems:'center',gap:6}}>
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="#ef4444" strokeWidth="1.3" fill="none"/><path d="M9 6v3.5M9 12v.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <span style={{fontSize:13,color:'#ef4444',fontWeight:600}}>Allergies : {child.allergies}</span>
            </div>
          )}
        </div>
        {/* Progress mini */}
        <div style={{textAlign:'center',flexShrink:0}}>
          <p style={{fontSize:11,color:'var(--t-muted)',marginBottom:4,fontFamily:'var(--font-main)',fontWeight:700}}>COUVERTURE</p>
          <p style={{fontFamily:'var(--font-main)',fontWeight:900,fontSize:28,color:N?'#4da8f0':'#1a7bca'}}>{child.progress}%</p>
          <div style={{width:80,height:5,borderRadius:5,background:N?'rgba(255,255,255,0.07)':'#e8f3fc',marginTop:6,overflow:'hidden'}}>
            <div style={{height:'100%',width:`${child.progress}%`,background:'linear-gradient(90deg,#1a7bca,#2196f3)',borderRadius:5,animation:'progressFill 1.2s ease'}}/>
          </div>
        </div>
      </div>

      {/* Urgent alert */}
      {child.nextVaccine.urgent&&(
        <div className="slide-in-l" style={{background:N?'rgba(245,158,11,0.1)':'#fffbeb',border:`1.5px solid ${N?'rgba(245,158,11,0.4)':'#fde68a'}`,borderRadius:16,padding:'14px 20px',marginBottom:22,display:'flex',alignItems:'center',gap:14}}>
          <div style={{fontSize:28,animation:'floatUp 2s ease-in-out infinite'}}>🔔</div>
          <div style={{flex:1}}>
            <p style={{fontFamily:'var(--font-main)',fontWeight:800,fontSize:14,color:N?'#fbbf24':'#92400e',marginBottom:2}}>Rappel : {child.nextVaccine.name} pour {child.firstName}</p>
            <p style={{fontSize:12,color:N?'#d97706':'#b45309'}}>{child.nextVaccine.date} · Notification push envoyée ✓</p>
          </div>
          <span style={{background:N?'rgba(245,158,11,0.18)':'#fef3c7',color:N?'#fbbf24':'#92400e',fontSize:10,fontWeight:800,padding:'4px 12px',borderRadius:20}}>Urgent</span>
        </div>
      )}

      {/* Stats row — matches mockup exactly */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16,marginBottom:24}}>
        <StatCard icon={<svg width="16" height="16" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="#22c55e" strokeWidth="1.4" fill="none"/><path d="M5.5 9l2.5 2.5 4.5-4.5" stroke="#22c55e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>} label="Vaccins complétés" value={done} color="#22c55e"/>
        <StatCard icon={<svg width="16" height="16" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="#f59e0b" strokeWidth="1.4" fill="none"/><path d="M9 5v4.5l2.5 2.5" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/></svg>} label="Vaccins à venir" value={upcoming} color="#f59e0b"/>
        <StatCard icon={<svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M2 14l4-4 3 3 4-5 3 2" stroke="#4da8f0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>} label="Couverture vaccinale" value={`${child.progress}%`} color="#4da8f0" sub={child.progress}/>
      </div>

      {/* Prochains vaccins */}
      <div style={{background:N?'rgba(8,20,52,0.9)':'#fff',border:`1px solid ${N?'rgba(100,180,255,0.1)':'rgba(26,123,202,0.08)'}`,borderRadius:16,padding:'20px 22px',marginBottom:20,boxShadow:N?'0 4px 20px rgba(0,0,0,0.28)':'0 4px 20px rgba(26,90,138,0.07)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2a5 5 0 00-5 5v3l-1.5 2.5h13L14 10V7a5 5 0 00-5-5z" stroke={N?'#4da8f0':'#1a7bca'} strokeWidth="1.4" fill="none"/><path d="M7.5 14.5a1.5 1.5 0 003 0" stroke={N?'#4da8f0':'#1a7bca'} strokeWidth="1.4" strokeLinecap="round"/></svg>
            <div>
              <p style={{fontFamily:'var(--font-main)',fontWeight:800,fontSize:15,color:N?'#e2f0ff':'#1a3a5c'}}>Prochains vaccins</p>
              <p style={{fontSize:11,color:'var(--t-muted)'}}>Vaccinations à planifier</p>
            </div>
          </div>
          <button onClick={()=>setPage('calendar')} style={{fontSize:12,color:N?'#4da8f0':'#1a7bca',background:'none',border:'none',cursor:'pointer',fontWeight:700,fontFamily:'var(--font-main)'}}>Voir le calendrier →</button>
        </div>
        {child.vaccines.filter(v=>v.status==='upcoming').map((v,i,arr)=>(
          <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:i<arr.length-1?`0.5px solid ${N?'rgba(100,180,255,0.08)':'rgba(26,123,202,0.07)'}`:' none'}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:38,height:38,borderRadius:12,background:N?'rgba(77,168,240,0.12)':'#e0f0fb',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>💉</div>
              <div>
                <p style={{fontFamily:'var(--font-main)',fontWeight:700,fontSize:14,color:N?'#e2f0ff':'#1a3a5c',marginBottom:2}}>{v.name}</p>
                <p style={{fontSize:11,color:'var(--t-muted)'}}>{v.doctor} · {v.hospital}</p>
              </div>
            </div>
            <span style={{fontSize:11,fontWeight:700,padding:'4px 12px',borderRadius:20,background:N?'rgba(77,168,240,0.12)':'#e0f0fb',color:N?'#4da8f0':'#1a7bca'}}>{v.date}</span>
          </div>
        ))}
      </div>

      {/* Hospitals */}
      <div style={{background:N?'rgba(8,20,52,0.9)':'#fff',border:`1px solid ${N?'rgba(100,180,255,0.1)':'rgba(26,123,202,0.08)'}`,borderRadius:16,padding:'20px 22px',boxShadow:N?'0 4px 20px rgba(0,0,0,0.28)':'0 4px 20px rgba(26,90,138,0.07)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <p style={{fontFamily:'var(--font-main)',fontWeight:800,fontSize:15,color:N?'#e2f0ff':'#1a3a5c'}}>🗺️ Centres proches</p>
          <button onClick={()=>setPage('hospitals')} style={{fontSize:12,color:N?'#4da8f0':'#1a7bca',background:'none',border:'none',cursor:'pointer',fontWeight:700,fontFamily:'var(--font-main)'}}>Voir tous →</button>
        </div>
        {HOSPITALS.slice(0,3).map((h,i)=>(
          <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:i<2?`0.5px solid ${N?'rgba(100,180,255,0.08)':'rgba(26,123,202,0.07)'}`:' none'}}>
            <div>
              <p style={{fontSize:13,fontWeight:700,color:N?'#e2f0ff':'#1a3a5c',marginBottom:2}}>{h.name}</p>
              <p style={{fontSize:11,color:'var(--t-muted)'}}>{h.distance} · ⭐ {h.rating}</p>
            </div>
            <span style={{fontSize:10,fontWeight:700,padding:'3px 10px',borderRadius:20,background:h.open?(N?'rgba(34,197,94,0.15)':'#dcfce7'):(N?'rgba(239,68,68,0.12)':'#fee2e2'),color:h.open?(N?'#4ade80':'#16a34a'):(N?'#f87171':'#dc2626')}}>
              {h.open?'● Ouvert':'● Fermé'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
