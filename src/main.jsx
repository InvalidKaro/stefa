import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

const css = `
:root{color-scheme:dark;--bg:#08090b;--panel:#101217;--text:#f4f5f7;--muted:#8d939d;--dim:#5f6570;--line:rgba(255,255,255,.1);--accent:#79e7ff;--accent-rgb:121,231,255;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:var(--bg);color:var(--text)}
:root[data-accent="violet"]{--accent:#b895ff;--accent-rgb:184,149,255}
:root[data-accent="lime"]{--accent:#b7f26a;--accent-rgb:183,242,106}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;min-width:320px;background:var(--bg);overflow-x:hidden}button,input{font:inherit}button{color:inherit}button:focus-visible,input:focus-visible{outline:2px solid var(--accent);outline-offset:3px}::selection{background:rgba(var(--accent-rgb),.25)}
.app{min-height:100vh;background:radial-gradient(circle at 12% 3%,rgba(var(--accent-rgb),.06),transparent 32rem),linear-gradient(180deg,#08090b,#090a0d 55%,#07080a)}
.header{width:min(1180px,calc(100% - 40px));height:72px;margin:auto;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line);position:relative;z-index:20}
.brand{display:flex;align-items:center;gap:11px;background:0;border:0;padding:0;cursor:pointer}.mark{width:35px;height:35px;border:1px solid rgba(255,255,255,.16);border-radius:9px;display:grid;place-items:center;font:11px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:-.08em;background:linear-gradient(145deg,rgba(255,255,255,.06),rgba(255,255,255,.01))}.brand strong{font-size:12px;letter-spacing:.14em}.brand small{display:block;color:var(--muted);font:9px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;margin-top:2px}
.nav{position:absolute;left:50%;transform:translateX(-50%);display:flex;gap:30px}.nav button,.ghost{background:0;border:0;color:var(--muted);font-size:12px;cursor:pointer}.nav button:hover{color:var(--text)}
.actions{display:flex;gap:8px}.cmd,.icon{height:36px;border:1px solid var(--line);border-radius:9px;background:rgba(255,255,255,.025);display:flex;align-items:center;gap:8px;cursor:pointer}.cmd{padding:0 8px 0 11px;color:var(--muted);font-size:11px}.cmd kbd{border:1px solid var(--line);padding:3px 6px;border-radius:5px;color:var(--dim);font:10px ui-monospace,monospace}.icon{width:36px;justify-content:center}.icon:hover,.cmd:hover{border-color:rgba(255,255,255,.18);background:rgba(255,255,255,.05)}
.hero{--px:76%;--py:38%;width:min(1180px,calc(100% - 40px));min-height:630px;margin:auto;display:grid;grid-template-columns:minmax(0,.94fr) minmax(430px,1.06fr);gap:64px;align-items:center;position:relative;isolation:isolate}.hero:before{content:"";position:absolute;inset:0;z-index:-2;background:radial-gradient(420px circle at var(--px) var(--py),rgba(var(--accent-rgb),.11),transparent 62%)}.gridfx{position:absolute;inset:18% -20vw 0 45%;z-index:-3;opacity:.25;background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);background-size:38px 38px;transform:perspective(700px) rotateX(64deg) rotateZ(-8deg) translateY(130px);mask-image:linear-gradient(to right,transparent,black 20%,black 80%,transparent)}
.eyebrow{display:flex;align-items:center;gap:14px;margin-bottom:24px}.status{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--line);border-radius:999px;padding:7px 9px;color:#c8ccd1;background:rgba(255,255,255,.025);font:10px ui-monospace,monospace}.dot{width:6px;height:6px;border-radius:50%;background:#87e8ad;box-shadow:0 0 0 4px rgba(135,232,173,.08)}.eyebrow>span:last-child{color:var(--dim);font:10px ui-monospace,monospace}
h1{margin:0;font-size:clamp(56px,7vw,96px);line-height:.86;letter-spacing:-.075em;font-weight:600}h1 span{display:block}.outline{color:transparent;-webkit-text-stroke:1px rgba(255,255,255,.42)}.lede{max-width:520px;color:var(--muted);line-height:1.7;font-size:15px;margin:30px 0 0}.heroBtns{display:flex;gap:10px;flex-wrap:wrap;margin-top:34px}.primary,.secondary,.diag{min-height:44px;border-radius:10px;padding:0 15px;display:inline-flex;align-items:center;gap:9px;justify-content:center;cursor:pointer;transition:.18s ease}.primary{border:1px solid var(--accent);background:var(--accent);color:#05080a;font-weight:650;font-size:12px}.secondary,.diag{border:1px solid var(--line);background:rgba(255,255,255,.025);color:#c0c5ca;font-size:12px}.primary:hover,.secondary:hover,.diag:hover{transform:translateY(-1px)}
.console{width:100%;aspect-ratio:1.08;max-height:540px;border:1px solid rgba(255,255,255,.16);border-radius:20px;overflow:hidden;background:linear-gradient(145deg,rgba(16,18,22,.94),rgba(8,9,11,.9));box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 28px 70px rgba(0,0,0,.32)}.bar,.foot{height:47px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;color:var(--dim);font:9px ui-monospace,monospace;letter-spacing:.06em}.bar{border-bottom:1px solid var(--line)}.foot{border-top:1px solid var(--line)}.live{color:var(--accent)}.stage{height:calc(100% - 94px);display:grid;place-items:center;position:relative;overflow:hidden;background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);background-size:26px 26px}.stage:after{content:"";position:absolute;inset:0;background:radial-gradient(circle,rgba(var(--accent-rgb),.13),transparent 42%)}.orb{width:58%;aspect-ratio:1;position:relative;z-index:2;display:grid;place-items:center}.ring{position:absolute;border:1px solid rgba(255,255,255,.13);border-radius:50%}.r1{inset:0;border-style:dashed;animation:spin 18s linear infinite}.r2{inset:15%;transform:rotate(36deg) scaleY(.7);border-color:rgba(var(--accent-rgb),.26);animation:spin2 10s linear infinite}.r3{inset:28%;border-style:dashed}.core{width:29%;aspect-ratio:1;border-radius:50%;border:1px solid rgba(var(--accent-rgb),.45);background:radial-gradient(circle at 34% 30%,rgba(255,255,255,.16),rgba(var(--accent-rgb),.08) 42%,rgba(0,0,0,.18));display:grid;place-items:center;color:var(--accent);font:13px ui-monospace,monospace;box-shadow:0 0 70px rgba(var(--accent-rgb),.1)}.read{position:absolute;z-index:4;font:8px ui-monospace,monospace;color:var(--dim);letter-spacing:.08em}.read b{display:block;color:#d3d6db;font-size:11px;margin-top:4px;font-weight:400}.a{left:8%;top:18%}.b{right:7%;top:24%;text-align:right}.c{right:11%;bottom:18%;text-align:right}
.ticker{height:46px;border-block:1px solid var(--line);overflow:hidden;display:flex;align-items:center}.ticker div{white-space:nowrap;min-width:max-content;color:var(--dim);font:9px ui-monospace,monospace;letter-spacing:.13em;animation:marquee 24s linear infinite}.ticker span{color:var(--accent);margin:0 18px}
.section{width:min(1180px,calc(100% - 40px));margin:auto;padding:112px 0;scroll-margin-top:18px}.heading{display:grid;grid-template-columns:1.05fr .7fr;gap:60px;align-items:end;margin-bottom:44px}.index{font:9px ui-monospace,monospace;color:var(--dim);letter-spacing:.12em}.heading h2,.protocol h2{margin:12px 0 0;font-size:clamp(36px,5vw,64px);line-height:.96;letter-spacing:-.055em;font-weight:500}.heading p,.protocol p{margin:0;color:var(--muted);line-height:1.7;font-size:14px}
.bento{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:12px}.card{border:1px solid var(--line);border-radius:18px;background:rgba(255,255,255,.018);padding:22px;position:relative;overflow:hidden;min-height:230px}.card:before{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(135deg,rgba(255,255,255,.025),transparent 42%)}.telemetry{grid-column:span 7;min-height:330px}.mode{grid-column:span 5;display:flex;flex-direction:column;justify-content:space-between}.accent{grid-column:span 4}.principle{grid-column:span 8}.kicker{font:9px ui-monospace,monospace;color:var(--dim);letter-spacing:.1em}.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:48px}.metric small{display:block;color:var(--muted);font-size:10px}.metric strong{display:block;margin-top:12px;font-size:clamp(22px,2.3vw,29px);letter-spacing:-.045em;font-weight:500}.metric em{display:block;margin-top:5px;color:#87e8ad;font:9px ui-monospace,monospace;font-style:normal}.bars{height:84px;display:flex;align-items:end;gap:5px;margin-top:30px}.bars i{flex:1;background:linear-gradient(to top,rgba(var(--accent-rgb),.1),rgba(var(--accent-rgb),.6));border-top:1px solid rgba(var(--accent-rgb),.7);border-radius:2px 2px 0 0}
.mode strong,.accent strong{font-size:27px;letter-spacing:-.04em;font-weight:500}.mode p,.accent p{color:var(--muted);font-size:12px;line-height:1.55;max-width:270px}.switch{width:96px;height:42px;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,.02);padding:4px 10px 4px 4px;display:flex;align-items:center;justify-content:space-between;color:var(--dim);font:9px ui-monospace,monospace;cursor:pointer}.switch span{width:32px;height:32px;border-radius:50%;background:#2b2e34;transition:.25s}.switch.on{color:var(--accent)}.switch.on span{transform:translateX(50px);background:var(--accent)}.orbBtn{width:105px;height:105px;border:0;background:0;padding:0;cursor:pointer;margin:36px 0 22px}.orbBtn span{display:block;width:100%;height:100%;border-radius:50%;border:1px solid rgba(var(--accent-rgb),.5);background:radial-gradient(circle at 32% 28%,rgba(255,255,255,.35),rgba(var(--accent-rgb),.72) 10%,rgba(var(--accent-rgb),.18) 45%,rgba(var(--accent-rgb),.03) 68%,transparent 70%);box-shadow:0 0 34px rgba(var(--accent-rgb),.12)}.principle{display:grid;grid-template-columns:auto 1fr auto;gap:28px;align-items:center}.principle .num{align-self:stretch;border-right:1px solid var(--line);padding-right:18px;color:var(--accent);font:10px ui-monospace,monospace}.principle h3{margin:10px 0 8px;font-size:27px;letter-spacing:-.04em;font-weight:500}.principle p{margin:0;color:var(--muted);font-size:12px;line-height:1.6}.checks{display:grid;gap:9px;color:var(--muted);font:9px ui-monospace,monospace}
.sysHead{grid-template-columns:1fr auto}.shell{border:1px solid var(--line);border-radius:20px;overflow:hidden}.tabs{height:51px;border-bottom:1px solid var(--line);display:flex;align-items:stretch;padding:0 14px}.tabs button{border:0;background:0;color:var(--dim);padding:0 13px;text-transform:uppercase;font:9px ui-monospace,monospace;letter-spacing:.1em;position:relative;cursor:pointer}.tabs button.on{color:var(--text)}.tabs button.on:after{content:"";position:absolute;left:12px;right:12px;bottom:-1px;height:1px;background:var(--accent)}.system{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(300px,.55fr);min-height:510px}.mesh{position:relative;min-height:510px;overflow:hidden;border-right:1px solid var(--line);background-image:radial-gradient(circle at 50% 50%,rgba(var(--accent-rgb),.06),transparent 34%),linear-gradient(rgba(255,255,255,.024) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.024) 1px,transparent 1px);background-size:auto,28px 28px,28px 28px}.mesh svg{position:absolute;inset:0;width:100%;height:100%}.mesh line{stroke:rgba(255,255,255,.13);stroke-width:.18;vector-effect:non-scaling-stroke;stroke-dasharray:3 3}.node{position:absolute;transform:translate(-50%,-50%);width:72px;min-height:58px;border:0;background:0;display:grid;place-items:center;cursor:pointer}.node i{width:12px;height:12px;border-radius:50%;background:#9ca3ad;border:3px solid #1a1c20;box-shadow:0 0 0 1px rgba(255,255,255,.2);transition:.2s}.node small{margin-top:5px;color:var(--dim);font:8px ui-monospace,monospace}.node.on i,.node.coreN i{background:var(--accent);box-shadow:0 0 0 1px rgba(var(--accent-rgb),.4),0 0 24px rgba(var(--accent-rgb),.35);transform:scale(1.15)}.inspect{padding:26px;display:flex;flex-direction:column}.inspectTop{display:flex;justify-content:space-between;color:var(--dim);font:8px ui-monospace,monospace}.inspect h3{margin:55px 0 0;color:var(--accent);font:12px ui-monospace,monospace;letter-spacing:.08em}.value{display:block;margin-top:14px;font-size:42px;letter-spacing:-.06em;font-weight:500}.inspect p{color:var(--muted);font-size:12px;line-height:1.6}.levels{display:grid;gap:7px;margin-top:28px}.levels span{height:3px;background:rgba(255,255,255,.055);overflow:hidden;border-radius:9px}.levels i{display:block;height:100%;background:linear-gradient(90deg,rgba(var(--accent-rgb),.35),var(--accent));transition:width .3s}.log{margin-top:auto;border-top:1px solid var(--line);padding-top:18px;color:var(--dim);font:9px/1.8 ui-monospace,monospace}.log b{color:#87e8ad;font-weight:400}
.protocol{display:grid;grid-template-columns:1fr .85fr;gap:110px;align-items:center;border-top:1px solid var(--line)}.protocol p{margin-top:23px}.rows{border-top:1px solid var(--line)}.row{min-height:68px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line);gap:20px;color:var(--muted);font-size:11px}.row strong{color:#c6cad0;font:10px ui-monospace,monospace;font-weight:400}.footer{width:min(1180px,calc(100% - 40px));min-height:110px;margin:auto;border-top:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;color:var(--dim);font:9px ui-monospace,monospace}
.backdrop{position:fixed;inset:0;z-index:100;background:rgba(4,5,7,.68);backdrop-filter:blur(12px);display:flex;justify-content:center;align-items:flex-start;padding:min(16vh,130px) 18px 40px}.palette{width:min(560px,100%);border:1px solid rgba(255,255,255,.17);border-radius:16px;background:rgba(14,16,20,.97);box-shadow:0 30px 100px rgba(0,0,0,.5);overflow:hidden}.search{height:58px;display:flex;align-items:center;gap:11px;padding:0 14px;border-bottom:1px solid var(--line)}.search input{flex:1;min-width:0;background:0;border:0;outline:0;color:var(--text);font-size:13px}.search button{width:32px;height:32px;border:0;border-radius:7px;background:rgba(255,255,255,.04);color:var(--muted);cursor:pointer}.list{padding:8px}.list button{width:100%;min-height:48px;border:0;border-radius:9px;background:0;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:10px;text-align:left;padding:0 10px;cursor:pointer}.list button:hover{background:rgba(255,255,255,.045)}.list b{color:var(--accent);font-size:12px}.list span{font-size:11px}.list small{color:var(--dim);font:8px ui-monospace,monospace}
@keyframes spin{to{transform:rotate(360deg)}}@keyframes spin2{from{transform:rotate(36deg) scaleY(.7)}to{transform:rotate(396deg) scaleY(.7)}}@keyframes marquee{to{transform:translateX(-50%)}}
@media(max-width:980px){.hero{grid-template-columns:1fr;gap:0;padding:50px 0 70px}.console{max-width:700px;justify-self:center;aspect-ratio:1.45}.telemetry{grid-column:span 12}.mode{grid-column:span 6}.accent{grid-column:span 6}.principle{grid-column:span 12}.system{grid-template-columns:1fr}.mesh{border-right:0;border-bottom:1px solid var(--line);min-height:430px}.inspect{min-height:340px}.protocol{gap:60px}}
@media(max-width:720px){.header,.hero,.section,.footer{width:min(100% - 28px,1180px)}.nav,.cmd{display:none}.hero{min-height:auto;padding-top:36px}.console{aspect-ratio:1}.read{display:none}.heading{grid-template-columns:1fr;gap:22px}.metrics{grid-template-columns:1fr}.telemetry{min-height:540px}.mode,.accent,.principle{grid-column:span 12}.principle{grid-template-columns:1fr}.principle .num{display:none}.system{min-height:0}.mesh{min-height:360px}.protocol{grid-template-columns:1fr;gap:50px}.footer{padding:26px 0;flex-direction:column;align-items:flex-start;justify-content:center}}
@media(max-width:480px){.brand div:last-child{display:none}.heroBtns{display:grid}.primary,.secondary{width:100%}.sysHead{grid-template-columns:1fr}.diag{width:100%}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
`;

