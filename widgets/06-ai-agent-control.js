// Smart Guardian - AI Predictions & Agent Actions
// Advanced developer mode -> Web Component tab -> delete everything -> paste this
import { fetch as c8yFetch } from 'fetch';

const DEV = {
  water: 'WATER_LEVEL_DEVICE_ID', soil: 'SOIL_MOISTURE_DEVICE_ID', mosquito: 'MOSQUITO_DEVICE_ID', trap: 'ANIMAL_TRAP_DEVICE_ID',
  permitOk: 'PERMIT_AUTHORIZED_DEVICE_ID', permitDeny: 'PERMIT_UNAUTHORIZED_DEVICE_ID', door: 'DOOR_SENSOR_DEVICE_ID', camera: 'CAMERA_DEVICE_ID', tamper: 'TAMPER_SENSOR_DEVICE_ID'
};
const ALL_DEVICES = ['WATER_LEVEL_DEVICE_ID', 'SOIL_MOISTURE_DEVICE_ID', 'MOSQUITO_DEVICE_ID', 'ANIMAL_TRAP_DEVICE_ID', 'PERMIT_AUTHORIZED_DEVICE_ID', 'PERMIT_UNAUTHORIZED_DEVICE_ID', 'DOOR_SENSOR_DEVICE_ID', 'CAMERA_DEVICE_ID', 'TAMPER_SENSOR_DEVICE_ID'];

// Forecast models: fragment + series of each sensor, the limit that matters and its direction.
const MODELS = [
  { key: 'water', name: 'Water Level', device: 'WATER_LEVEL_DEVICE_ID', frag: 'WaterLevel', series: 'waterLevel', unit: '%', limit: 30, dir: 'below', zone: 'Lagoon reservoir' },
  { key: 'soil', name: 'Soil Moisture', device: 'SOIL_MOISTURE_DEVICE_ID', frag: 'soilMoisture', series: 'moisture', unit: '%', limit: 30, dir: 'below', zone: 'Nursery' },
  { key: 'mosquito', name: 'Mosquito Activity', device: 'MOSQUITO_DEVICE_ID', frag: 'Mosquito', series: 'Activity', unit: '', limit: 8, dir: 'above', zone: 'Northeast zone' }
];
const HISTORY_H = 12;
const HORIZON_H = 24;
const REFRESH_MS = 60000;
const ACTION_TYPE = 'c8y_AgentAction';
// Device commands the agent sends through Cumulocity Operations after a guardian approves.
const COMMANDS = {
  refill:   { name: 'Start reservoir refill pump', text: 'START_REFILL_PUMP' },
  irrigate: { name: 'Start nursery irrigation (20 min)', text: 'START_IRRIGATION 20' },
  spray:    { name: 'Activate mosquito misting – Northeast zone', text: 'ACTIVATE_MISTING NE' },
  trap:     { name: 'Put trap in service mode', text: 'TRAP_SERVICE_MODE ON' }
};
const OP_TYPE = 'application/vnd.com.nsn.cumulocity.operation+json';

