// ============================================================
//   ZIM XMD ULTIMATE — Web Server & Pairing Page
//   By Malvin C | Zimbabwe 🇿🇼
// ============================================================

const express    = require("express");
const http       = require("http");
const { Server } = require("socket.io");
const path       = require("path");
const QRCode     = require("qrcode");
const config     = require("../config");

const app    = express();
const server = http.createServer(app);
const io     = new Server(server);

app.use(express.json());

// ── Serve static files from /public ─────────────────────────
app.use(express.static(path.join(__dirname, "../public")));

// ── HOME PAGE — served from public/index.html ─────────────────
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});


// ── PAIR PAGE ─────────────────────────────────────────────────
// ── PAIR PAGE ─────────────────────────────────────────────────
app.get("/pair", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Pair Bot — ZIM XMD ULTIMATE 🚀</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap" rel="stylesheet"/>
<script src="/socket.io/socket.io.js"><\/script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --p:#9b59b6;--pk:#e91e8c;--dark:#07070f;
  --glass:rgba(255,255,255,.04);
  --border:rgba(155,89,182,.25);
  --glow:0 0 30px rgba(155,89,182,.5),0 0 60px rgba(155,89,182,.2)
}
html{scroll-behavior:smooth}
body{
  background:var(--dark);color:#fff;
  font-family:'Rajdhani',sans-serif;
  min-height:100vh;overflow-x:hidden;
  background-image:
    radial-gradient(ellipse 80% 60% at 20% 10%,rgba(155,89,182,.18) 0%,transparent 60%),
    radial-gradient(ellipse 60% 50% at 80% 90%,rgba(233,30,140,.12) 0%,transparent 55%)
}
canvas#bg{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:.5}

