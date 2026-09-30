// Smart Guardian - Active Alarms
// Advanced developer mode -> Web Component tab -> delete everything -> paste this

// Which part of the island this copy shows. Use 'all' on Home / Alarms,
// 'pest' on the Pest Control page, 'security' on Access Control, 'env' on Environmental Monitoring.
const SECTION = 'all';

const AREAS = {
  'DOOR_SENSOR_DEVICE_ID': 'security', 'CAMERA_DEVICE_ID': 'security', 'PERMIT_AUTHORIZED_DEVICE_ID': 'security', 'PERMIT_UNAUTHORIZED_DEVICE_ID': 'security', 'TAMPER_SENSOR_DEVICE_ID': 'security',
  'MOSQUITO_DEVICE_ID': 'pest', 'ANIMAL_TRAP_DEVICE_ID': 'pest',
  'WATER_LEVEL_DEVICE_ID': 'env', 'SOIL_MOISTURE_DEVICE_ID': 'env'
};
const AREA_LABEL = { security: 'Security & Access', pest: 'Pest Control', env: 'Environmental' };
const SEVERITIES = ['CRITICAL', 'MAJOR', 'MINOR', 'WARNING'];
const REFRESH_MS = 30000;

const TEMPLATE = `
<div class="sgl" data-sg-anchor="alarms">
  <div class="sgl-head">
    <div>
      <p class="sgl-kicker">What needs attention now</p>
      <h2 class="sgl-title">Alarms</h2>
    </div>
    <span class="sgl-live" data-live><i></i><span data-live-text>Loading…</span></span>
  </div>

  <div class="sgl-sev">
    <button class="sgl-sev-card is-active" data-sev="ALL"><span class="sgl-sev-label">All active</span><strong data-count="ALL">–</strong></button>
    <button class="sgl-sev-card sgl-c" data-sev="CRITICAL"><span class="sgl-sev-label"><i></i>Critical</span><strong data-count="CRITICAL">–</strong></button>
    <button class="sgl-sev-card sgl-ma" data-sev="MAJOR"><span class="sgl-sev-label"><i></i>Major</span><strong data-count="MAJOR">–</strong></button>
    <button class="sgl-sev-card sgl-mi" data-sev="MINOR"><span class="sgl-sev-label"><i></i>Minor</span><strong data-count="MINOR">–</strong></button>
    <button class="sgl-sev-card sgl-w" data-sev="WARNING"><span class="sgl-sev-label"><i></i>Warning</span><strong data-count="WARNING">–</strong></button>
  </div>

  <div class="sgl-bar">
    <div class="sgl-areas">
      <button class="sgl-area is-active" data-area="all">All areas</button>
      <button class="sgl-area" data-area="security">Security &amp; Access</button>
      <button class="sgl-area" data-area="pest">Pest Control</button>
      <button class="sgl-area" data-area="env">Environmental</button>
    </div>
    <div class="sgl-status">
      <button class="is-active" data-status="ACTIVE">Active</button>
      <button data-status="ACKNOWLEDGED">Acknowledged</button>
    </div>
  </div>

  <ul class="sgl-list" data-list></ul>
  <div class="sgl-toast" data-toast></div>
</div>

<style>
.sgl{
  --bg:oklch(.975 .01 91);--fg:oklch(.36 .072 213);--card:oklch(.998 .002 90);--primary:oklch(.46 .09 210);
  --muted:oklch(.968 .008 210);--mfg:oklch(.49 .055 183);--border:oklch(.91 .014 220);--pos:oklch(.52 .13 158);
  --crit:oklch(.55 .21 25);--major:oklch(.64 .17 45);--minor:oklch(.72 .15 80);--warn:oklch(.58 .12 230);
  --shadow:0 2px 12px oklch(.28 .035 225 / 7%);--shadow-h:0 14px 30px oklch(.28 .035 225 / 14%);
  position:relative;font-family:"DM Sans",system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--fg);line-height:1.5;
  background:var(--bg);border:1px solid var(--border);border-radius:14px;padding:26px 24px 24px}
.sgl *{box-sizing:border-box}
:where(.sgl) :where(h2,p,ul){margin:0;padding:0}
.sgl ul{list-style:none}
:where(.sgl) button{font:inherit;cursor:pointer;background:none;border:0;color:inherit}

.sgl-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:12px;margin-bottom:18px}
.sgl-kicker{font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--primary)}
.sgl-title{margin-top:4px;font-family:Manrope,inherit;font-size:30px;font-weight:800;letter-spacing:-.01em;color:var(--fg)}
.sgl-live{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--mfg)}
.sgl-live i{width:8px;height:8px;border-radius:50%;background:var(--minor)}
.sgl-live.is-on i{background:var(--pos);animation:sglPulse 1.8s infinite}
.sgl-live.is-demo i{background:var(--mfg)}
@keyframes sglPulse{0%{box-shadow:0 0 0 0 oklch(.52 .13 158 / 60%)}70%{box-shadow:0 0 0 8px transparent}100%{box-shadow:0 0 0 0 transparent}}

.sgl-sev{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;margin-bottom:16px}
.sgl-sev-card{display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:12px 14px;text-align:left;border:1px solid var(--border);
  border-radius:12px;background:var(--card);box-shadow:var(--shadow);transition:transform .25s,box-shadow .25s,border-color .25s;animation:sglIn .5s ease both}
.sgl-sev-card:hover{transform:translateY(-3px);box-shadow:var(--shadow-h)}
.sgl-sev-card.is-active{border-color:var(--primary);box-shadow:0 0 0 2px oklch(.46 .09 210 / 25%),var(--shadow-h)}
.sgl-sev-label{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--mfg)}
.sgl-sev-label i{width:9px;height:9px;border-radius:50%}
.sgl-sev-card strong{font-size:28px;font-weight:800;line-height:1.15}
.sgl-c i{background:var(--crit)}.sgl-c strong{color:var(--crit)}
.sgl-ma i{background:var(--major)}.sgl-ma strong{color:var(--major)}
.sgl-mi i{background:var(--minor)}
.sgl-w i{background:var(--warn)}
.sgl-sev-card:nth-child(2){animation-delay:.06s}.sgl-sev-card:nth-child(3){animation-delay:.12s}.sgl-sev-card:nth-child(4){animation-delay:.18s}.sgl-sev-card:nth-child(5){animation-delay:.24s}
@keyframes sglIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}

.sgl-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}
.sgl-areas{display:flex;flex-wrap:wrap;gap:8px}
.sgl-area{padding:6px 13px;border-radius:99px;border:1px solid var(--border);background:var(--card);font-size:12.5px;font-weight:700;color:var(--mfg);transition:all .2s}
.sgl-area:hover{border-color:var(--primary);color:var(--primary)}
.sgl-area.is-active{background:var(--primary);border-color:var(--primary);color:#fff}
.sgl-status{display:flex;padding:3px;border:1px solid var(--border);border-radius:99px;background:var(--card)}
.sgl-status button{padding:5px 13px;border-radius:99px;font-size:12px;font-weight:700;color:var(--mfg);transition:all .2s}
.sgl-status button.is-active{background:var(--fg);color:#fff}

.sgl-list{display:grid;gap:8px;max-height:460px;overflow:auto;padding:2px}
.sgl-item{display:grid;grid-template-columns:6px 1fr auto;gap:14px;align-items:center;padding:12px 14px 12px 0;border:1px solid var(--border);
  border-radius:12px;background:var(--card);box-shadow:var(--shadow);overflow:hidden;cursor:pointer;transition:transform .2s,box-shadow .2s;animation:sglIn .4s ease both}
.sgl-item:hover{transform:translateX(3px);box-shadow:var(--shadow-h)}
.sgl-item.is-leaving{opacity:0;transform:translateX(30px);transition:all .35s}
.sgl-stripe{align-self:stretch;margin:-12px 0}
.sgl-item[data-sev="CRITICAL"] .sgl-stripe{background:var(--crit)}
.sgl-item[data-sev="MAJOR"] .sgl-stripe{background:var(--major)}
.sgl-item[data-sev="MINOR"] .sgl-stripe{background:var(--minor)}
.sgl-item[data-sev="WARNING"] .sgl-stripe{background:var(--warn)}
.sgl-item[data-sev="CRITICAL"].is-new .sgl-stripe{animation:sglBlink 1.2s ease 3}
@keyframes sglBlink{50%{opacity:.25}}
.sgl-main{min-width:0}
.sgl-top{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.sgl-pill{padding:2px 8px;border-radius:99px;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase}
.sgl-item[data-sev="CRITICAL"] .sgl-pill{background:oklch(.55 .21 25 / 12%);color:var(--crit)}
.sgl-item[data-sev="MAJOR"] .sgl-pill{background:oklch(.64 .17 45 / 14%);color:var(--major)}
.sgl-item[data-sev="MINOR"] .sgl-pill{background:oklch(.72 .15 80 / 18%);color:oklch(.5 .12 75)}
.sgl-item[data-sev="WARNING"] .sgl-pill{background:oklch(.58 .12 230 / 12%);color:var(--warn)}
.sgl-text{font-size:14px;font-weight:700;color:var(--fg);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sgl-meta{margin-top:3px;font-size:12px;color:var(--mfg);display:flex;flex-wrap:wrap;gap:4px 12px}
.sgl-meta b{color:var(--fg);font-weight:700}
.sgl-repeat{padding:1px 7px;border-radius:6px;background:var(--muted);font-size:11px;font-weight:700;color:var(--mfg)}
.sgl-actions{display:flex;align-items:center;gap:8px}
.sgl-ack{padding:7px 12px;border-radius:8px;border:1px solid var(--border);background:var(--card);font-size:12px;font-weight:700;color:var(--primary);transition:all .2s;white-space:nowrap}
.sgl-ack:hover{background:var(--primary);border-color:var(--primary);color:#fff}
.sgl-ack[disabled]{opacity:.5;cursor:wait}
.sgl-empty{padding:34px 16px;text-align:center;border:1px dashed var(--border);border-radius:12px;background:var(--card);color:var(--mfg);font-size:13px}
.sgl-empty strong{display:block;font-size:16px;color:var(--pos);margin-bottom:4px}

.sgl-toast{position:absolute;left:50%;bottom:16px;transform:translate(-50%,10px);opacity:0;z-index:5;padding:8px 14px;border-radius:8px;
  background:oklch(.24 .05 226);color:#fff;font-size:12px;transition:.3s;pointer-events:none}
.sgl-toast.show{opacity:1;transform:translate(-50%,0)}

@media (max-width:900px){.sgl-sev{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:600px){.sgl{padding:18px 14px}.sgl-title{font-size:24px}.sgl-sev{grid-template-columns:repeat(2,minmax(0,1fr))}
  .sgl-item{grid-template-columns:6px 1fr}.sgl-actions{grid-column:2}}
@media (prefers-reduced-motion:reduce){.sgl *{animation:none!important;transition:none!important}}
</style>
`;

