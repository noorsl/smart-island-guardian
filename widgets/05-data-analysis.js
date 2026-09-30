// Smart Guardian - Data Analysis
// Advanced developer mode -> JavaScript tab -> delete everything -> paste this

// Which part of the island this copy shows. Use 'all' on Home / Alarms,
// 'pest' on the Pest Control page, 'security' on Access Control, 'env' on Environmental Monitoring.
const SECTION = 'all';
const SECTION_CARDS = { pest: ['mosquito', 'trap'], env: ['water', 'soil'], security: ['access'] };
const SECTION_TITLE = { pest: 'Pest Control Analysis', env: 'Environmental Analysis', security: 'Access Analysis' };

const DEVICES = {
  mosquito:   'MOSQUITO_DEVICE_ID',
  trap:       'ANIMAL_TRAP_DEVICE_ID',
  water:      'WATER_LEVEL_DEVICE_ID',
  soil:       'SOIL_MOISTURE_DEVICE_ID',
  permitOk:   'PERMIT_AUTHORIZED_DEVICE_ID',
  permitDeny: 'PERMIT_UNAUTHORIZED_DEVICE_ID'
};
const REFRESH_MS = 60000;

const TEMPLATE = `
<div class="sga" data-sg-anchor="data-analysis">
  <div class="sga-head">
    <div>
      <p class="sga-kicker">Insights from live data</p>
      <h2 class="sga-title">Data Analysis</h2>
    </div>
    <div class="sga-controls">
      <span class="sga-live" data-live><i></i><span data-live-text>Loading…</span></span>
      <div class="sga-range" role="tablist">
        <button data-range="24h">24 h</button>
        <button data-range="7d" class="is-active">7 days</button>
      </div>
    </div>
  </div>

  <div class="sga-grid">
    <article class="sga-card" data-card="mosquito">
      <div class="sga-card-head"><div><h3>Mosquito Activity</h3><p class="sga-sub" data-sub>Smart Mosquito Sensor</p></div><span class="sga-badge" data-badge>…</span></div>
      <div class="sga-big"><strong data-now>–</strong><span data-unit></span><em data-delta></em></div>
      <div class="sga-chart" data-chart></div>
    </article>

    <article class="sga-card" data-card="water">
      <div class="sga-card-head"><div><h3>Water Level</h3><p class="sga-sub">Water Level Sensor #1</p></div><span class="sga-badge" data-badge>…</span></div>
      <div class="sga-gauge-row">
        <div class="sga-gauge" data-gauge style="--p:0"><span data-now>–</span></div>
        <div><p class="sga-gauge-state" data-state>–</p><p class="sga-note" data-note>Lagoon reservoir</p></div>
      </div>
      <div class="sga-chart sga-chart--small" data-chart></div>
    </article>

    <article class="sga-card" data-card="soil">
      <div class="sga-card-head"><div><h3>Soil Moisture</h3><p class="sga-sub">Soil Moisture Sensor #1</p></div><span class="sga-badge" data-badge>…</span></div>
      <div class="sga-big"><strong data-now>–</strong><span data-unit></span><em data-delta></em></div>
      <div class="sga-chart" data-chart></div>
    </article>

    <article class="sga-card" data-card="trap">
      <div class="sga-card-head"><div><h3>Animal Control</h3><p class="sga-sub">Smart Pest Trap · service status</p></div><span class="sga-badge" data-badge>…</span></div>
      <div class="sga-split">
        <div><strong data-alarms>–</strong><p>Alarms in period</p></div>
        <div><strong data-state>–</strong><p>Current status</p></div>
      </div>
      <p class="sga-note sga-note--center" data-note>Last reading –</p>
    </article>

    <article class="sga-card sga-card--wide" data-card="access" data-sg-anchor="access">
      <div class="sga-card-head">
        <div><h3>Access Activity</h3><p class="sga-sub">Permit reader events</p></div>
        <div class="sga-legend">
          <span><i style="background:var(--s1)"></i>Authorized <b data-total-ok>–</b></span>
          <span><i style="background:var(--s2)"></i>Unauthorized <b data-total-deny>–</b></span>
        </div>
      </div>
      <div class="sga-kpis">
        <div class="sga-kpi">
          <p class="sga-kpi-label">Permits scanned this month</p>
          <strong data-month-total>–</strong>
          <p class="sga-kpi-sub"><span class="sga-dot1"></span><b data-month-ok>–</b> authorized · <span class="sga-dot2"></span><b data-month-deny>–</b> denied</p>
        </div>
        <div class="sga-kpi" data-sec>
          <p class="sga-kpi-label">Security trend</p>
          <strong data-sec-value>–</strong>
          <p class="sga-kpi-sub" data-sec-sub>Unauthorized attempts vs. previous period</p>
        </div>
        <div class="sga-kpi">
          <p class="sga-kpi-label">Approval rate</p>
          <strong data-rate>–</strong>
          <div class="sga-meter"><i data-rate-bar></i></div>
          <p class="sga-kpi-sub" data-rate-sub>Share of scans authorized in this period</p>
        </div>
      </div>
      <div class="sga-chart sga-chart--bars" data-chart></div>
    </article>
  </div>
  <div class="sga-tip" data-tip></div>
</div>

<style>
.sga{
  --bg:oklch(.975 .01 91);--fg:oklch(.36 .072 213);--card:oklch(.998 .002 90);--primary:oklch(.46 .09 210);
  --muted:oklch(.968 .008 210);--mfg:oklch(.49 .055 183);--border:oklch(.91 .014 220);--grid:oklch(.93 .01 220);
  --pos:oklch(.52 .13 158);--alert:oklch(.62 .19 24);--warn:oklch(.61 .14 57);
  --s1:#00809e;--s2:#b8770a;
  --shadow:0 2px 12px oklch(.28 .035 225 / 7%);--shadow-h:0 14px 30px oklch(.28 .035 225 / 14%);
  position:relative;font-family:"DM Sans",system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--fg);line-height:1.5;
  background:var(--bg);border:1px solid var(--border);border-radius:14px;padding:26px 24px 24px}
.sga *{box-sizing:border-box}
.sga h2,.sga h3,.sga p{margin:0;padding:0}
.sga button{font:inherit;cursor:pointer;background:none;border:0;color:inherit}

.sga-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:12px;margin-bottom:18px}
.sga-kicker{font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--primary)}
.sga-title{margin-top:4px!important;font-family:Manrope,inherit;font-size:30px;font-weight:800;letter-spacing:-.01em;color:var(--fg)}
.sga-controls{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.sga-live{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--mfg)}
.sga-live i{width:8px;height:8px;border-radius:50%;background:var(--warn)}
.sga-live.is-on i{background:var(--pos);animation:sgaPulse 1.8s infinite}
.sga-live.is-demo i{background:var(--mfg)}
@keyframes sgaPulse{0%{box-shadow:0 0 0 0 oklch(.52 .13 158 / 60%)}70%{box-shadow:0 0 0 8px transparent}100%{box-shadow:0 0 0 0 transparent}}
.sga-range{display:flex;padding:3px;border:1px solid var(--border);border-radius:99px;background:var(--card)}
.sga-range button{padding:5px 14px!important;border-radius:99px;font-size:12px!important;font-weight:700!important;color:var(--mfg)!important;transition:all .2s}
.sga-range button.is-active{background:var(--primary)!important;color:#fff!important}

.sga-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.sga-card{min-width:0;padding:16px;border:1px solid var(--border);border-radius:12px;background:var(--card);box-shadow:var(--shadow);
  transition:transform .3s,box-shadow .3s;animation:sgaIn .55s ease both}
.sga-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-h)}
.sga-card:nth-child(2){animation-delay:.08s}.sga-card:nth-child(3){animation-delay:.16s}.sga-card:nth-child(4){animation-delay:.24s}.sga-card:nth-child(5){animation-delay:.32s}
.sga-card--wide{grid-column:1 / -1}
@keyframes sgaIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.sga-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;flex-wrap:wrap}
.sga-card h3{font-size:14px;font-weight:700;color:var(--fg)}
.sga-sub{font-size:11px;color:var(--mfg)}
.sga-badge{flex:none;padding:3px 9px;border-radius:99px;font-size:10.5px;font-weight:700;background:var(--muted);color:var(--mfg)}
.sga-badge.is-alert{background:oklch(.62 .19 24 / 12%);color:var(--alert)}
.sga-badge.is-warn{background:oklch(.61 .14 57 / 14%);color:var(--warn)}
.sga-badge.is-good{background:oklch(.52 .13 158 / 13%);color:var(--pos)}
.sga-badge.is-alert::before{content:"⚠  "}
.sga-badge.is-good::before{content:"✓  "}

.sga-big{display:flex;align-items:baseline;gap:6px;margin-top:10px}
.sga-big strong{font-size:26px;font-weight:800;line-height:1}
.sga-big span{font-size:12px;color:var(--mfg)}
.sga-big em{font-style:normal;margin-left:auto;font-size:11px;font-weight:700;color:var(--mfg)}

.sga-chart{position:relative;margin-top:10px;height:110px}
.sga-chart--small{height:60px}
.sga-chart--bars{height:170px;margin-top:14px}
.sga-chart svg{display:block;width:100%;height:100%;overflow:visible}
.sga-empty{display:grid;place-items:center;height:100%;font-size:12px;color:var(--mfg);border:1px dashed var(--border);border-radius:8px}
.sga-axis{font-size:10px;fill:var(--mfg)}
.sga-line{fill:none;stroke:var(--s1);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;
  stroke-dasharray:1200;stroke-dashoffset:1200;animation:sgaDraw 1.2s ease forwards}
@keyframes sgaDraw{to{stroke-dashoffset:0}}
.sga-area{fill:var(--s1);opacity:.12}
.sga-bar{transition:opacity .2s;transform-origin:bottom;transform-box:fill-box;animation:sgaGrow .7s ease both}
@keyframes sgaGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
.sga-chart:hover .sga-bar{opacity:.45}.sga-chart .sga-bar.is-hover{opacity:1}
.sga-cross{stroke:var(--mfg);stroke-width:1;stroke-dasharray:3 3}
.sga-dot{fill:var(--s1);stroke:var(--card);stroke-width:2}

.sga-gauge-row{display:flex;align-items:center;gap:14px;margin-top:12px}
.sga-gauge{position:relative;display:grid;place-items:center;width:78px;height:78px;flex:none;border-radius:50%;
  background:conic-gradient(var(--s1) calc(var(--p) * 1%),var(--muted) 0);transition:--p 1s}
.sga-gauge::after{content:"";position:absolute;inset:8px;border-radius:50%;background:var(--card)}
.sga-gauge span{position:relative;z-index:1;font-size:17px;font-weight:800}
.sga-gauge-state{font-size:15px;font-weight:700}
.sga-note{font-size:11.5px;color:var(--mfg)}
.sga-note--center{text-align:center;margin-top:12px!important}

.sga-split{display:grid;grid-template-columns:1fr 1fr;margin-top:16px;text-align:center}
.sga-split>div+div{border-left:1px solid var(--border)}
.sga-split strong{display:block;font-size:24px;font-weight:800;line-height:1.2}
.sga-split p{font-size:11px;color:var(--mfg)}

.sga-legend{display:flex;gap:14px;flex-wrap:wrap;font-size:12px;color:var(--mfg)}
.sga-legend span{display:inline-flex;align-items:center;gap:6px}
.sga-legend i{width:10px;height:10px;border-radius:3px}
.sga-legend b{color:var(--fg)}

.sga-kpis{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:14px}
.sga-kpi{padding:12px 14px;border-radius:10px;background:var(--muted);border:1px solid var(--border);min-width:0}
.sga-kpi-label{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--mfg)}
.sga-kpi strong{display:block;margin-top:4px;font-size:26px;font-weight:800;line-height:1.15;color:var(--fg)}
.sga-kpi-sub{margin-top:4px!important;font-size:11.5px;color:var(--mfg)}
.sga-kpi-sub b{color:var(--fg)}
.sga-kpi.is-up strong{color:var(--pos)}.sga-kpi.is-down strong{color:var(--alert)}
.sga-dot1,.sga-dot2{display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:3px;background:var(--s1)}
.sga-dot2{background:var(--s2)}
.sga-meter{height:6px;margin-top:8px;border-radius:99px;background:var(--border);overflow:hidden}
.sga-meter i{display:block;height:100%;width:0;border-radius:99px;background:var(--s1);transition:width 1s ease}
@media (max-width:900px){.sga-kpis{grid-template-columns:1fr}}
.sga-tip{position:absolute;z-index:5;pointer-events:none;opacity:0;transform:translate(-50%,-110%);white-space:nowrap;
  padding:6px 10px;border-radius:8px;background:oklch(.24 .05 226);color:#fff;font-size:11.5px;line-height:1.45;
  box-shadow:0 6px 18px oklch(.2 .04 225 / 30%);transition:opacity .12s}
.sga-tip.show{opacity:1}
.sga-tip i{display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:6px}

@media (max-width:1100px){.sga-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:600px){.sga{padding:18px 14px}.sga-title{font-size:24px}.sga-grid{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){.sga *{animation:none!important;transition:none!important}.sga-line{stroke-dashoffset:0}}
</style>
`;