const TEMPLATE = `
<div class="aip" data-sg-anchor="ai-predictions">
  <div class="aip-hero">
    <div class="aip-hero-text">
      <p class="aip-kicker"><svg viewBox="0 0 24 24"><path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z"/></svg>Agentic AI</p>
      <h2 class="aip-title">AI Agent Control</h2>
      <p class="aip-tagline">Predict · Approve · Act on devices</p>
      <p class="aip-brief" data-brief>The agent is analysing live sensor data…</p>
      <p class="aip-brief-ar" dir="rtl" lang="ar">الوكيل الذكي يتنبأ بالمشكلة، ويقترح الإجراء، وبعد موافقتك يتحكم بالجهاز</p>
    </div>
    <div class="aip-risk" data-risk>
      <div class="aip-gauge"><svg viewBox="0 0 120 70"><path class="aip-gauge-bg" d="M10 62a50 50 0 0 1 100 0"/><path class="aip-gauge-fg" data-gauge d="M10 62a50 50 0 0 1 100 0"/></svg>
        <strong data-risk-value>–</strong></div>
      <p class="aip-risk-label">Island risk score</p>
      <p class="aip-risk-level" data-risk-level>–</p>
    </div>
  </div>

  <div class="aip-body">
    <div class="aip-head"><h3>Forecasts <small>next 24 hours · trend model on live readings</small></h3>
      <button class="aip-run" data-run>Run agent now</button></div>
    <div class="aip-forecasts" data-forecasts></div>

    <div class="aip-grid">
      <div class="aip-panel">
        <h3>Anomaly detection <small>compared with each sensor's normal pattern</small></h3>
        <ul class="aip-list" data-anomalies><li class="aip-empty">Checking…</li></ul>
      </div>
      <div class="aip-panel">
        <h3>Agent actions <small>approve and the agent sends the command to the device</small></h3>
        <ul class="aip-list" data-actions><li class="aip-empty">Checking…</li></ul>
        <h4 class="aip-log-title">Agent activity log</h4>
        <ul class="aip-log" data-log><li class="aip-empty">No actions yet</li></ul>
      </div>
    </div>
    <p class="aip-foot" data-foot></p>
  </div>
  <div class="aip-toast" data-toast></div>
</div>

<style>
.aip{--fg:#1d4e5b;--muted:#5b7f82;--border:#dde8ea;--card:#fffffd;--surface:#f6f9f9;--gold:#f3d48a;
  --good:#17804b;--warn:#c2410c;--bad:#d94c4c;--line:#00809e;
  position:relative;font-family:"DM Sans","Segoe UI",Helvetica,Arial,sans-serif;color:var(--fg);line-height:1.5;
  background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden}
.aip *{box-sizing:border-box}
:where(.aip) :where(h2,h3,h4,p,ul){margin:0;padding:0}
:where(.aip) ul{list-style:none}
:where(.aip) button{font:inherit;cursor:pointer}
.aip-hero{position:relative;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:18px;padding:24px 28px;color:#fff;
  background:linear-gradient(120deg,#123f4a,#1d5a63,#0f3a44)}
.aip-hero::after{content:"";position:absolute;right:-120px;top:-160px;width:380px;height:380px;border-radius:50%;
  background:radial-gradient(circle,rgba(243,212,138,.22),transparent 70%);pointer-events:none}
.aip-hero-text{position:relative;z-index:1;max-width:760px}
.aip-kicker{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--gold)}
.aip-kicker svg{width:14px;height:14px;fill:currentColor}
.aip-title{margin-top:6px;font-size:28px;font-weight:800;letter-spacing:-.01em}
.aip-tagline{margin-top:2px;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#bfe7e2}
.aip-brief{margin-top:8px;font-size:15px;color:#e3f2f1}
.aip-brief b{color:#fff}
.aip-brief-ar{margin-top:4px;font-size:14px;color:var(--gold);font-weight:600;font-family:"Segoe UI",Tahoma,sans-serif;text-align:left}
.aip-risk{position:relative;z-index:1;text-align:center;min-width:170px;padding:12px 16px;border-radius:14px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2)}
.aip-gauge{position:relative;width:130px;margin:0 auto}
.aip-gauge svg{display:block;width:100%;overflow:visible}
.aip-gauge-bg{fill:none;stroke:rgba(255,255,255,.2);stroke-width:12;stroke-linecap:round}
.aip-gauge-fg{fill:none;stroke:var(--gold);stroke-width:12;stroke-linecap:round;stroke-dasharray:157;stroke-dashoffset:157;transition:stroke-dashoffset 1.2s ease,stroke .4s}
.aip-risk.is-low .aip-gauge-fg{stroke:#4ade80}.aip-risk.is-mid .aip-gauge-fg{stroke:var(--gold)}.aip-risk.is-high .aip-gauge-fg{stroke:#f87171}
.aip-gauge strong{position:absolute;left:0;right:0;bottom:0;font-size:28px;font-weight:800}
.aip-risk-label{margin-top:4px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#bfe7e2}
.aip-risk-level{font-size:14px;font-weight:800}

.aip-body{padding:20px 28px 22px}
.aip-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px}
.aip h3{font-size:16px;font-weight:800}
.aip h3 small{font-size:12px;font-weight:600;color:var(--muted);margin-left:6px}
.aip-run{padding:8px 14px;border-radius:10px;border:0;background:var(--fg);color:#fff;font-size:13px;font-weight:800;box-shadow:0 3px 0 rgba(0,0,0,.18);transition:transform .15s}
.aip-run:hover{transform:translateY(-2px)}
.aip-run:active{transform:translateY(1px)}

.aip-forecasts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.aip-fc{padding:14px 16px;border:1px solid var(--border);border-radius:14px;background:var(--card);box-shadow:0 2px 12px rgba(20,45,60,.06);animation:aipIn .5s ease both}
@keyframes aipIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.aip-fc-top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
.aip-fc-name{font-size:14px;font-weight:800}
.aip-fc-zone{font-size:11.5px;color:var(--muted)}
.aip-pill{flex:none;padding:3px 9px;border-radius:99px;font-size:11px;font-weight:800}
.aip-pill.is-good{background:#e7f5ed;color:var(--good)}.aip-pill.is-warn{background:#fff1e6;color:var(--warn)}.aip-pill.is-bad{background:#fdecec;color:var(--bad)}.aip-pill.is-none{background:#eef3f4;color:var(--muted)}
.aip-fc-nums{display:flex;gap:18px;margin-top:8px}
.aip-fc-nums div{font-size:11.5px;color:var(--muted)}
.aip-fc-nums b{display:block;font-size:20px;font-weight:800;color:var(--fg);line-height:1.2}
.aip-chart{margin-top:8px;height:74px}
.aip-chart svg{display:block;width:100%;height:100%;overflow:visible}
.aip-hist{fill:none;stroke:var(--line);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.aip-proj{fill:none;stroke:var(--gold);stroke-width:2.2;stroke-dasharray:5 4;stroke-linecap:round}
.aip-proj.is-bad{stroke:var(--bad)}
.aip-limit{stroke:var(--bad);stroke-width:1;stroke-dasharray:2 3;opacity:.7}
.aip-now{stroke:var(--muted);stroke-width:1;opacity:.5}
.aip-axis{font-size:9px;fill:var(--muted)}
.aip-fc-text{margin-top:6px;font-size:12.5px;color:#3c5a60}
.aip-fc-text b{color:var(--fg)}
.aip-conf{font-size:11px;color:var(--muted);margin-top:2px}

.aip-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;margin-top:18px}
.aip-panel{padding:16px;border:1px solid var(--border);border-radius:14px;background:var(--card)}
.aip-panel h3{margin-bottom:10px}
.aip-list{display:grid;gap:8px}
.aip-item{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border:1px solid var(--border);border-radius:12px;background:#fff;animation:aipIn .4s ease both}
.aip-dot{flex:none;width:10px;height:10px;margin-top:5px;border-radius:50%}
.aip-dot.is-bad{background:var(--bad)}.aip-dot.is-warn{background:#f59e0b}.aip-dot.is-good{background:#22c55e}
.aip-item-main{flex:1;min-width:0}
.aip-item-title{font-size:13.5px;font-weight:800}
.aip-item-text{font-size:12.5px;color:#3c5a60;margin-top:2px}
.aip-btns{display:flex;gap:6px;margin-top:8px}
.aip-ok{padding:6px 12px;border-radius:8px;border:0;background:var(--fg);color:#fff;font-size:12px;font-weight:800}
.aip-ok:hover{background:#0f3a44}
.aip-no{padding:6px 12px;border-radius:8px;border:1px solid var(--border);background:#fff;color:var(--muted);font-size:12px;font-weight:700}
.aip-ok[disabled],.aip-no[disabled]{opacity:.5;cursor:wait}
.aip-empty{padding:12px;border:1px dashed var(--border);border-radius:12px;text-align:center;font-size:12.5px;color:var(--muted)}
.aip-log-title{margin-top:16px;margin-bottom:8px;font-size:13px;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}
.aip-log{display:grid;gap:6px;max-height:220px;overflow:auto}
.aip-log li{display:flex;justify-content:space-between;gap:10px;padding:7px 10px;border-radius:8px;background:var(--surface);font-size:12px}
.aip-log li span{color:var(--muted);white-space:nowrap}
.aip-op{display:block;margin-top:3px;font-size:11px;font-weight:700;color:var(--muted)}
.aip-op.is-successful{color:var(--good)}.aip-op.is-executing,.aip-op.is-pending{color:var(--warn)}.aip-op.is-failed{color:var(--bad)}
.aip-log .is-approved b{color:var(--good)}.aip-log .is-dismissed b{color:var(--muted)}
.aip-foot{margin-top:14px;font-size:11.5px;color:var(--muted)}
.aip-toast{position:absolute;left:50%;bottom:16px;transform:translate(-50%,10px);opacity:0;z-index:5;padding:8px 14px;border-radius:8px;
  background:#123f4a;color:#fff;font-size:12.5px;transition:.3s;pointer-events:none}
.aip-toast.show{opacity:1;transform:translate(-50%,0)}
@media (max-width:1000px){.aip-forecasts,.aip-grid{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){.aip *{animation:none!important;transition:none!important}}
</style>
`;

