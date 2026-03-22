import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';

const Stars = () => {
  const { isNight } = useApp();
  const stars   = useMemo(() => Array.from({length:80},(_,i)=>({ id:i, size:Math.random()*2.4+.7, top:Math.random()*100, left:Math.random()*100, dur:1.4+Math.random()*3.8, delay:-(Math.random()*6) })),[]);
  const shoots  = useMemo(() => Array.from({length:6}, (_,i)=>({ id:i, w:50+Math.random()*100, top:Math.random()*60, left:Math.random()*55, dur:3+Math.random()*5, delay:-(Math.random()*9) })),[]);
  const dots    = useMemo(() => Array.from({length:35},(_,i)=>({ id:i, size:Math.random()*5+2, top:Math.random()*100, left:Math.random()*100 })),[]);

  return (
    <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
      {dots.map(d=>(
        <div key={`d${d.id}`} style={{position:'absolute',width:d.size,height:d.size,borderRadius:'50%',background:'var(--dot-bg)',top:`${d.top}%`,left:`${d.left}%`,opacity:isNight?0:1,transition:'opacity .6s'}}/>
      ))}
      {stars.map(s=>(
        <div key={`s${s.id}`} style={{position:'absolute',width:s.size,height:s.size,borderRadius:'50%',background:'#c0d8f0',top:`${s.top}%`,left:`${s.left}%`,opacity:isNight?undefined:0,transition:'opacity .6s',animation:isNight?`twinkle ${s.dur}s ease-in-out infinite ${s.delay}s`:'none'}}/>
      ))}
      {isNight&&shoots.map(s=>(
        <div key={`sh${s.id}`} style={{position:'absolute',width:s.w,height:1.5,borderRadius:2,background:'linear-gradient(90deg,transparent,#a0c8e8)',top:`${s.top}%`,left:`${s.left}%`,animation:`shoot ${s.dur}s linear infinite ${s.delay}s`}}/>
      ))}
    </div>
  );
};
export default Stars;