/* NAV */
nav{
  position:sticky;top:0;z-index:100;
  display:flex;align-items:center;justify-content:space-between;
  padding:16px 24px;
  background:rgba(7,7,15,.85);backdrop-filter:blur(20px);
  border-bottom:1px solid rgba(155,89,182,.2)
}
.nav-logo{
  font-family:'Orbitron',sans-serif;font-size:.95rem;font-weight:900;
  background:linear-gradient(135deg,#9b59b6,#e91e8c);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent
}
.nav-back{color:rgba(255,255,255,.4);text-decoration:none;font-size:.82rem;font-weight:600;letter-spacing:1px;transition:color .3s}
.nav-back:hover{color:var(--p)}

/* HERO */
.hero{
  position:relative;z-index:1;
  text-align:center;padding:52px 20px 36px
}
.live-badge{
  display:inline-flex;align-items:center;gap:8px;
  background:rgba(155,89,182,.1);border:1px solid rgba(155,89,182,.3);
  border-radius:50px;padding:7px 20px;font-size:.75rem;
  letter-spacing:2px;color:#c39bd3;margin-bottom:22px
}
.ldot{width:8px;height:8px;border-radius:50%;background:#555;transition:background .5s}
.ldot.on{background:#00ff88;box-shadow:0 0 8px #00ff88;animation:lp 1.5s infinite}
@keyframes lp{0%,100%{box-shadow:0 0 0 0 rgba(0,255,136,.5)}50%{box-shadow:0 0 0 7px rgba(0,255,136,0)}}
.hero h1{
  font-family:'Orbitron',sans-serif;
  font-size:clamp(2rem,7vw,3.5rem);font-weight:900;
  background:linear-gradient(135deg,#9b59b6,#e91e8c,#9b59b6);
  background-size:200% auto;
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  animation:shine 3s linear infinite;margin-bottom:10px
}
@keyframes shine{to{background-position:200% center}}
.hero p{color:rgba(255,255,255,.45);font-size:.88rem;letter-spacing:2px}

/* METHOD BUTTONS */
.method-row{
  display:flex;gap:14px;justify-content:center;
  padding:0 20px 36px;position:relative;z-index:1;flex-wrap:wrap
}
.meth-btn{
  flex:1;max-width:200px;min-width:140px;
  padding:15px 20px;border-radius:14px;border:none;
  font-family:'Orbitron',sans-serif;font-size:.78rem;font-weight:700;
  letter-spacing:1px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;gap:8px;
  transition:all .3s;position:relative;overflow:hidden
}
.meth-btn.active{
  background:linear-gradient(135deg,#9b59b6,#e91e8c);
  color:#fff;box-shadow:0 6px 28px rgba(155,89,182,.5)
}
.meth-btn.inactive{
  background:rgba(255,255,255,.04);
  color:rgba(255,255,255,.4);
  border:1px solid rgba(255,255,255,.1)
}
.meth-btn.inactive:hover{
  background:rgba(155,89,182,.1);
  color:#c39bd3;border-color:rgba(155,89,182,.4)
}

/* PANELS */
.panel{display:none;position:relative;z-index:1;padding:0 20px 48px;max-width:480px;margin:0 auto}
.panel.show{display:block}

/* CARD */
.card{
  background:rgba(255,255,255,.03);
  border:1px solid rgba(155,89,182,.22);
  border-radius:22px;padding:30px 26px;
  backdrop-filter:blur(14px)
}

/* PAIR PANEL */
.pair-icon{font-size:3rem;margin-bottom:16px;display:block;text-align:center}
.card-title{
  font-family:'Orbitron',sans-serif;font-size:1.1rem;font-weight:700;
  background:linear-gradient(135deg,#9b59b6,#e91e8c);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  text-align:center;margin-bottom:8px
}
.card-sub{color:rgba(255,255,255,.4);font-size:.82rem;text-align:center;margin-bottom:24px;letter-spacing:.5px}

/* STEPS */
.steps{margin-bottom:22px;display:flex;flex-direction:column;gap:8px}
.step{
  display:flex;align-items:flex-start;gap:10px;
  padding:10px 14px;
  background:rgba(155,89,182,.06);
  border:1px solid rgba(155,89,182,.12);
  border-radius:10px;font-size:.85rem;
  color:rgba(255,255,255,.7);line-height:1.5
}
.sn{
  min-width:22px;height:22px;border-radius:50%;
  background:linear-gradient(135deg,#9b59b6,#e91e8c);
  color:#fff;font-size:.7rem;font-weight:700;
  display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px
}

/* INPUT */
.inp-wrap{position:relative;margin-bottom:14px}
.inp-ico{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:1rem;pointer-events:none}
input[type=tel]{
  width:100%;padding:14px 14px 14px 42px;
  background:rgba(255,255,255,.05);
  border:1.5px solid rgba(155,89,182,.3);border-radius:13px;
  color:#fff;font-family:'Rajdhani',sans-serif;font-size:1rem;
  outline:none;transition:all .3s;letter-spacing:.5px
}
input[type=tel]:focus{border-color:var(--p);background:rgba(155,89,182,.08);box-shadow:0 0 0 3px rgba(155,89,182,.12)}
input::placeholder{color:rgba(255,255,255,.22)}

/* ACTION BTN */
.action-btn{
  width:100%;padding:14px;border-radius:13px;border:none;
  background:linear-gradient(135deg,#9b59b6,#e91e8c);
  color:#fff;font-family:'Orbitron',sans-serif;font-size:.85rem;font-weight:700;
  letter-spacing:1.5px;cursor:pointer;
  box-shadow:0 4px 22px rgba(155,89,182,.4);
  transition:all .3s;display:flex;align-items:center;justify-content:center;gap:8px
}
.action-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 32px rgba(155,89,182,.6)}
.action-btn:disabled{opacity:.4;cursor:not-allowed;transform:none}

/* CODE DISPLAY */
.code-box{
  display:none;margin-top:20px;
  background:rgba(0,0,0,.5);border:1px solid rgba(155,89,182,.4);
  border-radius:16px;padding:22px 16px;text-align:center
}
.code-lbl{font-size:.7rem;letter-spacing:3px;color:rgba(255,255,255,.3);margin-bottom:16px}
.code-chars{display:flex;justify-content:center;align-items:center;gap:5px;flex-wrap:wrap}
.cc{
  width:40px;height:50px;border-radius:10px;
  background:rgba(155,89,182,.15);border:1px solid rgba(155,89,182,.45);
  display:flex;align-items:center;justify-content:center;
  font-family:'Orbitron',sans-serif;font-size:1.25rem;font-weight:700;color:#d7bde2;
  box-shadow:0 0 10px rgba(155,89,182,.25);
  animation:pop .3s ease both
}
.csep{color:rgba(155,89,182,.35);font-size:1.4rem;margin:0 2px}
@keyframes pop{0%{transform:scale(0);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
.copy-btn{
  margin-top:14px;padding:8px 22px;border-radius:8px;
  background:rgba(155,89,182,.2);border:1px solid rgba(155,89,182,.4);
  color:#c39bd3;font-family:'Rajdhani',sans-serif;font-size:.88rem;font-weight:600;
  cursor:pointer;transition:all .3s;letter-spacing:.5px
}
.copy-btn:hover{background:rgba(155,89,182,.35);color:#fff}
.timer-txt{font-size:.72rem;color:rgba(255,255,255,.25);margin-top:10px}
.cd{color:var(--pk);font-weight:700}

/* QR PANEL */
.qr-wrap{display:flex;flex-direction:column;align-items:center;gap:16px;padding:8px 0 4px}
.qr-frame{
  width:220px;height:220px;
  background:#fff;border-radius:18px;
  display:flex;align-items:center;justify-content:center;
  padding:10px;position:relative;
  box-shadow:0 0 50px rgba(155,89,182,.35),0 0 100px rgba(155,89,182,.1)
}
.qr-frame img{width:100%;height:100%;object-fit:contain;display:none;border-radius:6px}
.qr-ov{
  position:absolute;inset:0;border-radius:18px;
  background:rgba(7,7,15,.9);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:10px;font-size:.82rem;color:rgba(255,255,255,.45)
}
.qr-hint{font-size:.78rem;color:rgba(255,255,255,.3);text-align:center;letter-spacing:.5px;max-width:240px}
.refresh-btn{
  margin-top:4px;padding:10px 24px;border-radius:10px;
  background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);
  color:rgba(255,255,255,.5);font-family:'Rajdhani',sans-serif;
  font-size:.88rem;font-weight:600;cursor:pointer;transition:all .3s;letter-spacing:.5px
}
.refresh-btn:hover{background:rgba(155,89,182,.15);color:#c39bd3;border-color:rgba(155,89,182,.35)}

/* STATUS */
.status{
  display:none;padding:11px 14px;border-radius:10px;
  font-size:.85rem;margin-top:14px;text-align:center;line-height:1.5
}
.status.loading{background:rgba(155,89,182,.08);border:1px solid rgba(155,89,182,.25);color:#c39bd3}
.status.success{background:rgba(0,255,136,.05);border:1px solid rgba(0,255,136,.25);color:#00e87a}
.status.error{background:rgba(255,70,70,.05);border:1px solid rgba(255,70,70,.25);color:#ff7070}

/* SPINNER */
.spin{display:inline-block;width:15px;height:15px;border:2px solid rgba(155,89,182,.3);border-top-color:var(--p);border-radius:50%;animation:rot 1s linear infinite;vertical-align:middle;margin-right:6px}
@keyframes rot{to{transform:rotate(360deg)}}

/* OTHER BOTS */
.bots-section{position:relative;z-index:1;max-width:480px;margin:0 auto;padding:0 20px 52px}
.sec-lbl{
  font-family:'Orbitron',sans-serif;font-size:.7rem;letter-spacing:3px;
  color:rgba(255,255,255,.25);text-align:center;margin-bottom:18px;
  display:flex;align-items:center;gap:12px
}
.sec-lbl::before,.sec-lbl::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(155,89,182,.2),transparent)}
.bots-grid{display:flex;flex-direction:column;gap:10px}
.bot-card{
  display:flex;align-items:center;gap:14px;
  padding:15px 18px;border-radius:15px;
  background:rgba(255,255,255,.03);border:1px solid rgba(155,89,182,.18);
  text-decoration:none;color:#fff;transition:all .3s
}
.bot-card:hover{border-color:rgba(155,89,182,.5);transform:translateX(4px);box-shadow:0 4px 20px rgba(155,89,182,.2)}
.bot-card.wa:hover{border-color:#25D366;box-shadow:0 4px 20px rgba(37,211,102,.15)}
.ba{
  width:42px;height:42px;border-radius:11px;
  display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0
}
.ba.pu{background:linear-gradient(135deg,#9b59b6,#6c3483)}
.ba.pi{background:linear-gradient(135deg,#e91e8c,#9b59b6)}
.ba.gr{background:linear-gradient(135deg,#25D366,#128C7E)}
.bn{font-family:'Orbitron',sans-serif;font-size:.75rem;font-weight:700;color:#d7bde2;letter-spacing:.5px}
.bu{font-size:.7rem;color:rgba(255,255,255,.28);margin-top:2px}
.barrow{margin-left:auto;color:rgba(155,89,182,.4);font-size:1.1rem;flex-shrink:0;transition:color .3s}
.bot-card:hover .barrow{color:var(--p)}
.bot-card.wa:hover .barrow{color:#25D366}

footer{
  text-align:center;padding:26px 20px;
  border-top:1px solid rgba(155,89,182,.1);
  color:rgba(255,255,255,.25);font-size:.8rem;
  position:relative;z-index:1
}
footer a{color:var(--p);text-decoration:none}
</style>
</head>
<body>
<canvas id="bg"></canvas>

<!-- NAV -->
<nav>
  <div class="nav-logo">⚡ ZIM XMD ULTIMATE</div>
  <a href="/" class="nav-back">← HOME</a>
  <span>🇿🇼</span>
</nav>

<!-- HERO -->
<div class="hero">
  <div class="live-badge">
    <span class="ldot" id="ldot"></span>
    <span id="ltext">CONNECTING…</span>
  </div>
  <h1>PAIR YOUR BOT</h1>
  <p>CHOOSE A METHOD BELOW · BY MALVIN C 🇿🇼</p>
</div>

<!-- METHOD TOGGLE BUTTONS -->
<div class="method-row">
  <button class="meth-btn active" id="btn-pair" onclick="showPanel('pair')">
    🔗 PAIRING CODE
  </button>
  <button class="meth-btn inactive" id="btn-qr" onclick="showPanel('qr')">
    📷 QR CODE
  </button>
</div>

<!-- PAIR PANEL -->
<div class="panel show" id="panel-pair">
  <div class="card">
    <span class="pair-icon">🔗</span>
    <div class="card-title">PAIR YOUR BOT</div>
    <div class="card-sub">Enter your WhatsApp number with country code.<br/>Example: <strong>2637XXXXXXXX</strong></div>

    <div class="steps">
      <div class="step"><span class="sn">1</span>Open WhatsApp → Settings → Linked Devices → Link a Device</div>
      <div class="step"><span class="sn">2</span>Tap <b>"Link with phone number instead"</b></div>
      <div class="step"><span class="sn">3</span>Enter your number below &amp; tap <b>Get Pairing Code</b></div>
      <div class="step"><span class="sn">4</span>Type the 8-digit code shown in WhatsApp</div>
    </div>

    <div class="inp-wrap">
      <span class="inp-ico">📞</span>
      <input type="tel" id="phone" placeholder="2637XXXXXXXX" maxlength="15" onkeydown="if(event.key==='Enter')getCode()"/>
    </div>

    <button class="action-btn" id="code-btn" onclick="getCode()">GET PAIRING CODE</button>

    <div class="code-box" id="code-box">
      <div class="code-lbl">ENTER THIS CODE IN WHATSAPP</div>
      <div class="code-chars" id="code-chars"></div>
      <button class="copy-btn" id="copy-btn" onclick="copyCode()">📋 Copy Code</button>
      <div class="timer-txt">Expires in <span class="cd" id="cd">60</span>s</div>
    </div>

    <div class="status" id="st-pair"></div>
  </div>
</div>

<!-- QR PANEL -->
<div class="panel" id="panel-qr">
  <div class="card">
    <span class="pair-icon">📷</span>
    <div class="card-title">SCAN QR CODE</div>
    <div class="card-sub">Open WhatsApp → Linked Devices → Link a Device<br/>then scan the QR code below</div>

    <div class="qr-wrap">
      <div class="qr-frame" id="qr-frame">
        <div class="qr-ov" id="qr-ov">
          <span class="spin"></span>
          <span>Waiting for QR…</span>
        </div>
        <img id="qr-img" src="" alt="QR"/>
      </div>
      <div class="qr-hint">QR refreshes automatically · scan quickly before it expires</div>
      <button class="refresh-btn" onclick="reqQR()">🔄 Refresh QR</button>
    </div>

    <div class="status" id="st-qr"></div>
  </div>
</div>

<!-- OTHER BOTS -->
<div class="bots-section">
  <div class="sec-lbl">OTHER BOTS BY MALVIN C</div>
  <div class="bots-grid">

    <a href="https://malvin-c-server3.onrender.com" target="_blank" class="bot-card">
      <div class="ba pu">🤖</div>
      <div>
        <div class="bn">MALVIN C VME</div>
        <div class="bu">malvin-c-server3.onrender.com</div>
      </div>
      <span class="barrow">›</span>
    </a>

    <a href="https://malvin-c-file.onrender.com" target="_blank" class="bot-card">
      <div class="ba pi">⚡</div>
      <div>
        <div class="bn">MALVIN TAKEIT MD</div>
        <div class="bu">malvin-c-file.onrender.com</div>
      </div>
      <span class="barrow">›</span>
    </a>

    <a href="${config.waChannel}" target="_blank" class="bot-card wa">
      <div class="ba gr">📺</div>
      <div>
        <div class="bn">WHATSAPP CHANNEL</div>
        <div class="bu">whatsapp.com/channel/…</div>
      </div>
      <span class="barrow">›</span>
    </a>

  </div>
</div>

<footer>
  🇿🇼 <strong>ZIM XMD ULTIMATE</strong> — Made with ❤️ by <a href="https://github.com/malvinc/zim-xmd" target="_blank">Malvin C</a> ·
  <a href="/">← Home</a>
</footer>

<script>
// ── Canvas particles ──────────────────────────────────────────
const cv = document.getElementById('bg');
const cx = cv.getContext('2d');
let W, H, pts = [];
function rsz(){ W = cv.width = innerWidth; H = cv.height = innerHeight; }
rsz(); window.addEventListener('resize', rsz);
class Pt {
  constructor(){ this.rst(); }
  rst(){ this.x=Math.random()*W; this.y=Math.random()*H; this.r=Math.random()*1.5+.3; this.a=Math.random()*.6+.1; this.vy=-(Math.random()*.4+.05); this.vx=(Math.random()-.5)*.2; }
  tick(){ this.x+=this.vx; this.y+=this.vy; this.a-=.0015; if(this.a<=0||this.y<-5)this.rst(); }
  draw(){ cx.beginPath(); cx.arc(this.x,this.y,this.r,0,Math.PI*2); cx.fillStyle='rgba(155,89,182,'+this.a+')'; cx.fill(); }
}
for(let i=0;i<100;i++) pts.push(new Pt());
(function loop(){ cx.clearRect(0,0,W,H); pts.forEach(p=>{p.tick();p.draw();}); requestAnimationFrame(loop); })();

// ── Panel toggle ──────────────────────────────────────────────
function showPanel(id) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('show'));
  document.querySelectorAll('.meth-btn').forEach(b => { b.className='meth-btn inactive'; });
  document.getElementById('panel-' + id).classList.add('show');
  document.getElementById('btn-' + id).className = 'meth-btn active';
  if (id === 'qr') reqQR();
}

// ── Socket.IO ─────────────────────────────────────────────────
const socket = io();
let cdTimer, curCode = '';

socket.on('connect', () => setLive(false, 'SERVER CONNECTED'));
socket.on('disconnect', () => setLive(false, 'OFFLINE ⚠️'));
socket.on('connected', () => {
  setLive(true, 'BOT ONLINE ✅');
  showSt('st-pair', '🎉 Bot connected! Enjoy ZIM XMD ULTIMATE!', 'success');
  showSt('st-qr',   '🎉 Bot connected! Enjoy ZIM XMD ULTIMATE!', 'success');
});
socket.on('qr', async data => {
  try {
    const r = await fetch('/api/qr-img?data=' + encodeURIComponent(data));
    const blob = await r.blob();
    const img = document.getElementById('qr-img');
    img.src = URL.createObjectURL(blob);
    img.style.display = 'block';
    document.getElementById('qr-ov').style.display = 'none';
    showSt('st-qr', '📷 QR ready — scan now before it expires!', 'success');
  } catch { showSt('st-qr', '❌ QR render failed. Tap Refresh QR.', 'error'); }
});

function setLive(on, txt) {
  document.getElementById('ldot').className = 'ldot' + (on ? ' on' : '');
  document.getElementById('ltext').textContent = txt;
}

// ── QR ────────────────────────────────────────────────────────
function reqQR() {
  const img = document.getElementById('qr-img');
  img.style.display = 'none';
  document.getElementById('qr-ov').style.display = 'flex';
  socket.emit('request-qr');
  showSt('st-qr', '⏳ Requesting QR from bot…', 'loading');
}

// ── Pairing Code ──────────────────────────────────────────────
async function getCode() {
  const phone = document.getElementById('phone').value.replace(/[^0-9]/g,'');
  if (phone.length < 7) return showSt('st-pair', '❌ Enter a valid number with country code e.g. 263771234567', 'error');
  const btn = document.getElementById('code-btn');
  btn.disabled = true; btn.innerHTML = '<span class="spin"></span> GENERATING…';
  document.getElementById('code-box').style.display = 'none';
  showSt('st-pair', '⏳ Requesting code from WhatsApp…', 'loading');
  try {
    const r = await fetch('/api/pair?phone=' + encodeURIComponent(phone));
    const d = await r.json();
    if (d.code) {
      curCode = d.code.replace(/-/g,'');
      renderCode(curCode);
      showSt('st-pair', '✅ Code ready! Open WhatsApp → Linked Devices → Link with phone number → enter code.', 'success');
      startCD(60);
    } else {
      showSt('st-pair', '❌ ' + (d.error||'Failed — make sure bot is running.'), 'error');
    }
  } catch { showSt('st-pair', '❌ Cannot reach server. Is the bot deployed on Render?', 'error'); }
  btn.disabled = false; btn.innerHTML = 'GET PAIRING CODE';
}

function renderCode(c) {
  const box = document.getElementById('code-chars');
  box.innerHTML = '';
  c = c.replace(/[^A-Z0-9]/gi,'').toUpperCase();
  c.split('').forEach((ch, i) => {
    if (i === 4) { const s = document.createElement('span'); s.className='csep'; s.textContent='-'; box.appendChild(s); }
    const el = document.createElement('div'); el.className='cc';
    el.style.animationDelay=(i*.05)+'s'; el.textContent=ch;
    box.appendChild(el);
  });
  document.getElementById('code-box').style.display = 'block';
}

function copyCode() {
  navigator.clipboard.writeText(curCode).then(() => {
    const b = document.getElementById('copy-btn');
    b.textContent = '✅ Copied!';
    setTimeout(() => b.textContent = '📋 Copy Code', 2000);
  });
}

function startCD(s) {
  clearInterval(cdTimer);
  const el = document.getElementById('cd');
  let t = s; el.textContent = t;
  cdTimer = setInterval(() => { t--; el.textContent=t; if(t<=0){clearInterval(cdTimer);el.textContent='Expired';} }, 1000);
}

function showSt(id, msg, type) {
  const el = document.getElementById(id);
  el.innerHTML = msg; el.className = 'status ' + type; el.style.display = 'block';
}
<\/script>
</body>
</html>`);
});

// ── API: Generate Pairing Code ────────────────────────────────
app.get("/api/pair", async (req, res) => {
  const phone = (req.query.phone || "").replace(/[^0-9]/g, "");
  if (!phone) return res.json({ error: "Phone number is required." });

  // The sock must exist and NOT be authenticated yet, OR we call requestPairingCode on an existing connection
  if (!global._sock) {
    return res.json({ error: "Bot socket not ready. Wait a few seconds after server starts." });
  }

  try {
    const code = await global._sock.requestPairingCode(phone);
    return res.json({ code });
  } catch (e) {
    return res.json({ error: e.message || "Failed to generate pairing code." });
  }
});

// ── API: Render QR as PNG ─────────────────────────────────────
app.get("/api/qr-img", async (req, res) => {
  const data = req.query.data;
  if (!data) return res.status(400).send("Missing data");
  try {
    const buf = await QRCode.toBuffer(decodeURIComponent(data), {
      width: 280,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    });
    res.set("Content-Type", "image/png");
    res.set("Cache-Control", "no-cache");
    res.send(buf);
  } catch (e) {
    res.status(500).send("QR generation failed: " + e.message);
  }
});

// ── Socket.IO ─────────────────────────────────────────────────
io.on("connection", (socket) => {
  // Send current QR immediately if one exists
  socket.on("request-qr", () => {
    if (global._currentQR) {
      socket.emit("qr", global._currentQR);
    }
  });
});

// Expose io globally so index.js can broadcast
global._io = io;

// ── Start server ──────────────────────────────────────────────
const PORT = config.port || 3000;
server.listen(PORT, () => {
  console.log("[ZIM XMD] Web server → http://localhost:" + PORT);
  console.log("[ZIM XMD] Pair page  → http://localhost:" + PORT + "/pair");
});

module.exports = { app, server, io };
               