function sgaInit(root){
  if(!root || root.__ready) return; root.__ready = true;
  var range = '7d', demo = false;
  var tip = root.querySelector('[data-tip]');
  var q = function(sel, el){ return (el || root).querySelector(sel); };
  var card = function(name){ return root.querySelector('[data-card="' + name + '"]'); };

  
  function headers(){
    var h = { Accept:'application/json' };
    try{ var t = localStorage.getItem('_tcy1') || sessionStorage.getItem('_tcy1'); if(t) h.Authorization = 'Basic ' + t; }catch(_){}
    var m = document.cookie.match(/XSRF-TOKEN=([^;]+)/); if(m) h['X-XSRF-TOKEN'] = m[1];
    return h;
  }
  function api(path){
    return fetch(path, { headers:headers(), credentials:'include' }).then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); });
  }
  function iso(d){ return d.toISOString(); }

  
  function buckets(){
    var out = [], now = new Date();
    if(range === '7d'){
      var d0 = new Date(now); d0.setHours(0,0,0,0); d0.setDate(d0.getDate() - 6);
      for(var i = 0; i < 7; i++){
        var s = new Date(d0); s.setDate(d0.getDate() + i);
        var e = new Date(s); e.setDate(s.getDate() + 1);
        out.push({ from:s, to:e, label:s.toLocaleDateString('en-US',{ weekday:'short' }), long:s.toLocaleDateString('en-US',{ weekday:'short', month:'short', day:'numeric' }) });
      }
    } else {
      var h0 = new Date(now); h0.setMinutes(0,0,0); h0.setHours(h0.getHours() - 23);
      for(var j = 0; j < 24; j++){
        var hs = new Date(h0); hs.setHours(h0.getHours() + j);
        var he = new Date(hs); he.setHours(hs.getHours() + 1);
        var lab = hs.toLocaleTimeString('en-US',{ hour:'numeric' });
        out.push({ from:hs, to:he, label:(j % 4 === 0 ? lab : ''), long:lab });
      }
    }
    return out;
  }

  
  var seriesCache = {};
  // The series each sensor sends today (same names the AI widgets read).
  var PREFERRED_SERIES = {};
  PREFERRED_SERIES[DEVICES.water] = 'WaterLevel.waterLevel';
  PREFERRED_SERIES[DEVICES.soil] = 'soilMoisture.moisture';
  PREFERRED_SERIES[DEVICES.mosquito] = 'Mosquito.Activity';
  function findSeries(id){
    if(seriesCache[id]) return Promise.resolve(seriesCache[id]);
    if(PREFERRED_SERIES[id]){ seriesCache[id] = PREFERRED_SERIES[id]; return Promise.resolve(PREFERRED_SERIES[id]); }
    return api('/inventory/managedObjects/' + id + '/supportedSeries').then(function(r){
      var s = (r.c8y_SupportedSeries || [])[0];
      if(s) return s;
      throw new Error('none');
    }).catch(function(){
      return api('/measurement/measurements?source=' + id + '&pageSize=1&revert=true&dateFrom=1970-01-01').then(function(r){
        var m = (r.measurements || [])[0]; if(!m) return null;
        for(var f in m){ if(m[f] && typeof m[f] === 'object' && f !== 'source' && f !== 'self'){
          for(var k in m[f]){ if(m[f][k] && m[f][k].value !== undefined) return f + '.' + k; } } }
        return null;
      });
    }).then(function(s){ seriesCache[id] = s; return s; });
  }
  function seriesData(id, bks){
    return findSeries(id).then(function(s){
      if(!s) return { values:[], unit:'', last:null };
      var q = '/measurement/measurements/series?source=' + id + '&series=' + encodeURIComponent(s) +
              '&dateFrom=' + iso(bks[0].from) + '&dateTo=' + iso(bks[bks.length - 1].to) +
              '&aggregationType=' + (range === '7d' ? 'DAILY' : 'HOURLY');
      var last = api('/measurement/measurements?source=' + id + '&valueFragmentType=' + encodeURIComponent(s.split('.')[0]) + '&valueFragmentSeries=' + encodeURIComponent(s.split('.')[1]) + '&pageSize=1&revert=true&dateFrom=1970-01-01&dateTo=' + iso(new Date(Date.now() + 60000))).catch(function(){ return {}; });
      return Promise.all([api(q), last]).then(function(r){
        var res = r[0], unit = (res.series && res.series[0] && res.series[0].unit) || '';
        var pts = Object.keys(res.values || {}).map(function(t){
          var v = (res.values[t] || [])[0]; if(!v) return null;
          return { t:new Date(t).getTime(), v:(v.min + v.max) / 2, max:v.max };
        }).filter(Boolean);
        var values = bks.map(function(b){
          var inB = pts.filter(function(p){ return p.t >= b.from.getTime() && p.t < b.to.getTime(); });
          if(!inB.length) return null;
          return inB.reduce(function(a, p){ return a + p.v; }, 0) / inB.length;
        });
        var lm = (r[1].measurements || [])[0], lastVal = null;
        if(lm){ var sp = s.split('.'); if(lm[sp[0]] && lm[sp[0]][sp[1]]) lastVal = { v:lm[sp[0]][sp[1]].value, unit:lm[sp[0]][sp[1]].unit || unit, time:lm.time }; }
        return { values:values, unit:unit, last:lastVal, series:s };
      });
    });
  }
  function countEvents(id, b){
    return api('/event/events?source=' + id + '&dateFrom=' + iso(b.from) + '&dateTo=' + iso(b.to) + '&pageSize=1&withTotalPages=true')
      .then(function(r){ return (r.statistics && r.statistics.totalPages) || 0; });
  }
  function countRange(id, from, to){
    return countEvents(id, { from:from, to:to });
  }
  function countAlarms(id, from, to, status){
    return api('/alarm/alarms?source=' + id + (status ? '&status=' + status : '') +
               (from ? '&dateFrom=' + iso(from) + '&dateTo=' + iso(to) : '') + '&pageSize=1&withTotalPages=true')
      .then(function(r){ return (r.statistics && r.statistics.totalPages) || 0; });
  }

  
  function fmt(v){ if(v === null || v === undefined || isNaN(v)) return '–'; var a = Math.abs(v);
    return a >= 1000 ? Math.round(v).toLocaleString('en-US') : a >= 100 ? Math.round(v) : Math.round(v * 10) / 10; }
  function nice(max){ if(max <= 0) return 1; var p = Math.pow(10, Math.floor(Math.log10(max))), n = max / p;
    return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p; }
  function setBadge(el, cls, text){ el.className = 'sga-badge' + (cls ? ' is-' + cls : ''); el.textContent = text; }
  function showTip(html, x, y){ tip.innerHTML = html; tip.style.left = x + 'px'; tip.style.top = y + 'px'; tip.classList.add('show'); }
  function hideTip(){ tip.classList.remove('show'); }
  function relPos(el){ var a = el.getBoundingClientRect(), b = root.getBoundingClientRect(); return { x:a.left - b.left, y:a.top - b.top }; }
  var NS = ['http:', '', 'www.w3.org', '2000', 'svg'].join('/');
  function svgEl(tag, attrs){ var e = document.createElementNS(NS, tag); for(var k in attrs) e.setAttribute(k, attrs[k]); return e; }

  
  function lineChart(box, values, bks, unit, name){
    box.innerHTML = '';
    var real = values.filter(function(v){ return v !== null; });
    if(!real.length){ box.innerHTML = '<div class="sga-empty">No measurements in this period</div>'; return; }
    var W = box.clientWidth || 300, H = box.clientHeight || 110, padB = box.classList.contains('sga-chart--small') ? 4 : 18, padT = 6;
    var lo = Math.min.apply(null, real), hi = Math.max.apply(null, real);
    if(hi === lo){ hi += 1; lo = Math.max(0, lo - 1); }
    var span = hi - lo; lo -= span * .1; hi += span * .1;
    var X = function(i){ return values.length === 1 ? W / 2 : 4 + i * (W - 8) / (values.length - 1); };
    var Y = function(v){ return padT + (1 - (v - lo) / (hi - lo)) * (H - padT - padB); };
    var svg = svgEl('svg', { viewBox:'0 0 ' + W + ' ' + H, preserveAspectRatio:'none' });
    [0, .5, 1].forEach(function(f){ var y = padT + f * (H - padT - padB); svg.appendChild(svgEl('line', { x1:0, x2:W, y1:y, y2:y, stroke:'var(--grid)', 'stroke-width':1 })); });
    var d = '', area = '', started = false, firstX = 0, lastX = 0;
    values.forEach(function(v, i){ if(v === null) return; var cmd = started ? 'L' : 'M';
      if(!started) firstX = X(i); lastX = X(i); started = true;
      d += cmd + X(i).toFixed(1) + ' ' + Y(v).toFixed(1) + ' '; });
    area = d + 'L' + lastX.toFixed(1) + ' ' + (H - padB) + ' L' + firstX.toFixed(1) + ' ' + (H - padB) + ' Z';
    svg.appendChild(svgEl('path', { d:area, class:'sga-area' }));
    svg.appendChild(svgEl('path', { d:d, class:'sga-line' }));
    if(padB > 10) bks.forEach(function(b, i){ if(!b.label) return;
      var t = svgEl('text', { x:X(i), y:H - 3, 'text-anchor':i === 0 ? 'start' : i === bks.length - 1 ? 'end' : 'middle', class:'sga-axis' });
      t.textContent = b.label; svg.appendChild(t); });
    var cross = svgEl('line', { y1:padT, y2:H - padB, class:'sga-cross', visibility:'hidden' });
    var dot = svgEl('circle', { r:5, class:'sga-dot', visibility:'hidden' });
    svg.appendChild(cross); svg.appendChild(dot);
    box.appendChild(svg);
    box.onmousemove = function(e){
      var r = box.getBoundingClientRect(), mx = (e.clientX - r.left) * W / r.width;
      var i = Math.round((mx - 4) / ((W - 8) / Math.max(1, values.length - 1)));
      i = Math.max(0, Math.min(values.length - 1, i));
      if(values[i] === null){ hideTip(); cross.setAttribute('visibility','hidden'); dot.setAttribute('visibility','hidden'); return; }
      cross.setAttribute('x1', X(i)); cross.setAttribute('x2', X(i)); cross.setAttribute('visibility','visible');
      dot.setAttribute('cx', X(i)); dot.setAttribute('cy', Y(values[i])); dot.setAttribute('visibility','visible');
      var p = relPos(box);
      showTip('<b>' + bks[i].long + '</b><br><i style="background:var(--s1)"></i>' + name + ': <b>' + fmt(values[i]) + ' ' + unit + '</b>',
              p.x + X(i) * r.width / W, p.y + Y(values[i]) * r.height / H - 8);
    };
    box.onmouseleave = function(){ hideTip(); cross.setAttribute('visibility','hidden'); dot.setAttribute('visibility','hidden'); };
  }

  
  function barChart(box, a, b, bks){
    box.innerHTML = '';
    var W = box.clientWidth || 600, H = box.clientHeight || 170, padB = 18, padT = 16, padL = 34;
    var max = nice(Math.max.apply(null, a.concat(b).concat([1])));
    var svg = svgEl('svg', { viewBox:'0 0 ' + W + ' ' + H, preserveAspectRatio:'none' });
    var Y = function(v){ return padT + (1 - v / max) * (H - padT - padB); };
    [0, .5, 1].forEach(function(f){ var v = max * f, y = Y(v);
      svg.appendChild(svgEl('line', { x1:padL, x2:W, y1:y, y2:y, stroke:'var(--grid)', 'stroke-width':1 }));
      var t = svgEl('text', { x:padL - 6, y:y + 3, 'text-anchor':'end', class:'sga-axis' }); t.textContent = fmt(v); svg.appendChild(t); });
    var n = bks.length, slot = (W - padL) / n, bw = Math.max(3, Math.min(22, (slot - 10) / 2));
    function bar(x, v, color, delay){
      var y = Y(v), h = (H - padB) - y; if(h <= 0) return null;
      var r = Math.min(4, bw / 2, h);
      var p = svgEl('path', { d:'M' + x + ' ' + (H - padB) + 'V' + (y + r) + 'Q' + x + ' ' + y + ' ' + (x + r) + ' ' + y +
        'H' + (x + bw - r) + 'Q' + (x + bw) + ' ' + y + ' ' + (x + bw) + ' ' + (y + r) + 'V' + (H - padB) + 'Z', fill:color, class:'sga-bar' });
      p.style.animationDelay = delay + 's'; svg.appendChild(p); return p;
    }
    var groups = [];
    bks.forEach(function(bk, i){
      var cx = padL + slot * i + slot / 2;
      var p1 = bar(cx - bw - 1, a[i], 'var(--s1)', i * .03), p2 = bar(cx + 1, b[i], 'var(--s2)', i * .03 + .02);
      groups.push([p1, p2]);
      if(bk.label){ var t = svgEl('text', { x:cx, y:H - 3, 'text-anchor':'middle', class:'sga-axis' }); t.textContent = bk.label; svg.appendChild(t); }
      var hit = svgEl('rect', { x:padL + slot * i, y:0, width:slot, height:H, fill:'transparent' });
      hit.addEventListener('mouseenter', function(){
        groups[i].forEach(function(g){ if(g) g.classList.add('is-hover'); });
        var r = box.getBoundingClientRect(), pp = relPos(box);
        showTip('<b>' + bk.long + '</b><br><i style="background:var(--s1)"></i>Authorized: <b>' + a[i] + '</b><br><i style="background:var(--s2)"></i>Unauthorized: <b>' + b[i] + '</b>',
                pp.x + cx * r.width / W, pp.y + Y(Math.max(a[i], b[i])) * r.height / H - 8);
      });
      hit.addEventListener('mouseleave', function(){ groups[i].forEach(function(g){ if(g) g.classList.remove('is-hover'); }); hideTip(); });
      svg.appendChild(hit);
    });
    box.appendChild(svg);
  }

  
  function sample(bks){
    var n = bks.length, wave = function(base, amp, trend){ return bks.map(function(_, i){ return Math.max(0, base + trend * i + amp * Math.sin(i * 1.3)); }); };
    return {
      mosq:{ values:wave(18, 6, 2.2), unit:'count', last:{ v:34, unit:'count' } },
      water:{ values:wave(72, 2, -.6), unit:'%', last:{ v:68, unit:'%' } },
      soil:{ values:wave(26, 3, 1.1), unit:'%', last:{ v:33, unit:'%' } },
      trapAlarms:12, trapActive:1, mosqActive:1,
      ok:bks.map(function(_, i){ return Math.round(20 + 8 * Math.sin(i) + i); }),
      deny:bks.map(function(_, i){ return Math.round(6 + 4 * Math.cos(i * 1.7)); }),
      monthOk:612, monthDeny:148, prevDeny:52
    };
  }

  
  function render(data, bks){
    var periodLabel = range === '7d' ? 'vs. start of week' : 'vs. 24 h ago';
    function trend(values){ var r = values.filter(function(v){ return v !== null; }); if(r.length < 2 || !r[0]) return '';
      var pct = Math.round((r[r.length - 1] - r[0]) / Math.abs(r[0]) * 100); return (pct > 0 ? '▲ ' : pct < 0 ? '▼ ' : '') + Math.abs(pct) + '% ' + periodLabel; }

    // Mosquito
    var c = card('mosquito'), m = data.mosq;
    q('[data-now]', c).textContent = fmt(m.last ? m.last.v : m.values.filter(function(v){ return v !== null; }).pop());
    q('[data-unit]', c).textContent = (m.last && m.last.unit) || m.unit;
    q('[data-delta]', c).textContent = trend(m.values);
    data.mosqActive ? setBadge(q('[data-badge]', c), 'alert', 'High activity') : setBadge(q('[data-badge]', c), 'good', 'Normal');
    lineChart(q('[data-chart]', c), m.values, bks, m.unit, 'Activity');

    // Water
    c = card('water'); var w = data.water, wv = w.last ? w.last.v : null, wu = (w.last && w.last.unit) || w.unit;
    var pct = wv === null ? 0 : (wu === '%' ? wv : Math.min(100, wv));
    q('[data-gauge]', c).style.setProperty('--p', Math.max(0, Math.min(100, pct)));
    q('[data-now]', c).textContent = wv === null ? '–' : fmt(wv) + (wu === '%' ? '%' : '');
    var wState = wv === null ? ['', 'No data'] : pct < 30 ? ['alert', 'Low'] : pct < 50 ? ['warn', 'Watch'] : ['good', 'Normal'];
    setBadge(q('[data-badge]', c), wState[0], wState[1]);
    q('[data-state]', c).textContent = wState[1]; q('[data-state]', c).style.color = wState[0] ? 'var(--' + (wState[0] === 'good' ? 'pos' : wState[0]) + ')' : '';
    q('[data-note]', c).textContent = 'Lagoon reservoir · ' + (wu && wu !== '%' ? wu : 'level');
    lineChart(q('[data-chart]', c), w.values, bks, wu, 'Level');

    // Soil
    c = card('soil'); var s = data.soil;
    q('[data-now]', c).textContent = fmt(s.last ? s.last.v : null);
    q('[data-unit]', c).textContent = (s.last && s.last.unit) || s.unit;
    q('[data-delta]', c).textContent = trend(s.values);
    data.soilActive ? setBadge(q('[data-badge]', c), 'warn', 'Irrigation advised') : setBadge(q('[data-badge]', c), 'good', 'Good');
    lineChart(q('[data-chart]', c), s.values, bks, s.unit, 'Moisture');

    // Trap
    c = card('trap');
    q('[data-alarms]', c).textContent = fmt(data.trapAlarms);
    var occ = data.trapActive > 0;
    q('[data-state]', c).textContent = occ ? 'Service' : 'Clear';
    q('[data-state]', c).style.color = occ ? 'var(--alert)' : 'var(--pos)';
    occ ? setBadge(q('[data-badge]', c), 'alert', 'Action required') : setBadge(q('[data-badge]', c), 'good', 'All clear');
    q('[data-note]', c).textContent = data.trapLast ? 'Last reading: ' + data.trapLast : (occ ? 'Animal captured — service required' : 'No open service alarms');

    // Access
    c = card('access');
    q('[data-total-ok]', c).textContent = fmt(data.ok.reduce(function(a, b){ return a + b; }, 0));
    q('[data-total-deny]', c).textContent = fmt(data.deny.reduce(function(a, b){ return a + b; }, 0));
    barChart(q('[data-chart]', c), data.ok, data.deny, bks);

    // Permits this month
    var mo = data.monthOk, md = data.monthDeny;
    q('[data-month-total]', c).textContent = fmt(mo + md);
    q('[data-month-ok]', c).textContent = fmt(mo);
    q('[data-month-deny]', c).textContent = fmt(md);

    // Security trend: fewer unauthorized attempts than the previous period = safer
    var nowDeny = data.deny.reduce(function(a, b){ return a + b; }, 0), prevDeny = data.prevDeny;
    var sec = q('[data-sec]', c); sec.classList.remove('is-up', 'is-down');
    var perLabel = range === '7d' ? 'previous 7 days' : 'previous 24 h';
    if(prevDeny === null || prevDeny === undefined){
      q('[data-sec-value]', c).textContent = '–';
      q('[data-sec-sub]', c).textContent = 'Not enough history yet';
    } else if(prevDeny === 0 && nowDeny === 0){
      q('[data-sec-value]', c).textContent = 'Stable';
      q('[data-sec-sub]', c).textContent = 'No unauthorized attempts in either period';
      sec.classList.add('is-up');
    } else if(prevDeny === 0){
      sec.classList.add('is-down');
      q('[data-sec-value]', c).textContent = '▼ New attempts';
      q('[data-sec-sub]', c).innerHTML = '<b>' + fmt(nowDeny) + '</b> unauthorized attempts, none in the ' + perLabel;
    } else {
      var change = Math.round((prevDeny - nowDeny) / prevDeny * 100);
      if(change >= 0){ sec.classList.add('is-up');
        q('[data-sec-value]', c).textContent = '▲ ' + change + '% safer';
        q('[data-sec-sub]', c).innerHTML = 'Unauthorized attempts <b>' + fmt(nowDeny) + '</b> vs <b>' + fmt(prevDeny) + '</b> in the ' + perLabel;
      } else { sec.classList.add('is-down');
        var ratio = prevDeny ? nowDeny / prevDeny : 0;
        q('[data-sec-value]', c).textContent = ratio >= 2 ? '▼ ' + (Math.round(ratio * 10) / 10) + '× more attempts' : '▼ ' + Math.abs(change) + '% more attempts';
        q('[data-sec-sub]', c).innerHTML = 'Unauthorized attempts <b>' + fmt(nowDeny) + '</b> vs <b>' + fmt(prevDeny) + '</b> in the ' + perLabel;
      }
    }

    // Approval rate for the selected period
    var okSum = data.ok.reduce(function(a, b){ return a + b; }, 0), all = okSum + nowDeny;
    var rate = all ? Math.round(okSum / all * 100) : null;
    q('[data-rate]', c).textContent = rate === null ? '–' : rate + '%';
    q('[data-rate-bar]', c).style.width = (rate || 0) + '%';
    q('[data-rate-sub]', c).textContent = all ? fmt(okSum) + ' of ' + fmt(all) + ' scans authorized' : 'No scans in this period';
  }

  var liveEl = q('[data-live]'), liveText = q('[data-live-text]'), last = null;
  function load(){
    if(!root.isConnected){ clearInterval(timer); return; }
    var bks = buckets(), from = bks[0].from, to = bks[bks.length - 1].to;
    var prevFrom = new Date(from.getTime() - (to.getTime() - from.getTime()));
    var monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
    var safe = function(p, dflt){ return p.catch(function(){ return dflt; }); };
    var empty = { values:bks.map(function(){ return null; }), unit:'', last:null };
    Promise.all([
      safe(seriesData(DEVICES.mosquito, bks), empty),
      safe(seriesData(DEVICES.water, bks), empty),
      safe(seriesData(DEVICES.soil, bks), empty),
      safe(countAlarms(DEVICES.trap, from, to), null),
      safe(countAlarms(DEVICES.trap, null, null, 'ACTIVE'), 0),
      safe(countAlarms(DEVICES.mosquito, null, null, 'ACTIVE'), 0),
      safe(countAlarms(DEVICES.soil, null, null, 'ACTIVE'), 0),
      safe(Promise.all(bks.map(function(b){ return countEvents(DEVICES.permitOk, b); })), null),
      safe(Promise.all(bks.map(function(b){ return countEvents(DEVICES.permitDeny, b); })), null),
      safe(seriesData(DEVICES.trap, bks), empty),
      safe(countRange(DEVICES.permitOk, monthStart, new Date()), 0),
      safe(countRange(DEVICES.permitDeny, monthStart, new Date()), 0),
      safe(countRange(DEVICES.permitDeny, prevFrom, from), null)
    ]).then(function(r){
      demo = r[3] === null && r[7] === null;
      var data = demo ? sample(bks) : {
        mosq:r[0], water:r[1], soil:r[2], trapAlarms:r[3], trapActive:r[4], mosqActive:r[5], soilActive:r[6],
        ok:r[7] || bks.map(function(){ return 0; }), deny:r[8] || bks.map(function(){ return 0; }),
        trapLast:r[9].last ? fmt(r[9].last.v) + ' ' + (r[9].last.unit || '') : null,
        monthOk:r[10], monthDeny:r[11], prevDeny:r[12]
      };
      last = { data:data, bks:bks };
      render(data, bks);
      liveEl.className = 'sga-live ' + (demo ? 'is-demo' : 'is-on');
      liveText.textContent = demo ? 'Sample data (preview)' : 'Live · updated ' + new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });
    });
  }

  root.querySelectorAll('[data-range]').forEach(function(btn){
    btn.addEventListener('click', function(){
      if(btn.classList.contains('is-active')) return;
      root.querySelectorAll('[data-range]').forEach(function(b){ b.classList.toggle('is-active', b === btn); });
      range = btn.getAttribute('data-range'); liveText.textContent = 'Loading…'; load();
    });
  });
  var rT; window.addEventListener('resize', function(){ clearTimeout(rT); rT = setTimeout(function(){ if(last) render(last.data, last.bks); }, 200); });
  // Redraw the charts whenever the widget itself changes size (edit mode, sidebar, new page),
  // so the labels never look stretched.
  var lastW = 0;
  if(window.ResizeObserver){
    new ResizeObserver(function(){
      var w = Math.round(root.getBoundingClientRect().width);
      if(!w || Math.abs(w - lastW) < 4) return;
      lastW = w; clearTimeout(rT);
      rT = setTimeout(function(){ if(last) render(last.data, last.bks); }, 150);
    }).observe(root);
  }

  load();
  var timer = setInterval(load, REFRESH_MS);
}

function applySection(root){
  var keep = SECTION_CARDS[SECTION];
  if(!keep) return;
  root.querySelectorAll('[data-card]').forEach(function(c){
    if(keep.indexOf(c.getAttribute('data-card')) < 0) c.style.display = 'none';
  });
  root.querySelector('.sga-title').textContent = SECTION_TITLE[SECTION];
  if(keep.length === 2) root.querySelector('.sga-grid').style.gridTemplateColumns = 'repeat(2,minmax(0,1fr))';
}

export default class SmartGuardianDataAnalysis extends HTMLElement {
  connectedCallback() {
    if (this.__init) return;
    this.__init = true;
    var shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = '<style>:host{display:block}</style>' + TEMPLATE;
    var root = shadow.querySelector('.sga');
    applySection(root);
    requestAnimationFrame(function(){ sgaInit(root); });
  }
}
