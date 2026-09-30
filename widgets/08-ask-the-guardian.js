// Smart Guardian - Ask the Guardian (assistant prototype)
// Advanced developer mode -> Web Component tab -> delete everything -> paste this
// Answers questions from live Cumulocity data with rules. Next step: connect a language model.
import { fetch as c8yFetch } from 'fetch';

const DEV = {
  water: 'WATER_LEVEL_DEVICE_ID', soil: 'SOIL_MOISTURE_DEVICE_ID', mosquito: 'MOSQUITO_DEVICE_ID', trap: 'ANIMAL_TRAP_DEVICE_ID',
  permitOk: 'PERMIT_AUTHORIZED_DEVICE_ID', permitDeny: 'PERMIT_UNAUTHORIZED_DEVICE_ID', door: 'DOOR_SENSOR_DEVICE_ID', camera: 'CAMERA_DEVICE_ID', tamper: 'TAMPER_SENSOR_DEVICE_ID'
};
const ALL = ['WATER_LEVEL_DEVICE_ID', 'SOIL_MOISTURE_DEVICE_ID', 'MOSQUITO_DEVICE_ID', 'ANIMAL_TRAP_DEVICE_ID', 'PERMIT_AUTHORIZED_DEVICE_ID', 'PERMIT_UNAUTHORIZED_DEVICE_ID', 'DOOR_SENSOR_DEVICE_ID', 'CAMERA_DEVICE_ID', 'TAMPER_SENSOR_DEVICE_ID'];
const SECURITY = ['PERMIT_AUTHORIZED_DEVICE_ID', 'PERMIT_UNAUTHORIZED_DEVICE_ID', 'DOOR_SENSOR_DEVICE_ID', 'CAMERA_DEVICE_ID', 'TAMPER_SENSOR_DEVICE_ID'];
const NAMES = {
  'WATER_LEVEL_DEVICE_ID': 'Water level sensor', 'SOIL_MOISTURE_DEVICE_ID': 'Soil moisture sensor', 'MOSQUITO_DEVICE_ID': 'Mosquito sensor', 'ANIMAL_TRAP_DEVICE_ID': 'Animal control trap',
  'PERMIT_AUTHORIZED_DEVICE_ID': 'Permit reader (authorized)', 'PERMIT_UNAUTHORIZED_DEVICE_ID': 'Permit reader (unauthorized)', 'DOOR_SENSOR_DEVICE_ID': 'Door sensor', 'CAMERA_DEVICE_ID': 'Perimeter camera', 'TAMPER_SENSOR_DEVICE_ID': 'Tamper sensor'
};
const NAMES_AR = {
  'WATER_LEVEL_DEVICE_ID': 'حساس المياه', 'SOIL_MOISTURE_DEVICE_ID': 'حساس التربة', 'MOSQUITO_DEVICE_ID': 'حساس البعوض', 'ANIMAL_TRAP_DEVICE_ID': 'مصيدة الحيوانات',
  'PERMIT_AUTHORIZED_DEVICE_ID': 'قارئ التصاريح المقبولة', 'PERMIT_UNAUTHORIZED_DEVICE_ID': 'قارئ التصاريح المرفوضة', 'DOOR_SENSOR_DEVICE_ID': 'حساس الباب', 'CAMERA_DEVICE_ID': 'كاميرا المحيط', 'TAMPER_SENSOR_DEVICE_ID': 'حساس التلاعب'
};
const SENSORS = {
  water: { device: 'WATER_LEVEL_DEVICE_ID', frag: 'WaterLevel', series: 'waterLevel', limit: 30, dir: 'below' },
  soil: { device: 'SOIL_MOISTURE_DEVICE_ID', frag: 'soilMoisture', series: 'moisture', limit: 30, dir: 'below' },
  mosquito: { device: 'MOSQUITO_DEVICE_ID', frag: 'Mosquito', series: 'Activity', limit: 8, dir: 'above' }
};
const SUGGEST = [
  'How is the island right now?', 'What should we do now?', 'Water level?', 'Any security issues?', 'Mosquito activity?', 'وش وضع الجزيرة؟'
];

