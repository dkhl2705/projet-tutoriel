import React from 'react';
import { useApp } from '../context/AppContext';

const NAV_PARENT = [
  { key:'dashboard',     svg:'grid',    label:'Tableau de bord' },
  { key:'vaccins',       svg:'syringe', label:'Vaccins' },
  { key:'calendar',      svg:'cal',     label:'Calendrier' },
  { key:'chat',          svg:'bot',     label:'Assistant IA' },
  { key:'notifications', svg:'bell',    label:'Notifications' },
  { key:'hospitals',     svg:'hosp',    label:'Hôpitaux' },
  { key:'profile',       svg:'user',    label:'Profil' },
];
const NAV_DOCTOR = [
  { key:'doctor-upcoming',  svg:'syringe', label:'Vaccins à venir' },
  { key:'doctor-reminders', svg:'bell',    label:'Rappels' },
  { key:'profile',          svg:'user',    label:'Profil' },
];

const SVG = ({ name, color }) => {
  const s = { stroke: color, fill:'none', strokeWidth:1.6, strokeLinecap:'round', strokeLinejoin:'round' };
  const icons = {
    grid:    <svg width="18" height="18" viewBox="0 0 18 18"><rect x="1.5" y="1.5" width="6" height="6" rx="1.2" {...s}/><rect x="10.5" y="1.5" width="6" height="6" rx="1.2" {...s}/><rect x="1.5" y="10.5" width="6" height="6" rx="1.2" {...s}/><rect x="10.5" y="10.5" width="6" height="6" rx="1.2" {...s}/></svg>,
    syringe: <svg width="18" height="18" viewBox="0 0 18 18"><path d="M13 2l3 3-1.5 1.5-3-3L13 2zM11.5 4.5L4 12l-1.5 4 4-1.5 7.5-7.5-3-3z" {...s}/><path d="M7 9l2 2" {...s}/></svg>,
    cal:     <svg width="18" height="18" viewBox="0 0 18 18"><rect x="2" y="3" width="14" height="13" rx="2" {...s}/><path d="M2 7.5h14M6 1.5v3M12 1.5v3" {...s}/><rect x="5" y="10" width="2" height="2" rx=".5" fill={color}/><rect x="8.5" y="10" width="2" height="2" rx=".5" fill={color}/></svg>,
    bot:     <svg width="18" height="18" viewBox="0 0 18 18"><rect x="2.5" y="6" width="13" height="9" rx="2" {...s}/><circle cx="7" cy="10.5" r="1.2" fill={color}/><circle cx="11" cy="10.5" r="1.2" fill={color}/><path d="M7 13.5h4M9 6V3.5M9 3.5H6.5M9 3.5H11.5" {...s}/></svg>,
    bell:    <svg width="18" height="18" viewBox="0 0 18 18"><path d="M9 2a5 5 0 00-5 5v3.5L2.5 13h13L14 10.5V7a5 5 0 00-5-5z" {...s}/><path d="M7.5 15a1.5 1.5 0 003 0" {...s}/></svg>,
    hosp:    <svg width="18" height="18" viewBox="0 0 18 18"><rect x="2" y="4" width="14" height="12" rx="1.5" {...s}/><path d="M6 4V2.5a.5.5 0 01.5-.5h5a.5.5 0 01.5.5V4M9 8v4M7 10h4" {...s}/></svg>,
    user:    <svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="6.5" r="3.5" {...s}/><path d="M2.5 16.5c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" {...s}/></svg>,
    sun:     <svg width="16" height="16" viewBox="0 0 18 18"><circle cx="9" cy="9" r="4" {...s}/><path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.5 3.5l1.5 1.5M13 13l1.5 1.5M14.5 3.5L13 5M5 13l-1.5 1.5" {...s}/></svg>,
    moon:    <svg width="16" height="16" viewBox="0 0 18 18"><path d="M14.5 10.5A7 7 0 017.5 3.5a6 6 0 100 11 7 7 0 007-4z" {...s}/></svg>,
    logout:  <svg width="16" height="16" viewBox="0 0 18 18"><path d="M7 9h8M12 6l3 3-3 3" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/><path d="M10 3H4a1 1 0 00-1 1v10a1 1 0 001 1h6" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>,
  };
  return icons[name] || null;
};

