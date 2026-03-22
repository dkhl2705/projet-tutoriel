import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CHILDREN, HOSPITALS, DOCTOR_PATIENTS, AI_RESPONSES } from '../assets/mockData';

/* ─────────────── shared card ─────────────── */
const Card = ({ children, style={} }) => {
  const { isNight:N } = useApp();
  return <div style={{ background:N?'rgba(8,20,52,0.9)':'#fff', border:`1px solid ${N?'rgba(100,180,255,0.1)':'rgba(26,123,202,0.08)'}`, borderRadius:16, padding:'20px 22px', boxShadow:N?'0 4px 20px rgba(0,0,0,0.28)':'0 4px 20px rgba(26,90,138,0.07)', ...style }}>{children}</div>;
};

/* ════════════════ VACCINS ════════════════ */
export const VaccinsPage = () => {
  const { isNight:N, selectedChild, setSelectedChild } = useApp();
  const child = CHILDREN[selectedChild];
  const [filter, setFilter] = useState('all');
  const filtered = child.vaccines.filter(v => filter==='all'||v.status===filter);
  return (
    <div style={{flex:1,overflowY:'auto',padding:'32px 36px 40px'}}>
      <h1 style={{fontFamily:'var(--font-main)',fontWeight:900,fontSize:28,color:N?'#e2f0ff':'#1a3a5c',marginBottom:6}}>💉 Vaccins</h1>
      <p style={{fontSize:13,color:'var(--t-muted)',marginBottom:24}}>Historique complet des vaccinations</p>

      <div style={{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap'}}>
        {CHILDREN.map((ch,i)=>(
          <button key={ch.id} onClick={()=>setSelectedChild(i)} style={{padding:'7px 16px',borderRadius:50,border:`1.5px solid ${selectedChild===i?(N?'#4da8f0':'#1a7bca'):(N?'rgba(100,180,255,0.18)':'#c0d8f0')}`,background:selectedChild===i?(N?'rgba(77,168,240,0.15)':'#e0f0fb'):'transparent',color:selectedChild===i?(N?'#4da8f0':'#1a7bca'):'var(--t-muted)',fontFamily:'var(--font-main)',fontWeight:700,fontSize:12,cursor:'pointer'}}>
            {ch.gender==='Fille'?'👧':'👦'} {ch.firstName}
          </button>
        ))}
        <div style={{flex:1}}/>
        {[['all','Tous'],['done','Effectués'],['upcoming','À venir']].map(([k,l])=>(
          <button key={k} onClick={()=>setFilter(k)} style={{padding:'7px 16px',borderRadius:50,fontSize:12,fontWeight:700,fontFamily:'var(--font-main)',cursor:'pointer',border:`0.5px solid ${filter===k?(N?'rgba(100,180,255,0.5)':'#93c5fd'):'transparent'}`,background:filter===k?(N?'rgba(77,168,240,0.18)':'#e0f0fb'):(N?'rgba(255,255,255,0.04)':'#f0f7fd'),color:filter===k?(N?'#4da8f0':'#1a7bca'):'var(--t-muted)',transition:'all .2s'}}>
            {l}
          </button>
        ))}
      </div>

      <Card>
        {filtered.map((v,i,arr)=>(
          <div key={i} style={{display:'flex',gap:14,padding:'14px 0',borderBottom:i<arr.length-1?`0.5px solid ${N?'rgba(100,180,255,0.08)':'rgba(26,123,202,0.07)'}`:' none'}}>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',paddingTop:3}}>
              <div style={{width:13,height:13,borderRadius:'50%',background:v.status==='done'?(N?'#4ade80':'#22c55e'):(N?'#fbbf24':'#f59e0b'),boxShadow:v.status==='done'?'0 0 0 3px rgba(74,222,128,0.2)':'0 0 0 3px rgba(245,158,11,0.2)',flexShrink:0}}/>
              {i<arr.length-1&&<div style={{width:1.5,flex:1,minHeight:20,background:N?'rgba(100,180,255,0.1)':'rgba(26,123,202,0.07)',marginTop:4}}/>}
            </div>
            <div style={{flex:1}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div>
                  <p style={{fontFamily:'var(--font-main)',fontWeight:700,fontSize:14,color:N?'#e2f0ff':'#1a3a5c',marginBottom:2}}>{v.name}</p>
                  <p style={{fontSize:11,color:'var(--t-muted)',marginBottom:v.status==='done'?3:0}}>{v.date}</p>
                  {v.status==='done'&&<p style={{fontSize:11,color:'var(--t-muted)'}}>👨‍⚕️ {v.doctor} · 🏥 {v.hospital}</p>}
                  {v.note&&<p style={{fontSize:11,color:N?'#4da8f0':'#4a7a9b',marginTop:3,fontStyle:'italic'}}>📝 {v.note}</p>}
                </div>
                <span style={{fontSize:10,fontWeight:700,padding:'3px 10px',borderRadius:20,flexShrink:0,marginLeft:8,background:v.status==='done'?(N?'rgba(74,222,128,0.15)':'#dcfce7'):(N?'rgba(245,158,11,0.15)':'#fef3c7'),color:v.status==='done'?(N?'#4ade80':'#16a34a'):(N?'#fbbf24':'#92400e')}}>
                  {v.status==='done'?'✓ Effectué':'⏰ Prévu'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};

/* ════════════════ CALENDAR ════════════════ */
const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const DAYS   = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
const DIMS   = [31,28,31,30,31,30,31,31,30,31,30,31];
const START  = [3,6,0,3,5,1,3,6,2,4,0,2]; // Thu = Jan 2026

export const CalendarPage = () => {
  const { isNight:N, selectedChild } = useApp();
  const child = CHILDREN[selectedChild];
  const [month, setMonth] = useState(0);

  const vacDays = child.vaccines.filter(v=>v.status==='upcoming').map(v=>{
    const parts = v.date.split(' ');
    const m = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'].indexOf(parts[1].slice(0,3));
    return { day:parseInt(parts[0]), month:m };
  });

  return (
    <div style={{flex:1,overflowY:'auto',padding:'32px 36px 40px'}}>
      <h1 style={{fontFamily:'var(--font-main)',fontWeight:900,fontSize:28,color:N?'#e2f0ff':'#1a3a5c',marginBottom:6}}>📅 Calendrier</h1>
      <p style={{fontSize:13,color:'var(--t-muted)',marginBottom:24}}>{child.firstName} {child.lastName}</p>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
        <Card>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
            <button onClick={()=>setMonth(m=>Math.max(0,m-1))} style={{background:'none',border:'none',fontSize:20,cursor:'pointer',color:'var(--t-muted)',padding:'0 6px'}}>‹</button>
            <span style={{fontFamily:'var(--font-main)',fontWeight:800,fontSize:16,color:N?'#e2f0ff':'#1a3a5c'}}>{MONTHS[month]} 2026</span>
            <button onClick={()=>setMonth(m=>Math.min(11,m+1))} style={{background:'none',border:'none',fontSize:20,cursor:'pointer',color:'var(--t-muted)',padding:'0 6px'}}>›</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:3,marginBottom:6}}>
            {DAYS.map(d=><div key={d} style={{textAlign:'center',fontSize:10,fontWeight:800,color:'var(--t-muted)',padding:'4px 0',fontFamily:'var(--font-main)'}}>{d}</div>)}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:3}}>
            {Array.from({length:START[month]}).map((_,i)=><div key={`e${i}`}/>)}
            {Array.from({length:DIMS[month]},(_,i)=>i+1).map(day=>{
              const hasV = vacDays.some(v=>v.day===day&&v.month===month);
              const isToday = month===0&&day===22;
              return <div key={day} style={{textAlign:'center',padding:'8px 2px',borderRadius:9,fontSize:12,fontWeight:hasV||isToday?800:400,background:hasV?(N?'rgba(77,168,240,0.2)':'#e0f0fb'):isToday?(N?'rgba(77,168,240,0.12)':'#f0f7fd'):'transparent',color:hasV?(N?'#4da8f0':'#1a7bca'):'var(--t-primary)',border:isToday?`1.5px solid ${N?'#4da8f0':'#1a7bca'}`:'none',position:'relative',fontFamily:'var(--font-main)'}}>
                {day}{hasV&&<div style={{position:'absolute',bottom:2,left:'50%',transform:'translateX(-50%)',width:5,height:5,borderRadius:'50%',background:N?'#4da8f0':'#1a7bca'}}/>}
              </div>;
            })}
          </div>
        </Card>

        <Card>
          <p style={{fontFamily:'var(--font-main)',fontWeight:800,fontSize:15,color:N?'#e2f0ff':'#1a3a5c',marginBottom:14}}>Tous les vaccins</p>
          {child.vaccines.map((v,i,arr)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:i<arr.length-1?`0.5px solid ${N?'rgba(100,180,255,0.08)':'rgba(26,123,202,0.07)'}`:' none'}}>
              <div style={{width:34,height:34,borderRadius:10,background:v.status==='done'?(N?'rgba(74,222,128,0.15)':'#dcfce7'):(N?'rgba(77,168,240,0.12)':'#e0f0fb'),display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>
                {v.status==='done'?'✅':'💉'}
              </div>
              <div style={{flex:1}}>
                <p style={{fontFamily:'var(--font-main)',fontWeight:700,fontSize:13,color:N?'#e2f0ff':'#1a3a5c',marginBottom:1}}>{v.name}</p>
                <p style={{fontSize:11,color:'var(--t-muted)'}}>{v.date}</p>
              </div>
              <span style={{fontSize:10,fontWeight:700,padding:'3px 9px',borderRadius:20,background:v.status==='done'?(N?'rgba(74,222,128,0.15)':'#dcfce7'):(N?'rgba(245,158,11,0.15)':'#fef3c7'),color:v.status==='done'?(N?'#4ade80':'#16a34a'):(N?'#fbbf24':'#92400e')}}>
                {v.status==='done'?'Effectué':'Prévu'}
              </span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};


/* ════════════════ CHAT IA — API Anthropic ════════════════ */

const SYSTEM_PROMPT = `Tu es VacciBot, l'assistant IA expert en vaccination intégré à l'application VacciSmart.
Tu aides les parents et les médecins en Afrique francophone avec :
- Le calendrier vaccinal OMS et les calendriers nationaux
- Les effets secondaires des vaccins (fièvre, douleur, réactions allergiques)
- Les rappels et dates de vaccination
- Les conseils sur les allergies et contre-indications
- L'interprétation des carnets de vaccination
- Les centres de vaccination disponibles

Règles absolues :
- Réponds TOUJOURS en français, de façon claire, bienveillante et rassurante
- Ne remplace jamais un avis médical professionnel — redirige vers un médecin si nécessaire
- Sois précis et cite des données médicales fiables (OMS, calendriers nationaux)
- Utilise quelques emojis pour rendre la réponse lisible mais reste professionnel
- Garde tes réponses concises sauf si la question est complexe
- Adapte ton langage au niveau de compréhension d'un parent non-médecin`;

const SUGGESTIONS = [
  { icon: '🤒', text: 'Fièvre après vaccin ?' },
  { icon: '💉', text: 'Effets secondaires du ROR ?' },
  { icon: '📅', text: 'Calendrier vaccinal OMS ?' },
  { icon: '🧬', text: "C'est quoi le DTP ?" },
  { icon: '⚠️', text: 'Allergies et vaccins ?' },
  { icon: '👶', text: 'BCG pour nouveau-né ?' },
];

const TypingDots = ({ N }) => (
  <div style={{ display:'flex', alignItems:'flex-end', gap:10 }}>
    <div style={{ width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#1a7bca,#2196f3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,flexShrink:0 }}>🤖</div>
    <div style={{ padding:'13px 18px',borderRadius:'4px 18px 18px 18px',background:N?'rgba(10,24,60,0.95)':'#fff',border:`1px solid ${N?'rgba(100,180,255,0.14)':'rgba(26,123,202,0.1)'}`,display:'flex',gap:5,alignItems:'center' }}>
      {[0,0.2,0.4].map((d,i)=>(
        <div key={i} style={{ width:8,height:8,borderRadius:'50%',background:N?'#4da8f0':'#1a7bca',animation:`floatUp 1.1s ease-in-out infinite ${d}s` }}/>
      ))}
    </div>
  </div>
);

export const ChatPage = () => {
  const { isNight:N, user, selectedChild } = useApp();
  const child = CHILDREN[selectedChild];
  const userInitial = (user?.firstName || user?.name || 'U')[0].toUpperCase();

  const contextSystem = `${SYSTEM_PROMPT}

Contexte de la session :
- Utilisateur : ${user?.name || 'Parent'}
- Enfant suivi : ${child.firstName} ${child.lastName}, ${child.age}, né(e) le ${child.birthdate}
- Groupe sanguin : ${child.bloodType}
- Allergies connues : ${child.allergies}
- Vaccins effectués : ${child.vaccines.filter(v=>v.status==='done').map(v=>v.name).join(', ')}
- Vaccins à venir : ${child.vaccines.filter(v=>v.status==='upcoming').map(v=>`${v.name} le ${v.date}`).join(', ')}

Tiens compte de ce contexte pour personnaliser tes réponses.`;

  const [msgs,    setMsgs]    = useState([{
    role:'assistant',
    text:`👋 Bonjour ${user?.firstName || ''} ! Je suis **VacciBot**, votre assistant vaccinal IA.\n\nJe connais le dossier de **${child.firstName}** et je peux répondre à toutes vos questions sur les vaccins, les effets secondaires, le calendrier vaccinal et bien plus.\n\nComment puis-je vous aider ?`
  }]);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [history, setHistory] = useState([]); // API message history
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs]);

  const callAPI = async (userMsg) => {
    const newHistory = [...history, { role:'user', content: userMsg }];
    setHistory(newHistory);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: contextSystem,
        messages: newHistory,
      }),
    });

    if (!response.ok) throw new Error(`API error ${response.status}`);
    const data = await response.json();
    const reply = data.content?.find(b => b.type === 'text')?.text || "Je n'ai pas pu générer une réponse.";
    setHistory(h => [...h, { role:'assistant', content: reply }]);
    return reply;
  };

  const send = async (textOverride) => {
    const msg = (textOverride || input).trim();
    if (!msg || loading) return;
    setInput('');
    setError('');
    setMsgs(m => [...m, { role:'user', text: msg }]);
    setLoading(true);

    try {
      const reply = await callAPI(msg);
      setMsgs(m => [...m, { role:'assistant', text: reply }]);
    } catch(e) {
      setMsgs(m => [...m, { role:'assistant', text:"⚠️ Impossible de contacter le serveur IA. Vérifiez votre connexion et réessayez.", error:true }]);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Format text: bold **...**
  const formatText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={i}>{p.slice(2,-2)}</strong>
        : p
    );
  };

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', minHeight:0, overflow:'hidden' }}>

      {/* ── Header ── */}
      <div style={{ padding:'20px 32px 16px', borderBottom:`1px solid ${N?'rgba(100,180,255,0.08)':'rgba(26,123,202,0.08)'}`, display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:48,height:48,borderRadius:'50%',background:'linear-gradient(135deg,#1a7bca,#2196f3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,boxShadow:'0 4px 14px rgba(33,150,243,0.35)',position:'relative' }}>
            🤖
            <div style={{ position:'absolute',bottom:1,right:1,width:10,height:10,borderRadius:'50%',background:'#22c55e',border:'2px solid white' }}/>
          </div>
          <div>
            <p style={{ fontFamily:'var(--font-main)',fontWeight:800,fontSize:17,color:N?'#e2f0ff':'#1a3a5c',marginBottom:2 }}>VacciBot — Assistant IA</p>
            <p style={{ fontSize:12,color:'#22c55e',fontWeight:600 }}>● En ligne · Alimenté par Claude (Anthropic)</p>
          </div>
        </div>
        <div style={{ display:'flex',alignItems:'center',gap:8,padding:'8px 14px',borderRadius:12,background:N?'rgba(77,168,240,0.1)':'#edf6fc',border:`1px solid ${N?'rgba(100,180,255,0.2)':'rgba(26,123,202,0.12)'}` }}>
          <span style={{ fontSize:14 }}>{child.gender==='Fille'?'👧':'👦'}</span>
          <span style={{ fontSize:12,fontWeight:700,color:N?'#4da8f0':'#1a7bca' }}>{child.firstName}</span>
        </div>
      </div>

      {/* ── Messages ── */}
      <div style={{ flex:1,overflowY:'auto',padding:'24px 32px',display:'flex',flexDirection:'column',gap:16 }}>
        {msgs.map((m, i) => (
          <div key={i} className="fade-in" style={{ display:'flex', justifyContent:m.role==='user'?'flex-end':'flex-start', alignItems:'flex-end', gap:10 }}>
            {m.role==='assistant' && (
              <div style={{ width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#1a7bca,#2196f3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,flexShrink:0,boxShadow:'0 2px 8px rgba(33,150,243,0.25)' }}>🤖</div>
            )}
            <div style={{
              maxWidth:'68%', padding:'13px 17px', lineHeight:1.75, fontSize:14,
              borderRadius: m.role==='user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
              background: m.role==='user'
                ? 'linear-gradient(135deg,#1a7bca,#2196f3)'
                : (N?'rgba(10,24,60,0.95)':'#fff'),
              color: m.role==='user' ? '#fff' : (N?'#e2f0ff':'#1a3a5c'),
              border: m.role==='assistant' ? `1px solid ${N?'rgba(100,180,255,0.14)':'rgba(26,123,202,0.09)'}` : 'none',
              boxShadow: m.role==='user'
                ? '0 4px 14px rgba(33,150,243,0.35)'
                : (N?'0 2px 14px rgba(0,0,0,0.28)':'0 2px 14px rgba(26,90,138,0.07)'),
              whiteSpace:'pre-wrap',
              opacity: m.error ? 0.75 : 1,
            }}>
              {formatText(m.text)}
            </div>
            {m.role==='user' && (
              <div style={{ width:34,height:34,borderRadius:'50%',background:N?'rgba(77,168,240,0.2)':'#dbeafe',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:800,color:N?'#4da8f0':'#1a7bca',flexShrink:0,fontFamily:'var(--font-main)' }}>
                {userInitial}
              </div>
            )}
          </div>
        ))}
        {loading && <TypingDots N={N} />}
        <div ref={bottomRef} />
      </div>

      {/* ── Suggestions ── */}
      <div style={{ padding:'8px 32px', display:'flex', gap:8, overflowX:'auto', flexShrink:0, borderTop:`1px solid ${N?'rgba(100,180,255,0.07)':'rgba(26,123,202,0.07)'}` }}>
        {SUGGESTIONS.map((s, i) => (
          <button key={i} onClick={() => send(s.text)} disabled={loading} style={{ padding:'7px 14px',borderRadius:20,fontSize:12,fontWeight:600,border:`1px solid ${N?'rgba(100,180,255,0.22)':'rgba(26,123,202,0.18)'}`,background:N?'rgba(77,168,240,0.07)':'rgba(26,123,202,0.05)',color:N?'#4da8f0':'#1a7bca',cursor:loading?'not-allowed':'pointer',whiteSpace:'nowrap',fontFamily:'var(--font-main)',opacity:loading?0.5:1,display:'flex',alignItems:'center',gap:5,transition:'all .18s' }}>
            <span>{s.icon}</span>{s.text}
          </button>
        ))}
      </div>

      {/* ── Input ── */}
      <div style={{ padding:'12px 32px 20px', display:'flex', gap:10, alignItems:'flex-end', flexShrink:0, borderTop:`1px solid ${N?'rgba(100,180,255,0.07)':'rgba(26,123,202,0.07)'}` }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send(); } }}
          placeholder="Posez votre question à VacciBot... (Entrée pour envoyer)"
          rows={1}
          style={{ flex:1,padding:'12px 18px',borderRadius:20,fontSize:14,border:`1px solid ${N?'rgba(100,180,255,0.22)':'rgba(26,123,202,0.18)'}`,background:N?'rgba(255,255,255,0.06)':'#f0f7fd',color:'var(--t-primary)',outline:'none',fontFamily:'var(--font-body)',resize:'none',lineHeight:1.5,maxHeight:100,overflowY:'auto' }}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          style={{ width:46,height:46,borderRadius:'50%',border:'none',background: input.trim()&&!loading ? 'linear-gradient(135deg,#1a7bca,#2196f3)' : (N?'rgba(255,255,255,0.07)':'#e8f3fc'),color:input.trim()&&!loading?'#fff':'var(--t-muted)',fontSize:20,cursor:input.trim()&&!loading?'pointer':'not-allowed',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all .2s',boxShadow:input.trim()&&!loading?'0 4px 14px rgba(33,150,243,0.4)':'none' }}
        >
          {loading
            ? <div style={{ width:18,height:18,border:'2.5px solid rgba(255,255,255,0.3)',borderTopColor:input.trim()?'#fff':'var(--t-muted)',borderRadius:'50%',animation:'spin .7s linear infinite' }}/>
            : '➤'}
        </button>
      </div>
    </div>
  );
};

export const NotificationsPage = () => {
  const { isNight:N } = useApp();
  const notifs = [
    {emoji:'🔔',title:'Rappel vaccin ROR — Sophie',desc:'Demain à 10h00 · Hôpital Central',time:'Il y a 1h',type:'urgent'},
    {emoji:'✅',title:'Vaccin DTP 1 confirmé',desc:'Kofi · 15 Nov 2025 · Dr. Kamga',time:'Il y a 2 jours',type:'success'},
    {emoji:'💉',title:'Prochain vaccin dans 3 jours',desc:'Kofi · DTP 2 · 25 Jan 2026',time:'Il y a 3 jours',type:'info'},
    {emoji:'🤖',title:'Recommandation IA',desc:'Sophie approche de 18 mois — pensez au ROR 2ème dose',time:'Il y a 5 jours',type:'ai'},
    {emoji:'🏥',title:'Hôpital Central — Rappel',desc:'Confirmer le RDV du 25 Jan 2026',time:'Il y a 6 jours',type:'info'},
  ];
  const colors={urgent:{bg:N?'rgba(245,158,11,0.1)':'#fffbeb',border:N?'rgba(245,158,11,0.35)':'#fde68a',dot:'#f59e0b'},success:{bg:N?'rgba(34,197,94,0.08)':'#f0fdf4',border:N?'rgba(34,197,94,0.25)':'#bbf7d0',dot:'#22c55e'},info:{bg:N?'rgba(77,168,240,0.08)':'#f0f8ff',border:N?'rgba(100,180,255,0.2)':'#bfdbfe',dot:'#4da8f0'},ai:{bg:N?'rgba(139,92,246,0.08)':'#f5f3ff',border:N?'rgba(139,92,246,0.25)':'#ddd6fe',dot:'#8b5cf6'}};
  return (
    <div style={{flex:1,overflowY:'auto',padding:'32px 36px 40px'}}>
      <h1 style={{fontFamily:'var(--font-main)',fontWeight:900,fontSize:28,color:N?'#e2f0ff':'#1a3a5c',marginBottom:6}}>🔔 Notifications</h1>
      <p style={{fontSize:13,color:'var(--t-muted)',marginBottom:24}}>Rappels et alertes automatiques</p>
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {notifs.map((n,i)=>{const c=colors[n.type];return(
          <div key={i} style={{background:c.bg,border:`1px solid ${c.border}`,borderRadius:14,padding:'16px 18px',display:'flex',alignItems:'flex-start',gap:14}}>
            <div style={{width:42,height:42,borderRadius:12,background:`${c.dot}22`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>{n.emoji}</div>
            <div style={{flex:1}}>
              <p style={{fontFamily:'var(--font-main)',fontWeight:700,fontSize:14,color:N?'#e2f0ff':'#1a3a5c',marginBottom:3}}>{n.title}</p>
              <p style={{fontSize:12,color:'var(--t-muted)'}}>{n.desc}</p>
            </div>
            <span style={{fontSize:11,color:'var(--t-muted)',whiteSpace:'nowrap',flexShrink:0,marginTop:2}}>{n.time}</span>
            <div style={{width:8,height:8,borderRadius:'50%',background:c.dot,flexShrink:0,marginTop:4}}/>
          </div>
        );})}
      </div>
    </div>
  );
};

/* ════════════════ HOSPITALS ════════════════ */
export const HospitalsPage = () => {
  const { isNight:N } = useApp();
  return (
    <div style={{flex:1,overflowY:'auto',padding:'32px 36px 40px'}}>
      <h1 style={{fontFamily:'var(--font-main)',fontWeight:900,fontSize:28,color:N?'#e2f0ff':'#1a3a5c',marginBottom:6}}>🏥 Hôpitaux & centres</h1>
      <p style={{fontSize:13,color:'var(--t-muted)',marginBottom:24}}>Centres de vaccination proches de vous</p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        {HOSPITALS.map((h,i)=>(
          <Card key={i}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
              <div style={{fontSize:30}}>🏥</div>
              <span style={{fontSize:10,fontWeight:700,padding:'3px 10px',borderRadius:20,background:h.open?(N?'rgba(34,197,94,0.15)':'#dcfce7'):(N?'rgba(239,68,68,0.12)':'#fee2e2'),color:h.open?(N?'#4ade80':'#16a34a'):(N?'#f87171':'#dc2626')}}>
                {h.open?'● Ouvert':'● Fermé'}
              </span>
            </div>
            <p style={{fontFamily:'var(--font-main)',fontWeight:800,fontSize:15,color:N?'#e2f0ff':'#1a3a5c',marginBottom:4}}>{h.name}</p>
            <p style={{fontSize:12,color:'var(--t-muted)',marginBottom:4}}>📍 {h.address}</p>
            <p style={{fontSize:12,color:'var(--t-muted)',marginBottom:12}}>📏 {h.distance} · ⭐ {h.rating}</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {h.vaccines.map(v=><span key={v} style={{fontSize:10,fontWeight:600,padding:'2px 9px',borderRadius:20,background:N?'rgba(77,168,240,0.12)':'#e0f0fb',color:N?'#4da8f0':'#1a7bca'}}>{v}</span>)}
            </div>
            <button style={{marginTop:14,width:'100%',padding:'9px',borderRadius:10,border:'none',background:'linear-gradient(135deg,#1a7bca,#2196f3)',color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-main)'}}>📞 Prendre RDV</button>
          </Card>
        ))}
      </div>
    </div>
  );
};

/* ════════════════ PROFILE ════════════════ */
export const ProfilePage = () => {
  const { isNight:N, user, role, logout, toggleMode } = useApp();
  const row = {display:'flex',justifyContent:'space-between',alignItems:'center',padding:'11px 0'};
  const div = {borderBottom:`0.5px solid ${N?'rgba(100,180,255,0.08)':'rgba(26,123,202,0.07)'}`};
  const Toggle=({on})=><div style={{width:44,height:24,borderRadius:12,background:on?'linear-gradient(135deg,#1a7bca,#2196f3)':(N?'rgba(255,255,255,0.1)':'#e0f0fb'),position:'relative',cursor:'pointer',transition:'background .3s'}}><div style={{position:'absolute',top:3,left:on?23:3,width:18,height:18,borderRadius:'50%',background:'#fff',transition:'left .25s',boxShadow:'0 1px 5px rgba(0,0,0,0.2)'}}/></div>;
  return (
    <div style={{flex:1,overflowY:'auto',padding:'32px 36px 40px'}}>
      <h1 style={{fontFamily:'var(--font-main)',fontWeight:900,fontSize:28,color:N?'#e2f0ff':'#1a3a5c',marginBottom:24}}>👤 Mon profil</h1>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
        <div>
          <Card style={{marginBottom:16,textAlign:'center',paddingTop:28}}>
            <div style={{width:80,height:80,borderRadius:'50%',background:'linear-gradient(135deg,#1a7bca,#2196f3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:36,margin:'0 auto 14px',boxShadow:'0 6px 24px rgba(33,150,243,0.35)'}}>{role==='parent'?'👩':'👨‍⚕️'}</div>
            <p style={{fontFamily:'var(--font-main)',fontWeight:800,fontSize:19,color:N?'#e2f0ff':'#1a3a5c',marginBottom:6}}>{user?.name}</p>
            <span style={{fontSize:11,fontWeight:700,padding:'4px 14px',borderRadius:20,background:N?'rgba(77,168,240,0.14)':'#e0f0fb',color:N?'#4da8f0':'#1a7bca'}}>{role==='parent'?'👨‍👩‍👧 Parent':'🩺 Médecin'}</span>
          </Card>
          <Card>
            <p style={{fontFamily:'var(--font-main)',fontWeight:700,fontSize:13,color:N?'#4da8f0':'#1a7bca',marginBottom:10}}>ℹ️ Informations</p>
            {[['Email',user?.email],['Rôle',role==='parent'?'Parent / Tuteur':'Médecin'],['Membre depuis','Janvier 2025']].map(([k,v],i,arr)=>(
              <div key={k} style={{...row,...(i<arr.length-1?div:{})}}>
                <span style={{fontSize:12,color:'var(--t-muted)'}}>{k}</span>
                <span style={{fontSize:12,fontWeight:600,color:N?'#e2f0ff':'#1a3a5c'}}>{v}</span>
              </div>
            ))}
          </Card>
        </div>
        <div>
          <Card style={{marginBottom:16}}>
            <p style={{fontFamily:'var(--font-main)',fontWeight:700,fontSize:13,color:N?'#4da8f0':'#1a7bca',marginBottom:10}}>🔔 Notifications</p>
            {[['Rappels vaccins J-1',true],['Rappels mensuels',true],['Alertes retards',true],['Newsletter',false]].map(([l,on],i,arr)=>(
              <div key={l} style={{...row,...(i<arr.length-1?div:{})}}><span style={{fontSize:12,color:N?'#e2f0ff':'#1a3a5c'}}>{l}</span><Toggle on={on}/></div>
            ))}
          </Card>
          <Card>
            <p style={{fontFamily:'var(--font-main)',fontWeight:700,fontSize:13,color:N?'#4da8f0':'#1a7bca',marginBottom:10}}>🎨 Apparence</p>
            <div style={row}>
              <span style={{fontSize:12,color:N?'#e2f0ff':'#1a3a5c'}}>{N?'🌙 Mode nuit':'☀️ Mode jour'}</span>
              <button onClick={toggleMode} style={{padding:'7px 16px',borderRadius:20,border:`0.5px solid ${N?'rgba(100,180,255,0.3)':'#c0d8f0'}`,background:N?'rgba(77,168,240,0.1)':'#e0f0fb',color:N?'#4da8f0':'#1a7bca',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-main)'}}>Basculer</button>
            </div>
          </Card>
        </div>
      </div>
      <button onClick={logout} style={{marginTop:20,width:'100%',padding:'14px',borderRadius:16,border:`0.5px solid ${N?'rgba(239,68,68,0.25)':'#fca5a5'}`,background:N?'rgba(239,68,68,0.1)':'#fee2e2',color:N?'#f87171':'#dc2626',fontSize:14,fontWeight:800,cursor:'pointer',fontFamily:'var(--font-main)',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
        🚪 Se déconnecter
      </button>
    </div>
  );
};

/* ════════════════ DOCTOR UPCOMING ════════════════ */
const urgColor = (d,N) => d<=1?{bg:N?'rgba(239,68,68,0.12)':'#fee2e2',text:N?'#f87171':'#dc2626',border:N?'rgba(239,68,68,0.3)':'#fca5a5'}:d<=3?{bg:N?'rgba(245,158,11,0.1)':'#fef3c7',text:N?'#fbbf24':'#92400e',border:N?'rgba(245,158,11,0.3)':'#fde68a'}:{bg:N?'rgba(77,168,240,0.1)':'#e0f0fb',text:N?'#4da8f0':'#1a7bca',border:N?'rgba(100,180,255,0.2)':'#bfdbfe'};

export const DoctorUpcomingPage = () => {
  const { isNight:N, user } = useApp();
  const [search, setSearch] = useState('');
  const filtered = DOCTOR_PATIENTS.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())||p.vaccine.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{flex:1,overflowY:'auto',padding:'32px 36px 40px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24}}>
        <div>
          <h1 style={{fontFamily:'var(--font-main)',fontWeight:900,fontSize:28,color:N?'#e2f0ff':'#1a3a5c',marginBottom:6}}>💉 Vaccins à venir</h1>
          <p style={{fontSize:13,color:'var(--t-muted)'}}>{user?.name} · {user?.hospital||'Hôpital Central'}</p>
        </div>
      </div>
      <div style={{position:'relative',marginBottom:20}}>
        <span style={{position:'absolute',left:15,top:'50%',transform:'translateY(-50%)',fontSize:16}}>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher patient, vaccin..." style={{width:'100%',padding:'12px 16px 12px 44px',borderRadius:14,fontSize:13,border:`1px solid ${N?'rgba(100,180,255,0.2)':'#c0d8f0'}`,background:N?'rgba(255,255,255,0.06)':'#f0f7fd',color:'var(--t-primary)',outline:'none',fontFamily:'var(--font-body)'}}/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14,marginBottom:24}}>
        {[{l:'Demain',n:DOCTOR_PATIENTS.filter(p=>p.daysLeft<=1).length,c:'#ef4444'},{l:'≤ 3 jours',n:DOCTOR_PATIENTS.filter(p=>p.daysLeft<=3).length,c:'#f59e0b'},{l:'7 jours',n:DOCTOR_PATIENTS.length,c:N?'#4da8f0':'#1a7bca'}].map(s=>(
          <Card key={s.l} style={{textAlign:'center',padding:'16px 12px'}}>
            <p style={{fontFamily:'var(--font-main)',fontWeight:900,fontSize:26,color:s.c}}>{s.n}</p>
            <p style={{fontSize:11,color:'var(--t-muted)',marginTop:2}}>{s.l}</p>
          </Card>
        ))}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {filtered.map((p,i)=>{const u=urgColor(p.daysLeft,N);return(
          <div key={p.id} style={{background:N?'rgba(8,20,52,0.9)':'#fff',border:`1px solid ${u.border}`,borderRadius:16,padding:'16px 20px',boxShadow:N?'0 4px 20px rgba(0,0,0,0.28)':'0 4px 20px rgba(26,90,138,0.07)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:44,height:44,borderRadius:14,background:u.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>👶</div>
                <div>
                  <p style={{fontFamily:'var(--font-main)',fontWeight:800,fontSize:15,color:N?'#e2f0ff':'#1a3a5c',marginBottom:2}}>{p.name}</p>
                  <p style={{fontSize:11,color:'var(--t-muted)'}}>{p.age} · Parent : {p.parent}</p>
                </div>
              </div>
              <span style={{fontSize:11,fontWeight:800,padding:'4px 12px',borderRadius:20,background:u.bg,color:u.text,border:`0.5px solid ${u.border}`}}>{p.date}</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderRadius:12,background:N?'rgba(255,255,255,0.04)':'#f8fbff'}}>
              <span style={{fontSize:18}}>💉</span>
              <div style={{flex:1}}><p style={{fontFamily:'var(--font-main)',fontWeight:700,fontSize:13,color:N?'#e2f0ff':'#1a3a5c',marginBottom:1}}>{p.vaccine}</p><p style={{fontSize:11,color:'var(--t-muted)'}}>📞 {p.phone}</p></div>
              <span style={{fontSize:11,fontWeight:700,color:p.notified?(N?'#4ade80':'#16a34a'):'var(--t-muted)'}}>{p.notified?'✅ Notifié':'⏳ En attente'}</span>
            </div>
          </div>
        );})}
      </div>
    </div>
  );
};

/* ════════════════ DOCTOR REMINDERS ════════════════ */
export const DoctorRemindersPage = () => {
  const { isNight:N } = useApp();
  const notified = DOCTOR_PATIENTS.filter(p=>p.notified);
  const pending  = DOCTOR_PATIENTS.filter(p=>!p.notified);
  const PCard=({p,type})=>{const colors={sent:{bg:N?'rgba(34,197,94,0.06)':'#f0fdf4',border:N?'rgba(34,197,94,0.2)':'#bbf7d0'},pending:{bg:N?'rgba(245,158,11,0.06)':'#fffbeb',border:N?'rgba(245,158,11,0.22)':'#fde68a'}};const c=colors[type];return(
    <div style={{background:c.bg,border:`0.5px solid ${c.border}`,borderRadius:14,padding:'14px 18px',marginBottom:10,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <div><p style={{fontFamily:'var(--font-main)',fontWeight:700,fontSize:13,color:N?'#e2f0ff':'#1a3a5c',marginBottom:3}}>{p.name}</p><p style={{fontSize:11,color:'var(--t-muted)',marginBottom:2}}>💉 {p.vaccine} · {p.date}</p><p style={{fontSize:11,color:'var(--t-muted)'}}>📞 {p.phone}</p></div>
      <div style={{textAlign:'center'}}><div style={{fontSize:22}}>{type==='sent'?'✅':'⏰'}</div><p style={{fontSize:10,color:type==='sent'?(N?'#4ade80':'#16a34a'):(N?'#fbbf24':'#92400e'),fontWeight:800,marginTop:2}}>{type==='sent'?'Envoyé':'Programmé'}</p></div>
    </div>
  );};
  return (
    <div style={{flex:1,overflowY:'auto',padding:'32px 36px 40px'}}>
      <h1 style={{fontFamily:'var(--font-main)',fontWeight:900,fontSize:28,color:N?'#e2f0ff':'#1a3a5c',marginBottom:6}}>🔔 Rappels patients</h1>
      <p style={{fontSize:13,color:'var(--t-muted)',marginBottom:24}}>Notifications push J-1 automatiques</p>
      <Card style={{marginBottom:20,background:N?'rgba(0,184,163,0.08)':'#ecfdf5',border:`0.5px solid ${N?'rgba(0,229,196,0.2)':'#a7f3d0'}`,display:'flex',alignItems:'center',gap:16}}>
        <div style={{fontSize:36}}>📢</div>
        <div><p style={{fontFamily:'var(--font-main)',fontWeight:800,fontSize:15,color:N?'#00e5c4':'#065f46',marginBottom:3}}>{notified.length} rappels envoyés aujourd'hui</p><p style={{fontSize:12,color:N?'#00c4a0':'#047857',lineHeight:1.6}}>Notifications push 24h avant chaque RDV · Automatique même si l'app est fermée</p></div>
      </Card>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
        <div><p style={{fontFamily:'var(--font-main)',fontWeight:800,fontSize:13,color:N?'#4ade80':'#16a34a',marginBottom:12}}>✅ Envoyés ({notified.length})</p>{notified.map(p=><PCard key={p.id} p={p} type="sent"/>)}</div>
        <div><p style={{fontFamily:'var(--font-main)',fontWeight:800,fontSize:13,color:N?'#fbbf24':'#92400e',marginBottom:12}}>⏳ Programmés ({pending.length})</p>{pending.map(p=><PCard key={p.id} p={p} type="pending"/>)}</div>
      </div>
    </div>
  );
};