const TEMPLATE = `
<div class="gsa" data-sg-anchor="assistant">
  <div class="gsa-head">
    <span class="gsa-orb"><i></i></span>
    <div>
      <h2 class="gsa-title">Ask the Guardian</h2>
      <p class="gsa-sub">Prototype assistant · answers from live Cumulocity data · English or Arabic</p>
    </div>
    <span class="gsa-badge">v1 · rule-based</span>
  </div>
  <div class="gsa-chat" data-chat aria-live="polite"></div>
  <div class="gsa-chips" data-chips></div>
  <form class="gsa-form" data-form>
    <input id="gsa-input" data-input type="text" autocomplete="off" placeholder="Ask about water, soil, pests, security, alarms… / اسأل بالعربي">
    <button type="submit">Ask</button>
  </form>
  <p class="gsa-foot">Next step: connect a language model so the Guardian understands any question.</p>
</div>
<style>
.gsa{--ink:#2f2416;--muted:#6f5a3c;--sand:#f1e7d4;--paper:#fbf6ec;--line:#e2d3b6;--teal:#1d5a63;--good:#2e8b57;--warn:#b7791f;--bad:#b3261e;
  font-family:"Segoe UI",system-ui,-apple-system,sans-serif;color:var(--ink);background:var(--sand);border:1px solid var(--line);border-radius:16px;padding:20px 22px;line-height:1.5}
.gsa *{box-sizing:border-box}
.gsa h2,.gsa p{margin:0}
.gsa-head{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.gsa-title{font-family:Georgia,"Times New Roman",serif;font-size:24px;font-weight:700}
.gsa-sub{font-size:12.5px;color:var(--muted)}
.gsa-badge{margin-left:auto;font-size:11px;font-weight:700;letter-spacing:.06em;color:var(--teal);border:1px solid var(--teal);border-radius:99px;padding:3px 10px}
.gsa-orb{position:relative;width:34px;height:34px;flex:none;border-radius:50%;background:conic-gradient(#c9a46a,#1d5a63,#c9a46a);animation:gsaSpin 4s linear infinite}
.gsa-orb i{position:absolute;inset:5px;border-radius:50%;background:var(--sand)}
@keyframes gsaSpin{to{transform:rotate(360deg)}}
.gsa-chat{margin-top:16px;display:flex;flex-direction:column;gap:10px;max-height:380px;min-height:120px;overflow:auto;padding:4px 2px}
.gsa-msg{max-width:85%;padding:10px 14px;border-radius:14px;font-size:14px;white-space:pre-line}
.gsa-bot{align-self:flex-start;background:var(--paper);border:1px solid var(--line);border-top-left-radius:4px}
.gsa-me{align-self:flex-end;background:var(--teal);color:#fff;border-top-right-radius:4px}
.gsa-msg[dir="rtl"]{font-family:"Segoe UI",Tahoma,sans-serif}
.gsa-bot b{color:var(--teal)}
.gsa-typing{display:inline-flex;gap:4px}
.gsa-typing i{width:6px;height:6px;border-radius:50%;background:var(--muted);animation:gsaDot 1s infinite}
.gsa-typing i:nth-child(2){animation-delay:.15s}.gsa-typing i:nth-child(3){animation-delay:.3s}
@keyframes gsaDot{0%,100%{opacity:.25}50%{opacity:1}}
.gsa-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
.gsa-chip{font:inherit;font-size:12.5px;font-weight:600;padding:6px 12px;border-radius:99px;border:1px solid var(--line);background:var(--paper);color:var(--ink);cursor:pointer}
.gsa-chip:hover{border-color:var(--teal);color:var(--teal)}
.gsa-form{display:flex;gap:8px;margin-top:12px}
.gsa-form input{flex:1;min-width:0;font:inherit;font-size:14px;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:#fff;color:var(--ink)}
.gsa-form input:focus{outline:2px solid var(--teal);outline-offset:1px}
.gsa-form button{font:inherit;font-weight:700;padding:10px 18px;border:0;border-radius:10px;background:var(--ink);color:var(--sand);cursor:pointer}
.gsa-foot{margin-top:10px;font-size:11.5px;color:var(--muted)}
@media (prefers-reduced-motion:reduce){.gsa *{animation:none!important}}
</style>
`;