function sglInit(root){
  if(!root || root.__ready) return; root.__ready = true;
  var q = function(sel){ return root.querySelector(sel); };
  var state = { sev:'ALL', area:'all', status:'ACTIVE', alarms:[], seen:{}, demo:false };
  var listEl = q('[data-list]'), toastEl = q('[data-toast]');
  if(SECTION !== 'all' && AREA_LABEL[SECTION]){
    state.area = SECTION;
    var areasRow = q('.sgl-areas'); if(areasRow) areasRow.style.display = 'none';
    q('.sgl-title').textContent = AREA_LABEL[SECTION] + ' alarms';
  }

  function headers(json){
    var h = { Accept:'application/json' };
    if(json) h['Content-Type'] = 'application/json';
    try{ var t = localStorage.getItem('_tcy1') || sessionStorage.getItem('_tcy1'); if(t) h.Authorization = 'Basic ' + t; }catch(e){}
    var m = document.cookie.match(/XSRF-TOKEN=([^;]+)/); if(m) h['X-XSRF-TOKEN'] = m[1];
    return h;
  }
  function api(path, opts){
    opts = opts || {};
    return fetch(path, { method:opts.method || 'GET', headers:headers(!!opts.body), body:opts.body, credentials:'include' })
      .then(function(r){ if(!r.ok) throw new Error(r.status); return r.status === 204 ? {} : r.json(); });
  }
  function toast(msg){ toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(toastEl.t);
    toastEl.t = setTimeout(function(){ toastEl.classList.remove('show'); }, 2000); }
  function esc(s){ var d = document.createElement('span'); d.textContent = String(s == null ? '' : s); return d.innerHTML.split('"').join('&' + 'quot;'); }
  function ago(t){ var s = Math.max(0, (Date.now() - new Date(t).getTime()) / 1000);
    if(s < 60) return 'just now'; if(s < 3600) return Math.round(s / 60) + ' min ago';
    if(s < 86400) return Math.round(s / 3600) + ' h ago'; return Math.round(s / 86400) + ' d ago'; }
  function fmt(n){ return Number(n || 0).toLocaleString('en-US'); }

  function sample(){
    var now = Date.now(), mk = function(id, name, sev, text, mins, count){
      return { id:'demo' + id + sev, source:{ id:id, name:name }, severity:sev, text:text, time:new Date(now - mins * 60000).toISOString(), count:count, status:'ACTIVE' }; };
    return [
      mk('DOOR_SENSOR_DEVICE_ID', 'Door Forced Open Sensor', 'CRITICAL', 'Unauthorized entry attempt detected', 3, 15376),
      mk('CAMERA_DEVICE_ID', 'Perimeter Security Camera', 'CRITICAL', 'Someone entered a restricted area', 5, 15368),
      mk('TAMPER_SENSOR_DEVICE_ID', 'Security Tamper Sensor', 'CRITICAL', 'Tampering detected on device housing', 12, 204),
      mk('PERMIT_UNAUTHORIZED_DEVICE_ID', 'Permit reader: Unauthorized', 'MAJOR', 'Unauthorized permit scanned', 7, 5120),
      mk('ANIMAL_TRAP_DEVICE_ID', 'Smart Pest Trap', 'MAJOR', 'Trap occupied: service required', 9, 46388),
      mk('MOSQUITO_DEVICE_ID', 'Smart Mosquito Sensor', 'WARNING', 'High mosquito activity', 21, 3571),
      mk('WATER_LEVEL_DEVICE_ID', 'Water Level Sensor 1', 'WARNING', 'Water level below threshold', 40, 190),
      mk('SOIL_MOISTURE_DEVICE_ID', 'Soil Moisture sensor 1', 'WARNING', 'Soil moisture low', 55, 185)
    ];
  }

  function load(){
    if(!root.isConnected){ clearInterval(timer); return; }
    var ids = Object.keys(AREAS);
    Promise.all(ids.map(function(id){
      return api('/alarm/alarms?source=' + id + '&status=' + state.status + '&pageSize=50')
        .then(function(r){ return { ok:true, list:r.alarms || [] }; })
        .catch(function(){ return { ok:false, list:[] }; });
    })).then(function(res){
      var anyOk = res.some(function(r){ return r.ok; });
      state.demo = !anyOk;
      var all = anyOk ? [].concat.apply([], res.map(function(r){ return r.list; })) : (state.status === 'ACTIVE' ? sample() : []);
      all.sort(function(a, b){
        var s = SEVERITIES.indexOf(a.severity) - SEVERITIES.indexOf(b.severity);
        return s || (new Date(b.time) - new Date(a.time));
      });
      state.alarms = all;
      render();
      var live = q('[data-live]');
      live.className = 'sgl-live ' + (state.demo ? 'is-demo' : 'is-on');
      q('[data-live-text]').textContent = state.demo ? 'Sample data (preview)' :
        'Live · updated ' + new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });
    });
  }

  function render(){
    var counts = { ALL:0, CRITICAL:0, MAJOR:0, MINOR:0, WARNING:0 };
    state.alarms.forEach(function(a){
      if(state.area !== 'all' && AREAS[a.source.id] !== state.area) return;
      counts.ALL++; if(counts[a.severity] !== undefined) counts[a.severity]++;
    });
    Object.keys(counts).forEach(function(k){ q('[data-count="' + k + '"]').textContent = counts[k]; });

    var rows = state.alarms.filter(function(a){
      return (state.sev === 'ALL' || a.severity === state.sev) && (state.area === 'all' || AREAS[a.source.id] === state.area);
    });
    if(!rows.length){
      listEl.innerHTML = '<li class="sgl-empty"><strong>All clear</strong>No ' + (state.status === 'ACTIVE' ? 'active' : 'acknowledged') + ' alarms for this filter.</li>';
      return;
    }
    listEl.innerHTML = rows.map(function(a, i){
      var isNew = !state.seen[a.id] && Object.keys(state.seen).length > 0;
      var area = AREA_LABEL[AREAS[a.source.id]] || '';
      return '<li class="sgl-item' + (isNew ? ' is-new' : '') + '" data-sev="' + esc(a.severity) + '" data-src="' + esc(a.source.id) + '" data-id="' + esc(a.id) + '" style="animation-delay:' + Math.min(i, 10) * 0.04 + 's">' +
        '<span class="sgl-stripe"></span>' +
        '<div class="sgl-main"><div class="sgl-top"><span class="sgl-pill">' + esc(a.severity) + '</span><span class="sgl-text">' + esc(a.text) + '</span></div>' +
        '<div class="sgl-meta"><span><b>' + esc(a.source.name || a.source.id) + '</b></span><span>' + esc(area) + '</span><span>' + ago(a.time) + '</span>' +
        (a.count > 1 ? '<span class="sgl-repeat">recurring</span>' : '') + '</div></div>' +
        '<div class="sgl-actions">' + (state.status === 'ACTIVE' ? '<button class="sgl-ack" data-ack>Acknowledge</button>' : '') + '</div>' +
        '</li>';
    }).join('');
    state.alarms.forEach(function(a){ state.seen[a.id] = 1; });
  }

  root.addEventListener('click', function(e){
    var t = e.target;
    var sev = t.closest('[data-sev]');
    if(sev && sev.classList.contains('sgl-sev-card')){
      state.sev = sev.getAttribute('data-sev');
      root.querySelectorAll('.sgl-sev-card').forEach(function(b){ b.classList.toggle('is-active', b === sev); });
      render(); return;
    }
    var area = t.closest('[data-area]');
    if(area){
      state.area = area.getAttribute('data-area');
      root.querySelectorAll('[data-area]').forEach(function(b){ b.classList.toggle('is-active', b === area); });
      render(); return;
    }
    var st = t.closest('[data-status]');
    if(st){
      state.status = st.getAttribute('data-status');
      root.querySelectorAll('[data-status]').forEach(function(b){ b.classList.toggle('is-active', b === st); });
      listEl.innerHTML = '<li class="sgl-empty">Loading…</li>'; load(); return;
    }
    var item = t.closest('.sgl-item');
    if(!item) return;
    if(t.closest('[data-ack]')){
      e.stopPropagation();
      var btn = t.closest('[data-ack]'), id = item.getAttribute('data-id');
      if(state.demo){ toast('Preview only: acknowledge works inside Cumulocity'); return; }
      btn.disabled = true; btn.textContent = 'Saving…';
      api('/alarm/alarms/' + id, { method:'PUT', body:JSON.stringify({ status:'ACKNOWLEDGED' }) })
        .then(function(){
          item.classList.add('is-leaving');
          state.alarms = state.alarms.filter(function(a){ return a.id !== id; });
          setTimeout(render, 350);
          toast('Alarm acknowledged');
        })
        .catch(function(){ btn.disabled = false; btn.textContent = 'Acknowledge'; toast('Could not acknowledge (check your permissions)'); });
      return;
    }
    window.open('/apps/devicemanagement/index.html' + String.fromCharCode(35) + '/device/' + item.getAttribute('data-src') + '/alarms', '_blank');
  });

  load();
  var timer = setInterval(load, REFRESH_MS);
}

export default class SmartGuardianAlarms extends HTMLElement {
  connectedCallback() {
    if (this.__init) return;
    this.__init = true;
    var shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = '<style>:host{display:block}</style>' + TEMPLATE;
    sglInit(shadow.querySelector('.sgl'));
  }
}