const style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);

const accents = ['cyan','violet','lime'];
const accentNames = {cyan:'Signal cyan',violet:'Ultraviolet',lime:'Acid lime'};
const nodes = [
  {id:'core',label:'CORE',x:50,y:49,value:'12.4 ms',note:'Primary orchestration layer'},
  {id:'edge',label:'EDGE',x:22,y:25,value:'18 POPs',note:'Distributed delivery mesh'},
  {id:'relay',label:'RELAY',x:80,y:28,value:'99.98%',note:'Encrypted message transport'},
  {id:'vault',label:'VAULT',x:76,y:75,value:'AES-256',note:'Secure state boundary'},
  {id:'sensor',label:'SENSOR',x:23,y:76,value:'42 Hz',note:'Live signal sampling'}
];

function App(){
  const heroRef=useRef(null);
  const [accent,setAccent]=useState(0);
  const [palette,setPalette]=useState(false);
  const [query,setQuery]=useState('');
  const [ambient,setAmbient]=useState(true);
  const [metrics,setMetrics]=useState({load:34,latency:12.4,packets:98.7});
  const [node,setNode]=useState('core');
  const [tab,setTab]=useState('pulse');
  const [diag,setDiag]=useState(0);

  useEffect(()=>{document.documentElement.dataset.accent=accents[accent]},[accent]);
  useEffect(()=>{
    const key=e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setPalette(v=>!v)}if(e.key==='Escape')setPalette(false)};
    window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)
  },[]);
  useEffect(()=>{
    const id=setInterval(()=>setMetrics(m=>({
      load:Math.max(18,Math.min(72,m.load+Math.round((Math.random()-.5)*10))),
      latency:Math.max(8.4,Math.min(19.8,+(m.latency+(Math.random()-.5)*1.6).toFixed(1))),
      packets:Math.max(97.9,Math.min(99.9,+(m.packets+(Math.random()-.5)*.2).toFixed(1)))
    })),1800);return()=>clearInterval(id)
  },[]);

  const current=nodes.find(n=>n.id===node)||nodes[0];
  const commands=[
    ['overview','Jump to overview','Section'],
    ['system','Open system map','Section'],
    ['protocol','Inspect protocol','Section'],
    ['diagnostic','Run diagnostic','Action'],
    ['accent','Cycle signal color','Appearance']
  ];
  const filtered=useMemo(()=>commands.filter(c=>c[1].toLowerCase().includes(query.toLowerCase())),[query]);
  const go=id=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
  const run=id=>{if(['overview','system','protocol'].includes(id))go(id);if(id==='diagnostic'){setDiag(v=>v+1);go('system')}if(id==='accent')setAccent(v=>(v+1)%3);setPalette(false);setQuery('')};

  return <div className="app">
    <header className="header">
      <button className="brand" onClick={()=>go('top')}><span className="mark">IV</span><div><strong>INVALID</strong><small>INTERFACE / 01</small></div></button>
      <nav className="nav">{[['Overview','overview'],['System','system'],['Protocol','protocol']].map(([l,id])=><button key={id} onClick={()=>go(id)}>{l}</button>)}</nav>
      <div className="actions"><button className="cmd" onClick={()=>setPalette(true)}>⌕ <span>Command</span><kbd>⌘K</kbd></button><button className="icon" onClick={()=>setAccent(v=>(v+1)%3)} title={accentNames[accents[accent]]}>✦</button></div>
    </header>

    <main id="top">
      <section className="hero" ref={heroRef} onPointerMove={e=>{const r=heroRef.current.getBoundingClientRect();heroRef.current.style.setProperty('--px',(e.clientX-r.left)+'px');heroRef.current.style.setProperty('--py',(e.clientY-r.top)+'px')}}>
        <div className="gridfx"/>
        <div>
          <div className="eyebrow"><span className="status"><i className="dot"/>All systems nominal</span><span>BER / NODE 049</span></div>
          <h1><span>CONTROL THE</span><span className="outline">SIGNAL.</span></h1>
          <p className="lede">A compact interactive control surface for systems that should feel alive — precise, responsive, and deliberately engineered.</p>
          <div className="heroBtns"><button className="primary" onClick={()=>go('overview')}>Enter interface ↘</button><button className="secondary" onClick={()=>setPalette(true)}>⌘ Open command layer</button></div>
        </div>
        <div className="console">
          <div className="bar"><span>● ● ●</span><span>invalid://live-surface</span><span className="live">● LIVE</span></div>
          <div className="stage">
            <div className="orb"><div className="ring r1"/><div className="ring r2"/><div className="ring r3"/><div className="core">IV</div></div>
            <div className="read a">LATENCY<b>{metrics.latency}ms</b></div><div className="read b">UPLINK<b>{metrics.packets}%</b></div><div className="read c">LOAD<b>{metrics.load}%</b></div>
          </div>
          <div className="foot"><span>◉ STREAM ACTIVE</span><span>256 BIT / SECURE</span></div>
        </div>
      </section>

      <div className="ticker"><div>REACTIVE UI <span>•</span> MOTION LAYER <span>•</span> ACCESSIBLE INPUT <span>•</span> RESPONSIVE GRID <span>•</span> LIVE STATE <span>•</span> REACTIVE UI <span>•</span> MOTION LAYER <span>•</span> ACCESSIBLE INPUT</div></div>

      <section id="overview" className="section">
        <div className="heading"><div><span className="index">01 / OVERVIEW</span><h2>Signal, without the noise.</h2></div><p>Every interaction has a reason. Motion confirms state, hierarchy stays readable, and the interface remains useful on touch, keyboard, or mouse.</p></div>
        <div className="bento">
          <article className="card telemetry"><span className="kicker">LIVE TELEMETRY</span><div className="metrics">
            <div className="metric"><small>Compute load</small><strong>{metrics.load}%</strong><em>↗ 4.2%</em></div>
            <div className="metric"><small>Signal latency</small><strong>{metrics.latency}ms</strong><em>↘ 1.8%</em></div>
            <div className="metric"><small>Packet integrity</small><strong>{metrics.packets}%</strong><em>↗ 0.3%</em></div>
          </div><div className="bars">{[32,46,40,64,53,68,58,76,72,88,82,94].map((h,i)=><i key={i} style={{height:h+'%'}}/>)}</div></article>
          <article className="card mode"><span className="kicker">AMBIENT LAYER</span><div><strong>{ambient?'Dynamic':'Quiet'}</strong><p>{ambient?'Environmental response is enabled.':'Background motion is manually reduced.'}</p></div><button className={'switch '+(ambient?'on':'')} onClick={()=>setAmbient(v=>!v)}><span/>{ambient?'ON':'OFF'}</button></article>
          <article className="card accent"><span className="kicker">SIGNAL COLOR</span><button className="orbBtn" onClick={()=>setAccent(v=>(v+1)%3)}><span/></button><strong>{accentNames[accents[accent]]}</strong><p>Tap to cycle the interaction layer.</p></article>
          <article className="card principle"><div className="num">02</div><div><span className="kicker">DESIGN PRINCIPLE</span><h3>Less decoration. More response.</h3><p>Depth comes from state, spacing, type, and movement — not a pile of glowing cards.</p></div><div className="checks"><span>✓ keyboard aware</span><span>✓ reduced motion</span><span>✓ touch first</span></div></article>
        </div>
      </section>

      <section id="system" className="section">
        <div className="heading sysHead"><div><span className="index">02 / SYSTEM</span><h2>Interactive mesh.</h2></div><button className="diag" onClick={()=>setDiag(v=>v+1)}>▶ Run diagnostic</button></div>
        <div className="shell">
          <div className="tabs">{['pulse','network','build'].map(t=><button key={t} className={tab===t?'on':''} onClick={()=>setTab(t)}>{t}</button>)}</div>
          <div className="system">
            <div className="mesh">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{nodes.filter(n=>n.id!=='core').map(n=><line key={n.id} x1="50" y1="49" x2={n.x} y2={n.y}/>)}</svg>
              {nodes.map(n=><button key={n.id} className={'node '+(node===n.id?'on ':'')+(n.id==='core'?'coreN':'')} style={{left:n.x+'%',top:n.y+'%'}} onClick={()=>setNode(n.id)} aria-label={'Inspect '+n.label}><i/><small>{n.label}</small></button>)}
            </div>
            <aside className="inspect"><div className="inspectTop"><span>SELECTED NODE</span><span style={{color:'#87e8ad'}}>● live</span></div><h3>{current.label}</h3><strong className="value">{current.value}</strong><p>{current.note}</p><div className="levels"><span><i style={{width:(tab==='pulse'?84:tab==='network'?68:91)+'%'}}/></span><span><i style={{width:(tab==='pulse'?62:tab==='network'?89:73)+'%'}}/></span><span><i style={{width:(tab==='pulse'?91:tab==='network'?75:82)+'%'}}/></span></div><div className="log">&gt; handshake --node {current.id}<br/>&gt; status <b>accepted</b>{diag>0&&<><br/>&gt; diagnostic #{diag} <b>clean</b></>}</div></aside>
          </div>
        </div>
      </section>

      <section id="protocol" className="section protocol">
        <div><span className="index">03 / PROTOCOL</span><h2>Built to feel immediate.</h2><p>Keyboard shortcuts, tactile controls, persistent selection, readable contrast, and an interface that still makes sense when animation is switched off.</p><button className="secondary" style={{marginTop:24}} onClick={()=>setPalette(true)}>Explore commands →</button></div>
        <div className="rows"><div className="row"><span>Response</span><strong>&lt; 100 ms</strong></div><div className="row"><span>Input model</span><strong>Pointer + keys</strong></div><div className="row"><span>Motion</span><strong>State-driven</strong></div><div className="row"><span>Layout</span><strong>Fluid grid</strong></div></div>
      </section>
    </main>

    <footer className="footer"><span>INVALID / INTERFACE</span><span>Built as a live React surface.</span></footer>

    {palette&&<div className="backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setPalette(false)}}><div className="palette" role="dialog" aria-modal="true" aria-label="Command palette"><div className="search"><span>⌕</span><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Type a command…"/><button onClick={()=>setPalette(false)}>×</button></div><div className="list">{filtered.length?filtered.map(([id,label,hint])=><button key={id} onClick={()=>run(id)}><b>⌁</b><span>{label}</span><small>{hint}</small></button>):<div style={{padding:40,textAlign:'center',color:'var(--dim)',fontSize:11}}>No matching command.</div>}</div></div></div>}
  </div>
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