function gsaInit(root){
  var chat = root.querySelector('[data-chat]'), input = root.querySelector('[data-input]');
  var cache = null, cacheAt = 0;

  function headers(){
    var h = { Accept: 'application/json' };
    try{ var t = localStorage.getItem('_tcy1') || sessionStorage.getItem('_tcy1'); if(t) h.Authorization = 'Basic ' + t; }catch(e){}
    var m = document.cookie.split('; ').filter(function(c){ return c.indexOf('XSRF-TOKEN=') === 0; })[0];
    if(m) h['X-XSRF-TOKEN'] = m.split('=')[1];
    return h;
  }
  function api(path){
    var call;
    try{ call = c8yFetch(path, { method: 'GET', headers: { Accept: 'application/json' } }); }catch(e){ call = null; }
    if(!call || !call.then) call = fetch(path, { headers: headers(), credentials: 'include' });
    return call.then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); });
  }
  function safe(p, d){ return p.catch(function(){ return d; }); }
  function iso(d){ return d.toISOString(); }
  function isArabic(s){
    for(var i = 0; i < s.length; i++){ var c = s.charCodeAt(i); if(c >= 1536 && c <= 1791) return true; }
    return false;
  }
  function has(t, words){ return words.some(function(w){ return t.indexOf(w) > -1; }); }
  function ago(t, ar){
    var m = Math.max(0, Math.round((Date.now() - new Date(t).getTime()) / 60000));
    if(ar) return m < 60 ? 'قبل ' + m + ' دقيقة' : 'قبل ' + Math.round(m / 60) + ' ساعة';
    return m < 1 ? 'just now' : m < 60 ? m + ' min ago' : Math.round(m / 60) + ' h ago';
  }
  function r1(v){ return Math.round(v * 10) / 10; }

  function latest(sn){
    var from = new Date(Date.now() - 7 * 86400000);
    return api('/measurement/measurements?source=' + sn.device + '&valueFragmentType=' + sn.frag + '&valueFragmentSeries=' + sn.series +
      '&dateFrom=' + iso(from) + '&dateTo=' + iso(new Date(Date.now() + 60000)) + '&pageSize=12&revert=true')
      .then(function(r){
        var pts = (r.measurements || []).map(function(m){ var x = m[sn.frag] && m[sn.frag][sn.series]; return x ? { v: Number(x.value), t: m.time } : null; }).filter(Boolean);
        if(!pts.length) return null;
        var first = pts[pts.length - 1], last = pts[0];
        var hours = Math.max(0.25, (new Date(last.t) - new Date(first.t)) / 3600000);
        return { v: last.v, t: last.t, trend: pts.length > 1 ? (last.v - first.v) / hours : 0 };
      });
  }
  function countEvents(id, from){
    return api('/event/events?source=' + id + '&dateFrom=' + iso(from) + '&dateTo=' + iso(new Date()) + '&pageSize=1&withTotalPages=true')
      .then(function(r){ return (r.statistics && r.statistics.totalPages) || 0; });
  }
  function load(){
    if(cache && Date.now() - cacheAt < 30000) return Promise.resolve(cache);
    var midnight = new Date(); midnight.setHours(0, 0, 0, 0);
    return Promise.all([
      Promise.all(ALL.map(function(id){ return safe(api('/alarm/alarms?source=' + id + '&status=ACTIVE&pageSize=20').then(function(r){ return r.alarms || []; }), []); })),
      safe(latest(SENSORS.water), null), safe(latest(SENSORS.soil), null), safe(latest(SENSORS.mosquito), null),
      safe(api('/event/events?source=' + DEV.trap + '&pageSize=1&revert=true&dateFrom=1970-01-01').then(function(r){ return (r.events || [])[0] || null; }), null),
      safe(countEvents(DEV.permitOk, midnight), null), safe(countEvents(DEV.permitDeny, midnight), null)
    ]).then(function(r){
      var alarms = [].concat.apply([], r[0]);
      cache = { alarms: alarms, water: r[1], soil: r[2], mosquito: r[3], trap: r[4], ok: r[5], deny: r[6] };
      cacheAt = Date.now();
      return cache;
    });
  }
  function risk(d){
    var w = { CRITICAL: 22, MAJOR: 10, MINOR: 5, WARNING: 3 }, s = 0;
    d.alarms.forEach(function(a){ s += w[a.severity] || 0; });
    if(d.water && d.water.v < SENSORS.water.limit) s += 10;
    if(d.soil && d.soil.v < SENSORS.soil.limit) s += 10;
    if(d.mosquito && d.mosquito.v >= SENSORS.mosquito.limit) s += 10;
    return Math.min(100, Math.round(s));
  }
  function trapBusy(d){ return !!(d.trap && String(d.trap.text || '').toLowerCase().indexOf('rodent detected') > -1); }
  function trendWord(t, ar){
    if(Math.abs(t) < 0.3) return ar ? 'مستقر' : 'stable';
    return t > 0 ? (ar ? 'في ارتفاع' : 'rising') : (ar ? 'في انخفاض' : 'falling');
  }

  // ---------- answers ----------
  var A = {
    water: function(d, ar){
      var x = d.water; if(!x) return ar ? 'ما وصلتني قراءة حديثة من حساس المياه.' : 'I have no recent reading from the water level sensor.';
      var low = x.v < SENSORS.water.limit, v = r1(x.v);
      if(ar) return 'مستوى المياه في الخزان **' + v + '%** (' + trendWord(x.trend, true) + ')، آخر قراءة ' + ago(x.t, true) + '.\n' + (low ? 'أقل من الحد 30%، أنصح بجدولة تعبئة الخزان.' : 'ضمن المستوى الآمن، ما يحتاج تعبئة الحين.');
      return 'The lagoon reservoir is at **' + v + '%** and ' + trendWord(x.trend) + ' (last reading ' + ago(x.t) + ').\n' + (low ? 'That is below the 30% limit. I recommend scheduling a refill.' : 'It is above the 30% limit, so no refill is needed right now.');
    },
    soil: function(d, ar){
      var x = d.soil; if(!x) return ar ? 'ما وصلتني قراءة حديثة من حساس التربة.' : 'I have no recent reading from the soil moisture sensor.';
      var low = x.v < SENSORS.soil.limit, v = r1(x.v);
      if(ar) return 'رطوبة التربة في المشتل **' + v + '%** (' + trendWord(x.trend, true) + ').\n' + (low ? 'أقل من 30%، أنصح بتشغيل الري.' : 'ضمن الطبيعي، ما يحتاج ري إضافي الحين.');
      return 'Soil moisture in the nursery is **' + v + '%** and ' + trendWord(x.trend) + '.\n' + (low ? 'It is below 30%. I recommend starting irrigation.' : 'That is within the normal range. No extra irrigation is needed now.');
    },
    mosquito: function(d, ar){
      var x = d.mosquito; if(!x) return ar ? 'ما وصلتني قراءة حديثة من حساس البعوض.' : 'I have no recent reading from the mosquito sensor.';
      var hi = x.v >= SENSORS.mosquito.limit, v = r1(x.v);
      if(ar) return 'نشاط البعوض في المنطقة الشمالية الشرقية **' + v + '** (الحد 8).\n' + (hi ? 'النشاط عالي، أنصح بأمر رش موجّه للمنطقة.' : 'النشاط طبيعي حالياً.');
      return 'Mosquito activity in the northeast zone is **' + v + '** (limit 8).\n' + (hi ? 'Activity is high. I recommend a targeted spraying order for that zone.' : 'Activity is normal right now.');
    },
    trap: function(d, ar){
      if(!d.trap) return ar ? 'ما فيه أحداث حديثة من المصيدة.' : 'There are no recent events from the animal control trap.';
      var busy = trapBusy(d);
      if(ar) return busy ? 'المصيدة **فيها حيوان** (' + ago(d.trap.time, true) + '). أنصح بإرسال أقرب فني لخدمتها.' : 'المصيدة **فاضية** وجاهزة.';
      return busy ? 'The animal control trap **has a capture** (' + ago(d.trap.time) + '). I recommend sending the nearest technician to service it.' : 'The animal control trap is **empty** and ready.';
    },
    security: function(d, ar){
      var sec = d.alarms.filter(function(a){ return SECURITY.indexOf(a.source && a.source.id) > -1; });
      var crit = sec.filter(function(a){ return a.severity === 'CRITICAL'; });
      var lines = sec.slice(0, 4).map(function(a){ return '• ' + (ar ? NAMES_AR[a.source.id] : NAMES[a.source.id]) + ': ' + a.text; });
      var permits = d.ok !== null ? (ar ? '\nالتصاريح اليوم: ' + d.ok + ' مقبولة و' + (d.deny || 0) + ' مرفوضة.' : '\nPermits today: ' + d.ok + ' authorized, ' + (d.deny || 0) + ' denied.') : '';
      if(!sec.length) return (ar ? 'ما فيه إنذارات أمنية مفتوحة. البوابات والكاميرا والأبواب طبيعية.' : 'No security alarms are open. Gates, camera and doors look normal.') + permits;
      if(ar) return 'فيه **' + sec.length + '** إنذارات أمنية مفتوحة، منها **' + crit.length + '** حرجة:\n' + lines.join('\n') + permits + (crit.length ? '\nأنصح بتصعيدها للحارس المناوب.' : '');
      return 'There are **' + sec.length + '** open security alarms, **' + crit.length + '** of them critical:\n' + lines.join('\n') + permits + (crit.length ? '\nI recommend escalating to the on-call guardian.' : '');
    },
    alarms: function(d, ar){
      var by = { CRITICAL: 0, MAJOR: 0, MINOR: 0, WARNING: 0 };
      d.alarms.forEach(function(a){ if(by[a.severity] !== undefined) by[a.severity]++; });
      if(!d.alarms.length) return ar ? 'ما فيه إنذارات مفتوحة. الجزيرة هادية.' : 'There are no open alarms. The island is calm.';
      var top = d.alarms.slice().sort(function(a, b){ return (b.severity === 'CRITICAL') - (a.severity === 'CRITICAL'); })[0];
      if(ar) return 'فيه **' + d.alarms.length + '** إنذارات مفتوحة: ' + by.CRITICAL + ' حرجة، ' + by.MAJOR + ' مهمة، ' + by.WARNING + ' تنبيه.\nالأهم: ' + NAMES_AR[top.source.id] + ' — ' + top.text + '.';
      return 'There are **' + d.alarms.length + '** open alarms: ' + by.CRITICAL + ' critical, ' + by.MAJOR + ' major, ' + by.WARNING + ' warning.\nMost urgent: ' + NAMES[top.source.id] + ', “' + top.text + '”.';
    },
    overview: function(d, ar){
      var sc = risk(d), lvl = sc >= 60 ? (ar ? 'عالي' : 'high') : sc >= 30 ? (ar ? 'متوسط' : 'moderate') : (ar ? 'منخفض' : 'low');
      var crit = d.alarms.filter(function(a){ return a.severity === 'CRITICAL'; }).length;
      var bits = [];
      if(d.water) bits.push(ar ? 'المياه ' + r1(d.water.v) + '%' : 'water ' + r1(d.water.v) + '%');
      if(d.soil) bits.push(ar ? 'التربة ' + r1(d.soil.v) + '%' : 'soil ' + r1(d.soil.v) + '%');
      if(d.mosquito) bits.push(ar ? 'البعوض ' + r1(d.mosquito.v) : 'mosquito ' + r1(d.mosquito.v));
      bits.push(trapBusy(d) ? (ar ? 'المصيدة ممتلئة' : 'trap occupied') : (ar ? 'المصيدة فاضية' : 'trap empty'));
      if(ar) return 'مؤشر خطر الجزيرة **' + sc + '/100** (' + lvl + ').\nالإنذارات المفتوحة: ' + d.alarms.length + ' (منها ' + crit + ' حرجة).\nالقراءات: ' + bits.join('، ') + '.\nاسألني "وش نسوي الحين؟" وأعطيك الأولويات.';
      return 'Island risk score is **' + sc + '/100** (' + lvl + ').\nOpen alarms: ' + d.alarms.length + ' (' + crit + ' critical).\nReadings: ' + bits.join(', ') + '.\nAsk me “What should we do now?” for priorities.';
    },
    todo: function(d, ar){
      var list = [];
      var crit = d.alarms.filter(function(a){ return a.severity === 'CRITICAL'; }).length;
      if(crit) list.push(ar ? 'صعّد ' + crit + ' إنذارات أمنية حرجة للحارس المناوب' : 'Escalate ' + crit + ' critical security alarm' + (crit > 1 ? 's' : '') + ' to the on-call guardian');
      if(d.mosquito && d.mosquito.v >= SENSORS.mosquito.limit) list.push(ar ? 'أمر رش موجّه في المنطقة الشمالية الشرقية' : 'Approve a targeted spraying order in the northeast zone');
      if(trapBusy(d)) list.push(ar ? 'إرسال فني لخدمة المصيدة' : 'Send a technician to service the animal trap');
      if(d.water && d.water.v < SENSORS.water.limit) list.push(ar ? 'جدولة تعبئة الخزان' : 'Schedule a reservoir refill');
      if(d.soil && d.soil.v < SENSORS.soil.limit) list.push(ar ? 'تشغيل الري في المشتل' : 'Start irrigation in the nursery');
      if(!list.length) return ar ? 'ما فيه شي عاجل الحين. كل القراءات طبيعية.' : 'Nothing urgent right now. All readings are within their normal range.';
      var body = list.map(function(x, i){ return (i + 1) + '. ' + x; }).join('\n');
      return (ar ? 'الأولويات حسب الخطورة:\n' : 'Here is what I would do, most urgent first:\n') + body +
        (ar ? '\nتقدر توافق على الإجراءات من صفحة AI Forecast & Actions.' : '\nYou can approve these actions on the AI Forecast & Actions page.');
    },
    help: function(d, ar){
      return ar ? 'أقدر أجاوب عن: المياه، التربة، البعوض، المصيدة، الأمن والتصاريح، الإنذارات، ووضع الجزيرة العام. وأقدر أقول لك وش الأولويات الحين.'
        : 'I can answer about water, soil, mosquitoes, the animal trap, security and permits, alarms, and the island’s overall status. I can also tell you what to do first.';
    }
  };
  var INTENTS = [
    ['todo', ['what should', 'what to do', 'priorit', 'recommend', 'next', 'action', 'وش نسوي', 'وش أسوي', 'ايش نسوي', 'أولوي', 'توصي', 'اقتراح', 'نسوي']],
    ['water', ['water', 'reservoir', 'lagoon', 'refill', 'مياه', 'موية', 'ماء', 'خزان']],
    ['soil', ['soil', 'irrigat', 'nursery', 'plant', 'moisture', 'تربة', 'الري', 'سقي', 'مشتل', 'رطوبة', 'نبات']],
    ['mosquito', ['mosquito', 'spray', 'insect', 'بعوض', 'رش', 'حشر']],
    ['trap', ['trap', 'animal', 'rodent', 'capture', 'مصيدة', 'حيوان', 'فأر']],
    ['security', ['security', 'permit', 'gate', 'access', 'door', 'camera', 'tamper', 'intru', 'أمن', 'تصريح', 'تصاريح', 'بوابة', 'باب', 'كاميرا', 'دخول', 'تلاعب']],
    ['alarms', ['alarm', 'alert', 'critical', 'إنذار', 'انذار', 'تنبيه']],
    ['overview', ['island', 'status', 'overview', 'summary', 'how is', 'risk', 'everything', 'وضع', 'ملخص', 'الجزيرة', 'خطر', 'كيف']],
    ['help', ['help', 'what can you', 'مساعد', 'وش تقدر', 'ايش تقدر']]
  ];
  function intentOf(t){
    for(var i = 0; i < INTENTS.length; i++){ if(has(t, INTENTS[i][1])) return INTENTS[i][0]; }
    return null;
  }

  // ---------- chat ui ----------
  function bubble(who, ar){
    var el = document.createElement('div'); el.className = 'gsa-msg ' + (who === 'me' ? 'gsa-me' : 'gsa-bot');
    if(ar) el.setAttribute('dir', 'rtl');
    chat.appendChild(el); chat.scrollTop = chat.scrollHeight; return el;
  }
  function fmt(text){
    var span = document.createElement('span'); span.textContent = text;
    return span.innerHTML.split('**').map(function(p, i){ return i % 2 ? '<b>' + p + '</b>' : p; }).join('');
  }
  function typeInto(el, text){
    var html = fmt(text), plain = text.split('**').join(''), i = 0;
    el.textContent = '';
    var t = setInterval(function(){
      i += 3; el.textContent = plain.slice(0, i); chat.scrollTop = chat.scrollHeight;
      if(i >= plain.length){ clearInterval(t); el.innerHTML = html; }
    }, 16);
  }
  function ask(q){
    q = String(q || '').trim(); if(!q) return;
    var ar = isArabic(q);
    bubble('me', ar).textContent = q;
    var bot = bubble('bot', ar); bot.innerHTML = '<span class="gsa-typing"><i></i><i></i><i></i></span>';
    var intent = intentOf(q.toLowerCase());
    load().then(function(d){
      var text = intent ? A[intent](d, ar)
        : (ar ? 'ما فهمت السؤال تماماً. أنا نسخة أولى وأفهم أسئلة عن المياه، التربة، البعوض، المصيدة، الأمن، والإنذارات.'
              : 'I did not fully understand that. I am a first version and I understand questions about water, soil, mosquitoes, the trap, security and alarms.');
      setTimeout(function(){ typeInto(bot, text); }, 450);
    }).catch(function(){
      bot.textContent = ar ? 'ما قدرت أوصل لبيانات Cumulocity الحين.' : 'I could not reach Cumulocity data right now.';
    });
  }

  var chips = root.querySelector('[data-chips]');
  SUGGEST.forEach(function(s){
    var b = document.createElement('button'); b.type = 'button'; b.className = 'gsa-chip'; b.textContent = s;
    if(isArabic(s)) b.setAttribute('dir', 'rtl');
    b.addEventListener('click', function(){ ask(s); });
    chips.appendChild(b);
  });
  root.querySelector('[data-form]').addEventListener('submit', function(e){ e.preventDefault(); var v = input.value; input.value = ''; ask(v); });

  var hello = bubble('bot', false);
  typeInto(hello, 'Hi, I am the Guardian assistant. Ask me about the island, or tap a question below.');
}

export default class SmartGuardianAssistant extends HTMLElement {
  connectedCallback() {
    if (this.__init) return;
    this.__init = true;
    var shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = '<style>:host{display:block}</style>' + TEMPLATE;
    gsaInit(shadow.querySelector('.gsa'));
  }
}