const Sidebar = () => {
  const { isNight:N, role, user, page, setPage, toggleMode, logout } = useApp();
  const items = role === 'parent' ? NAV_PARENT : NAV_DOCTOR;

  const sidebarBg    = N ? 'rgba(4,12,32,0.98)'  : '#ffffff';
  const borderColor  = N ? 'rgba(100,180,255,0.08)' : 'rgba(26,123,202,0.10)';
  const textColor    = N ? '#8ab0d0' : '#4a6a85';
  const activeText   = '#ffffff';
  const hoverBg      = N ? 'rgba(100,180,255,0.07)' : 'rgba(26,123,202,0.07)';

  return (
    <div style={{
      width: 'var(--sidebar-w)', minWidth: 'var(--sidebar-w)',
      height: '100vh', position: 'sticky', top: 0,
      background: sidebarBg,
      borderRight: `1px solid ${borderColor}`,
      display: 'flex', flexDirection: 'column',
      zIndex: 50,
      boxShadow: N ? '4px 0 20px rgba(0,0,0,0.25)' : '2px 0 12px rgba(26,90,138,0.06)',
      transition: 'background 0.4s',
    }}>

      {/* ── Logo ── */}
      <div style={{ padding:'22px 20px 18px', borderBottom:`1px solid ${borderColor}`, display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:42,height:42,borderRadius:12,background:'linear-gradient(135deg,#1a7bca,#2196f3)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 4px 12px rgba(33,150,243,0.35)' }}>
          <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
            <path d="M5 23L13 31L28 14" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M30 8L33 5M33 5L36 8M33 5V13" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <p style={{ fontFamily:'var(--font-main)',fontWeight:800,fontSize:16,color:N?'#e2f0ff':'#1a3a5c',lineHeight:1.2 }}>VacciSmart</p>
          <p style={{ fontSize:11,color:textColor,marginTop:1 }}>{user?.name || ''}</p>
        </div>
      </div>

      {/* ── Nav items ── */}
      <nav style={{ flex:1, padding:'12px 12px', overflowY:'auto' }}>
        {items.map(item => {
          const active = page === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setPage(item.key)}
              style={{
                width:'100%', display:'flex', alignItems:'center', gap:12,
                padding:'11px 14px', borderRadius:10, marginBottom:2,
                border:'none', cursor:'pointer', textAlign:'left',
                fontFamily:'var(--font-main)', fontWeight: active ? 700 : 600, fontSize:14,
                background: active ? 'linear-gradient(135deg,#1a7bca,#2196f3)' : 'transparent',
                color: active ? activeText : textColor,
                boxShadow: active ? '0 4px 12px rgba(33,150,243,0.30)' : 'none',
                transition:'all .18s',
              }}
              onMouseEnter={e => { if(!active) e.currentTarget.style.background = hoverBg; }}
              onMouseLeave={e => { if(!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <SVG name={item.svg} color={active ? '#fff' : textColor} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* ── Bottom ── */}
      <div style={{ padding:'10px 12px 16px', borderTop:`1px solid ${borderColor}` }}>
        {/* Mode toggle */}
        <button
          onClick={toggleMode}
          style={{ width:'100%',display:'flex',alignItems:'center',gap:12,padding:'10px 14px',borderRadius:10,marginBottom:4,border:`1px solid ${borderColor}`,cursor:'pointer',background:'transparent',fontFamily:'var(--font-main)',fontWeight:600,fontSize:13,color:textColor,transition:'all .18s' }}
          onMouseEnter={e => e.currentTarget.style.background = hoverBg}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <SVG name={N ? 'sun' : 'moon'} color={textColor} />
          {N ? 'Mode Jour' : 'Mode Nuit'}
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          style={{ width:'100%',display:'flex',alignItems:'center',gap:12,padding:'10px 14px',borderRadius:10,border:'none',cursor:'pointer',background:'transparent',fontFamily:'var(--font-main)',fontWeight:600,fontSize:13,color:'#ef4444',transition:'all .18s' }}
          onMouseEnter={e => e.currentTarget.style.background = N?'rgba(239,68,68,0.08)':'rgba(239,68,68,0.06)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <SVG name="logout" color="#ef4444" />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