function aipInit(root){
  var q = function(sel){ return root.querySelector(sel); };
  var state = { ops: {}, forecasts: [], anomalies: [], actions: [], log: [], localLog: [], remoteLog: [], alarms: [], busy: false };

  // ---------- API ----------
  function headers(json){
    var h = { Accept: 'application/json' };
    if(json) h['Content-Type'] = 'application/json';
    try{ var t = localStorage.getItem('_tcy1') || sessionStorage.getItem('_tcy1'); if(t) h.Authorization = 'Basic ' + t; }catch(e){}
    var m = document.cookie.match(/XSRF-TOKEN=([^;]+)/); if(m) h['X-XSRF-TOKEN'] = m[1];
    return h;
  }
  // Uses the platform's own authenticated fetch (same as the other Smart Guardian widgets).
  function api(path, opts){
    opts = opts || {};
    var init = { method: opts.method || 'GET', headers: { Accept: 'application/json' } };
    if(opts.body){ init.body = opts.body; init.headers['Content-Type'] = opts.type || 'application/json'; }
    var call;
    try{ call = c8yFetch(path, init); }catch(e){ call = null; }
    if(!call || !call.then){ init.headers = headers(!!opts.body); init.credentials = 'include'; call = fetch(path, init); }
    return call.then(function(r){
      if(!r.ok){ var err = new Error('HTTP ' + r.status); err.status = r.status; throw err; }
      return r.status === 204 ? {} : r.json().catch(function(){ return {}; });
    });
  }
  function iso(d){ return d.toISOString(); }
  function esc(s){ var d = document.createElement('span'); d.textContent = String(s == null ? '' : s); return d.innerHTML; }
  function toast(msg){ var t = q('[data-toast]'); t.textContent = msg; t.classList.add('show'); clearTimeout(t.tm);
    t.tm = setTimeout(function(){ t.classList.remove('show'); }, 2200); }
  function round(v){ return Math.round(v * 10) / 10; }
  function hoursText(h){
    if(h < 1) return 'under 1 hour';
    if(h < 48) return '~' + Math.round(h) + ' h';
    return '~' + Math.round(h / 24) + ' days';
  }
  function ago(t){ var m = Math.round((Date.now() - new Date(t).getTime()) / 60000);
    if(m < 1) return 'just now'; if(m < 60) return m + ' min ago'; if(m < 1440) return Math.round(m / 60) + ' h ago'; return Math.round(m / 1440) + ' d ago'; }

  // ---------- data ----------
  function readings(model){
    var from = new Date(Date.now() - HISTORY_H * 3600000);
    return api('/measurement/measurements?source=' + model.device + '&dateFrom=' + iso(from) + '&dateTo=' + iso(new Date()) + '&pageSize=2000&revert=true')
      .then(function(r){
        var out = [];
        (r.measurements || []).forEach(function(m){
          var v = m[model.frag] && m[model.frag][model.series] && m[model.frag][model.series].value;
          if(v !== undefined && v !== null) out.push({ t: new Date(m.time).getTime(), v: Number(v) });
        });
        return out.sort(function(a, b){ return a.t - b.t; });
      }).catch(function(){ return null; });
  }
  function eventsFor(id, hours, type){
    var from = new Date(Date.now() - hours * 3600000);
    return api('/event/events?source=' + id + (type ? '&type=' + type : '') + '&dateFrom=' + iso(from) + '&dateTo=' + iso(new Date(Date.now() + 60000)) + '&pageSize=2000')
      .then(function(r){ return r.events || []; }).catch(function(){ return null; });
  }
  function activeAlarms(){
    return Promise.all(ALL_DEVICES.map(function(id){
      return api('/alarm/alarms?source=' + id + '&status=ACTIVE&pageSize=50').then(function(r){ return r.alarms || []; }).catch(function(){ return []; });
    })).then(function(l){ return [].concat.apply([], l); });
  }
  function agentLog(){
    return Promise.all(ALL_DEVICES.map(function(id){ return eventsFor(id, 24 * 7, ACTION_TYPE); }))
      .then(function(l){
        var all = [].concat.apply([], l.map(function(x){ return x || []; }));
        return all.sort(function(a, b){ return new Date(b.time) - new Date(a.time); });
      });
  }

  // ---------- AI: trend forecast (least-squares regression) ----------
  function forecast(model, pts){
    if(!pts || pts.length < 3){ return { model: model, pts: pts || [], ok: false }; }
    // use the most recent run of readings (simulators restart their scenario, so cut at big drops/jumps)
    var recent = pts.slice(-12);
    var now = Date.now();
    var n = recent.length, sx = 0, sy = 0, sxx = 0, sxy = 0;
    recent.forEach(function(p){ var x = (p.t - now) / 3600000; sx += x; sy += p.v; sxx += x * x; sxy += x * p.v; });
    var den = n * sxx - sx * sx;
    var b = den ? (n * sxy - sx * sy) / den : 0;
    var a = (sy - b * sx) / n;
    var mean = sy / n, ssTot = 0, ssRes = 0;
    recent.forEach(function(p){ var x = (p.t - now) / 3600000; var f = a + b * x; ssTot += (p.v - mean) * (p.v - mean); ssRes += (p.v - f) * (p.v - f); });
    var r2 = ssTot ? Math.max(0, 1 - ssRes / ssTot) : 1;
    var last = pts[pts.length - 1].v;
    var future = a + b * HORIZON_H;
    if(model.unit === '%') future = Math.max(0, Math.min(100, future));
    else future = Math.max(0, future);
    var breach = null;
    var bad = model.dir === 'below' ? function(v){ return v < model.limit; } : function(v){ return v >= model.limit; };
    if(bad(last)) breach = 0;
    else if(model.dir === 'below' && b < 0) breach = (model.limit - a) / b;
    else if(model.dir === 'above' && b > 0) breach = (model.limit - a) / b;
    if(breach !== null && breach > 24 * 14) breach = null;
    return { model: model, pts: pts, ok: true, slope: b, now: a, last: last, future: future, r2: r2, breach: breach };
  }

  // ---------- AI: anomaly detection (z-score against the sensor's own history) ----------
  function sensorAnomaly(f){
    if(!f.ok || f.pts.length < 6) return null;
    var hist = f.pts.slice(0, -1).map(function(p){ return p.v; });
    var mean = hist.reduce(function(s, v){ return s + v; }, 0) / hist.length;
    var sd = Math.sqrt(hist.reduce(function(s, v){ return s + (v - mean) * (v - mean); }, 0) / hist.length);
    if(sd < 0.0001) return null;
    var z = (f.last - mean) / sd;
    if(Math.abs(z) < 2) return null;
    return { level: Math.abs(z) >= 3 ? 'bad' : 'warn', title: 'Unusual ' + f.model.name.toLowerCase() + ' reading',
      text: 'Latest value ' + round(f.last) + f.model.unit + ' is ' + round(Math.abs(z)) + '× the normal variation (' + (z > 0 ? 'higher' : 'lower') + ' than its ' + HISTORY_H + ' h average of ' + round(mean) + f.model.unit + ').' };
  }
  function permitAnomaly(events){
    if(!events || events.length < 4) return null;
    var now = Date.now(), buckets = [];
    for(var i = 0; i < 24; i++) buckets.push(0);
    events.forEach(function(e){ var h = Math.floor((now - new Date(e.time).getTime()) / 3600000); if(h >= 0 && h < 24) buckets[h] += 1; });
    var lastHour = buckets[0], base = buckets.slice(1);
    var mean = base.reduce(function(s, v){ return s + v; }, 0) / base.length;
    var sd = Math.sqrt(base.reduce(function(s, v){ return s + (v - mean) * (v - mean); }, 0) / base.length);
    if(lastHour > mean + 2 * Math.max(sd, 0.5) && lastHour >= 2){
      return { level: 'bad', title: 'Spike in unauthorized permit scans',
        text: lastHour + ' denied scans in the last hour vs a normal ' + round(mean) + ' per hour. Possible forged-permit attempt at the gate.' };
    }
    var night = events.filter(function(e){ var h = new Date(e.time).getHours(); return (now - new Date(e.time).getTime()) < 86400000 && (h < 5 || h >= 23); }).length;
    if(night >= 3){
      return { level: 'warn', title: 'Night-time access attempts',
        text: night + ' unauthorized permit scans between 23:00 and 05:00 in the last 24 h.' };
    }
    return null;
  }

  // ---------- AI: agent actions ----------
  function buildActions(fcs, trapEvents, alarms){
    var acts = [];
    var byKey = {}; fcs.forEach(function(f){ byKey[f.model.key] = f; });
    var m = byKey.mosquito;
    if(m && m.ok && (m.last >= m.model.limit || (m.breach !== null && m.breach <= 24))){
      acts.push({ key: 'spray', device: DEV.mosquito, level: m.last >= m.model.limit ? 'bad' : 'warn',
        title: 'Create spraying work order – Northeast zone',
        text: m.last >= m.model.limit ? 'Mosquito activity is ' + round(m.last) + ' (limit ' + m.model.limit + ').' : 'Forecast reaches the limit in ' + hoursText(m.breach) + '.' });
    }
    var w = byKey.water;
    if(w && w.ok && w.breach !== null && w.breach <= 72){
      acts.push({ key: 'refill', device: DEV.water, level: w.breach <= 24 ? 'bad' : 'warn',
        title: 'Schedule reservoir refill',
        text: w.breach === 0 ? 'Water level is below ' + w.model.limit + '% now.' : 'Water level is forecast to drop below ' + w.model.limit + '% in ' + hoursText(w.breach) + '.' });
    }
    var s = byKey.soil;
    if(s && s.ok && (s.last < 50 || (s.breach !== null && s.breach <= 48))){
      acts.push({ key: 'irrigate', device: DEV.soil, level: s.last < s.model.limit ? 'bad' : 'warn',
        title: 'Adjust irrigation in the nursery',
        text: 'Soil moisture is ' + round(s.last) + '%' + (s.breach ? ', forecast below ' + s.model.limit + '% in ' + hoursText(s.breach) : '') + '.' });
    }
    var lastTrap = (trapEvents || [])[0];
    if(lastTrap && String(lastTrap.text || '').toLowerCase().indexOf('rodent detected') > -1){
      acts.push({ key: 'trap', device: DEV.trap, level: 'warn',
        title: 'Dispatch technician to the storage trap',
        text: 'Animal captured ' + ago(lastTrap.time) + '. Assign the nearest technician to service the trap.' });
    }
    var oldCritical = alarms.filter(function(a){ return a.severity === 'CRITICAL' && (Date.now() - new Date(a.creationTime || a.time).getTime()) > 30 * 60000; });
    oldCritical.slice(0, 2).forEach(function(a){
      acts.push({ key: 'ack-' + a.id, device: a.source.id, alarm: a.id, level: 'bad',
        title: 'Acknowledge & escalate: ' + (a.source.name || 'security device'),
        text: '“' + (a.text || a.type) + '” has been open for ' + hoursText((Date.now() - new Date(a.creationTime || a.time).getTime()) / 3600000) + '. The agent will acknowledge it and notify the on-call team.' });
    });
    // hide actions already handled in the last 24 h
    var done = {};
    state.log.forEach(function(e){
      var k = e[ACTION_TYPE] && e[ACTION_TYPE].key;
      if(k && Date.now() - new Date(e.time).getTime() < 86400000) done[k] = true;
    });
    return acts.filter(function(a){ return !done[a.key]; });
  }

  function riskScore(alarms, fcs, anomalies){
    var w = { CRITICAL: 22, MAJOR: 10, MINOR: 5, WARNING: 3 }, score = 0;
    alarms.forEach(function(a){ score += w[a.severity] || 0; });
    fcs.forEach(function(f){ if(f.ok && f.breach !== null) score += f.breach === 0 ? 10 : (f.breach <= 24 ? 6 : 2); });
    anomalies.forEach(function(x){ score += x.level === 'bad' ? 10 : 5; });
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  // ---------- render ----------
  function chart(f){
    var W = 300, H = 74, pad = 4;
    var pts = f.pts.slice(-24);
    var tStart = Date.now() - HISTORY_H * 3600000, tEnd = Date.now() + HORIZON_H * 3600000;
    var vals = pts.map(function(p){ return p.v; }).concat([f.future, f.model.limit]);
    var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
    if(hi === lo){ hi += 1; lo -= 1; }
    var span = hi - lo; lo -= span * 0.1; hi += span * 0.1;
    var X = function(t){ return pad + (t - tStart) / (tEnd - tStart) * (W - 2 * pad); };
    var Y = function(v){ return pad + (1 - (v - lo) / (hi - lo)) * (H - 2 * pad - 10); };
    var d = pts.map(function(p, i){ return (i ? 'L' : 'M') + X(p.t).toFixed(1) + ' ' + Y(p.v).toFixed(1); }).join(' ');
    var nowX = X(Date.now());
    var proj = 'M' + nowX.toFixed(1) + ' ' + Y(f.now).toFixed(1) + ' L' + X(tEnd).toFixed(1) + ' ' + Y(f.future).toFixed(1);
    var limitY = Y(f.model.limit).toFixed(1);
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none">' +
      '<line class="aip-limit" x1="0" x2="' + W + '" y1="' + limitY + '" y2="' + limitY + '"/>' +
      '<line class="aip-now" x1="' + nowX + '" x2="' + nowX + '" y1="0" y2="' + (H - 10) + '"/>' +
      '<path class="aip-hist" d="' + d + '"/>' +
      '<path class="aip-proj' + (f.breach !== null && f.breach <= 24 ? ' is-bad' : '') + '" d="' + proj + '"/>' +
      '<text class="aip-axis" x="0" y="' + H + '">-' + HISTORY_H + 'h</text>' +
      '<text class="aip-axis" x="' + (nowX - 8) + '" y="' + H + '">now</text>' +
      '<text class="aip-axis" x="' + (W - 22) + '" y="' + H + '">+' + HORIZON_H + 'h</text></svg>';
  }

  function renderForecasts(){
    q('[data-forecasts]').innerHTML = state.forecasts.map(function(f, i){
      var m = f.model;
      if(!f.ok) return '<div class="aip-fc" style="animation-delay:' + i * 0.08 + 's"><div class="aip-fc-top"><div><p class="aip-fc-name">' + m.name + '</p><p class="aip-fc-zone">' + m.zone + '</p></div>' +
        '<span class="aip-pill is-none">Learning</span></div><p class="aip-fc-text">Not enough recent readings yet. The model needs at least 3 readings in the last ' + HISTORY_H + ' hours.</p></div>';
      var status, cls, text;
      if(f.breach === 0){ status = m.dir === 'below' ? 'Below limit' : 'Above limit'; cls = 'is-bad';
        text = 'Already ' + (m.dir === 'below' ? 'below ' : 'above ') + m.limit + m.unit + '. Action needed now.'; }
      else if(f.breach !== null && f.breach <= HORIZON_H){ status = 'Risk in ' + hoursText(f.breach); cls = 'is-bad';
        text = 'Forecast to ' + (m.dir === 'below' ? 'drop below ' : 'reach ') + '<b>' + m.limit + m.unit + '</b> in <b>' + hoursText(f.breach) + '</b>.'; }
      else if(f.breach !== null){ status = 'Watch'; cls = 'is-warn';
        text = 'Trending toward the limit, expected in <b>' + hoursText(f.breach) + '</b>.'; }
      else { status = 'Stable'; cls = 'is-good'; text = 'No risk expected in the next ' + HORIZON_H + ' hours.'; }
      var trend = Math.abs(f.slope) < 0.05 ? 'flat' : (f.slope > 0 ? '+' : '') + round(f.slope) + m.unit + '/h';
      var conf = f.r2 > 0.7 ? 'High' : f.r2 > 0.4 ? 'Medium' : 'Low';
      return '<div class="aip-fc" style="animation-delay:' + i * 0.08 + 's">' +
        '<div class="aip-fc-top"><div><p class="aip-fc-name">' + m.name + '</p><p class="aip-fc-zone">' + m.zone + '</p></div><span class="aip-pill ' + cls + '">' + status + '</span></div>' +
        '<div class="aip-fc-nums"><div><b>' + round(f.last) + m.unit + '</b>now</div><div><b>' + round(f.future) + m.unit + '</b>in 24 h</div><div><b>' + trend + '</b>trend</div></div>' +
        '<div class="aip-chart">' + chart(f) + '</div>' +
        '<p class="aip-fc-text">' + text + '</p><p class="aip-conf">Model confidence: ' + conf + ' (R² ' + round(f.r2) + ') · ' + Math.min(12, f.pts.length) + ' readings</p></div>';
    }).join('');
  }

  function renderAnomalies(){
    var el = q('[data-anomalies]');
    if(!state.anomalies.length){ el.innerHTML = '<li class="aip-item"><span class="aip-dot is-good"></span><div class="aip-item-main"><p class="aip-item-title">No anomalies detected</p><p class="aip-item-text">All sensors are behaving within their normal pattern.</p></div></li>'; return; }
    el.innerHTML = state.anomalies.map(function(a){
      return '<li class="aip-item"><span class="aip-dot is-' + a.level + '"></span><div class="aip-item-main"><p class="aip-item-title">' + esc(a.title) + '</p><p class="aip-item-text">' + esc(a.text) + '</p></div></li>';
    }).join('');
  }

  function renderActions(){
    var el = q('[data-actions]');
    if(!state.actions.length){ el.innerHTML = '<li class="aip-empty">No pending actions. The agent has nothing to do right now.</li>'; return; }
    el.innerHTML = state.actions.map(function(a, i){
      return '<li class="aip-item"><span class="aip-dot is-' + a.level + '"></span><div class="aip-item-main"><p class="aip-item-title">' + esc(a.title) + '</p><p class="aip-item-text">' + esc(a.text) + '</p>' +
        '<div class="aip-btns"><button class="aip-ok" data-ok="' + i + '">Let the agent do it</button><button class="aip-no" data-no="' + i + '">Dismiss</button></div></div></li>';
    }).join('');
  }

  function opLabel(st){
    return st === 'SUCCESSFUL' ? 'executed by device' : st === 'EXECUTING' ? 'device is executing' : st === 'FAILED' ? 'device reported failure' : 'waiting for device';
  }
  function renderLog(){
    var el = q('[data-log]');
    var rows = state.log.slice(0, 12);
    if(!rows.length){ el.innerHTML = '<li class="aip-empty">No agent actions yet. Approve one above to see it here.</li>'; return; }
    el.innerHTML = rows.map(function(e){
      var info = e[ACTION_TYPE] || {}, st = info.status || 'approved';
      var opSt = info.opId ? (state.ops[info.opId] || 'PENDING') : '';
      var opHtml = info.opId ? '<small class="aip-op is-' + opSt.toLowerCase() + '">⚙ ' + esc(info.command || 'Device command') + ' · ' + opLabel(opSt) + '</small>' : '';
      return '<li class="is-' + st + '"><div><b>' + (st === 'approved' ? '✓ Done' : '✕ Dismissed') + '</b> · ' + esc(info.title || e.text) + (e.local ? ' <em>(this screen only)</em>' : '') + opHtml + '</div><span>' + ago(e.time) + '</span></li>';
    }).join('');
  }

  function renderRisk(score){
    var box = q('[data-risk]');
    var level = score >= 60 ? 'high' : score >= 30 ? 'mid' : 'low';
    box.className = 'aip-risk is-' + level;
    q('[data-risk-value]').textContent = score;
    q('[data-risk-level]').textContent = level === 'high' ? 'High risk' : level === 'mid' ? 'Moderate risk' : 'Low risk';
    q('[data-gauge]').style.strokeDashoffset = String(157 - 157 * score / 100);
  }

  function renderBrief(score){
    var crit = state.alarms.filter(function(a){ return a.severity === 'CRITICAL'; }).length;
    var parts = [];
    parts.push('Today: <b>' + crit + ' critical</b> ' + (crit === 1 ? 'alarm' : 'alarms') + ' open');
    state.forecasts.forEach(function(f){
      if(!f.ok) return;
      if(f.breach === 0) parts.push(f.model.name.toLowerCase() + ' is past its limit');
      else if(f.breach !== null && f.breach <= HORIZON_H) parts.push(f.model.name.toLowerCase() + ' at risk in ' + hoursText(f.breach));
    });
    if(state.anomalies.length) parts.push(state.anomalies.length + ' anomal' + (state.anomalies.length === 1 ? 'y' : 'ies') + ' detected');
    parts.push('<b>' + state.actions.length + '</b> ' + (state.actions.length === 1 ? 'action' : 'actions') + ' waiting for your approval');
    q('[data-brief]').innerHTML = parts.join(' · ') + '.';
  }

  // ---------- run ----------
  function run(manual){
    if(state.busy || !root.isConnected) return;
    state.busy = true;
    var btn = q('[data-run]'); btn.disabled = true; btn.textContent = 'Analysing…';
    Promise.all([
      Promise.all(MODELS.map(readings)),
      activeAlarms(),
      eventsFor(DEV.trap, 48),
      eventsFor(DEV.permitDeny, 24),
      agentLog()
    ]).then(function(r){
      state.forecasts = MODELS.map(function(m, i){ return forecast(m, r[0][i]); });
      state.alarms = r[1];
      state.remoteLog = r[4]; state.log = state.localLog.concat(state.remoteLog);
      loadOps().then(function(){ renderLog(); });
      var an = [];
      state.forecasts.forEach(function(f){ var x = sensorAnomaly(f); if(x) an.push(x); });
      var p = permitAnomaly(r[3]); if(p) an.push(p);
      state.anomalies = an;
      var trap = (r[2] || []).sort(function(a, b){ return new Date(b.time) - new Date(a.time); });
      state.actions = buildActions(state.forecasts, trap, state.alarms);
      var score = riskScore(state.alarms, state.forecasts, state.anomalies);
      renderForecasts(); renderAnomalies(); renderActions(); renderLog(); renderRisk(score); renderBrief(score);
      q('[data-foot]').textContent = 'Last analysis ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) +
        ' · Forecasts use a least-squares trend model on the last ' + HISTORY_H + ' h of readings; anomalies use z-scores against each sensor’s own history.';
      if(manual) toast('Agent analysis complete');
    }).catch(function(){
      q('[data-brief]').textContent = 'Could not reach Cumulocity data right now.';
    }).then(function(){ state.busy = false; btn.disabled = false; btn.textContent = 'Run agent now'; });
  }

  function sendCommand(a){
    var cmd = COMMANDS[a.key];
    if(!cmd) return Promise.resolve(null);
    var body = { deviceId: a.device, description: 'Guardian Agent: ' + cmd.name, c8y_Command: { text: cmd.text } };
    return api('/devicecontrol/operations', { method: 'POST', body: JSON.stringify(body), type: OP_TYPE })
      .then(function(op){ return { id: op.id, name: cmd.name, status: op.status || 'PENDING' }; })
      .catch(function(err){ return { failed: true, name: cmd.name, status: err && err.status }; });
  }
  function loadOps(){
    var ids = [];
    state.log.forEach(function(e){ var i = e[ACTION_TYPE] && e[ACTION_TYPE].opId; if(i && ids.indexOf(i) < 0 && ids.length < 8) ids.push(i); });
    return Promise.all(ids.map(function(id){
      return api('/devicecontrol/operations/' + id).then(function(op){ state.ops[id] = op.status; }).catch(function(){});
    }));
  }
  function logAction(a, status, cmd){
    var body = { source: { id: a.device }, type: ACTION_TYPE, time: new Date().toISOString(),
      text: 'Smart Guardian agent: ' + a.title + ' (' + status + ')' + (cmd && cmd.id ? ' · command sent: ' + cmd.name : '') };
    body[ACTION_TYPE] = { key: a.key, title: a.title, status: status, by: 'Smart Guardian agent' };
    if(cmd && cmd.id){ body[ACTION_TYPE].opId = cmd.id; body[ACTION_TYPE].command = cmd.name; }
    return api('/event/events', { method: 'POST', body: JSON.stringify(body), type: 'application/vnd.com.nsn.cumulocity.event+json' });
  }

  root.addEventListener('click', function(e){
    if(e.target.closest('[data-run]')){ run(true); return; }
    var ok = e.target.closest('[data-ok]'), no = e.target.closest('[data-no]');
    var b = ok || no; if(!b) return;
    var a = state.actions[Number(b.getAttribute(ok ? 'data-ok' : 'data-no'))]; if(!a) return;
    b.parentNode.querySelectorAll('button').forEach(function(x){ x.disabled = true; });
    var sent = null;
    var step = ok && a.alarm
      ? api('/alarm/alarms/' + a.alarm, { method: 'PUT', body: JSON.stringify({ status: 'ACKNOWLEDGED' }), type: 'application/vnd.com.nsn.cumulocity.alarm+json' }).then(function(){ return logAction(a, 'approved'); })
      : (ok ? sendCommand(a) : Promise.resolve(null)).then(function(cmd){ sent = cmd; return logAction(a, ok ? 'approved' : 'dismissed', cmd); });
    step.then(function(){
      if(sent && sent.id) toast('Command sent to the device: ' + sent.name);
      else if(sent && sent.failed) toast('Approved and logged. Device command not sent (HTTP ' + (sent.status || '?') + ')');
      else toast(ok ? 'Done: ' + a.title : 'Dismissed');
      state.busy = false; run(false);
    }).catch(function(err){
      var st = err && err.status;
      // Keep the demo flowing: record the decision in this browser and say why it was not saved to Cumulocity.
      state.localLog.unshift({ time: new Date().toISOString(), text: a.title, local: true,
        c8y_AgentAction: { key: a.key, title: a.title, status: ok ? 'approved' : 'dismissed' } });
      state.log = state.localLog.concat(state.remoteLog);
      state.actions = state.actions.filter(function(x){ return x !== a; });
      renderActions(); renderLog();
      toast(st === 403 || st === 401 ? 'Saved on this screen only: your account has no write permission (HTTP ' + st + ')'
        : 'Saved on this screen only: Cumulocity returned ' + (st ? 'HTTP ' + st : 'an error'));
    });
  });

  run(false);
  var timer = setInterval(function(){ if(!root.isConnected){ clearInterval(timer); return; } run(false); }, REFRESH_MS);
}

export default class SmartGuardianAiPredictions extends HTMLElement {
  connectedCallback() {
    if (this.__init) return;
    this.__init = true;
    var shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = '<style>:host{display:block}</style>' + TEMPLATE;
    aipInit(shadow.querySelector('.aip'));
  }
}
