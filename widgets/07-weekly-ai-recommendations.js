// Smart Guardian - Weekly AI Recommendations (Agentic AI weekly summary & recommendations)
// Advanced developer mode -> Web Component tab -> delete everything -> paste this
// Devices are matched by exact name (same list as the Our IoT Devices widget).
const DEVICE_NAMES = {
  access:   ['Permit reader: Authorized', 'Permit reader: Unauthorized'],
  camera:   ['Perimeter Security Camera'],
  door:     ['Door Forced Open Sensor'],
  tamper:   ['Security Temper Sensoer', 'Security Tamper Sensor'],
  mosquito: ['Smart Mosquito Sensor'],
  rodent:   ['Smart Pest Trap'],
  water:    ['Water Level Sensor #1'],
  soil:     ['Soil Moisture sensor #1'],
};
const CATEGORY_CARDS = {
  security: ['access', 'camera', 'door', 'tamper'],
  pest:     ['mosquito', 'rodent'],
  env:      ['water', 'soil'],
};
const CATEGORY_LABEL = { security: 'Security & Access', pest: 'Pest Control', env: 'Environmental' };
const CATEGORY_COLOR = { security: '#1d4e5b', pest: '#d9534f', env: '#1f8a5b' };
const DAY_MS = 24 * 3600 * 1000;

const STYLES = `
:host{display:block}
.wr{--fg:#1d4e5b;--muted:#5b7f82;--border:#dde8ea;--card:#fffffd;--surface:#f6f9f9;--gold:#f3d48a;
  font-family:"DM Sans","Segoe UI",Helvetica,Arial,sans-serif;color:var(--fg);line-height:1.5;
  background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden}
.wr *{box-sizing:border-box}
.wr h2,.wr h3,.wr p,.wr ul{margin:0;padding:0}
.wr ul{list-style:none}
.wr button{font:inherit;cursor:pointer}
.wr-hero{position:relative;padding:26px 28px 22px;color:#fff;background:linear-gradient(120deg,#123f4a,#1d5a63,#0f3a44)}
.wr-hero::after{content:"";position:absolute;right:-120px;top:-160px;width:380px;height:380px;border-radius:50%;
  background:radial-gradient(circle,rgba(243,212,138,.22),transparent 70%);pointer-events:none}
.wr-top{position:relative;z-index:1;display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:14px}
.wr-kicker{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--gold)}
.wr-kicker svg{width:14px;height:14px;fill:currentColor}
.wr-title{margin-top:6px!important;font-size:30px;font-weight:800;letter-spacing:-.01em}
.wr-sub{margin-top:4px!important;font-size:14px;color:#cfe8e6}
.wr-sub-ar{margin-top:2px!important;font-size:14px;color:var(--gold);font-weight:600;font-family:"Segoe UI",Tahoma,sans-serif}
.wr-weeks{display:flex;padding:3px;border-radius:99px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25)}
.wr-weeks button{border:0;background:none;color:#e6f3f2;padding:6px 14px;border-radius:99px;font-size:12.5px;font-weight:700}
.wr-weeks button.on{background:#fff;color:#123f4a}
.wr-body{padding:22px 28px 26px}
.wr-meta{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;font-size:13px;color:var(--muted);margin-bottom:14px}
.wr-meta b{color:var(--fg)}
.wr-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.wr-kpi{padding:14px 16px;border:1px solid var(--border);border-radius:14px;background:var(--card);box-shadow:0 2px 12px rgba(20,45,60,.06);animation:wrIn .5s ease both}
.wr-kpi strong{display:block;font-size:28px;font-weight:800;line-height:1.15}
.wr-kpi span{font-size:12.5px;color:var(--muted)}
.wr-kpi em{display:block;font-style:normal;font-size:11.5px;color:var(--muted);margin-top:4px}
.wr-kpi.is-critical strong{color:#c0392b}
@keyframes wrIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.wr-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:18px;margin-top:18px}
.wr-panel{padding:18px;border:1px solid var(--border);border-radius:14px;background:var(--card)}
.wr-h{font-size:15px;font-weight:800;margin-bottom:12px!important;display:flex;justify-content:space-between;align-items:center;gap:8px}
.wr-h small{font-size:11.5px;font-weight:600;color:var(--muted)}
.wr-area{padding:10px 0;border-top:1px solid var(--border)}
.wr-area:first-of-type{border-top:0}
.wr-area-top{display:flex;justify-content:space-between;align-items:center;font-size:13.5px;font-weight:700}
.wr-area-top i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:8px}
.wr-bar{height:8px;margin-top:7px;border-radius:99px;background:#edf3f4;overflow:hidden}
.wr-bar span{display:block;height:100%;border-radius:99px;width:0;transition:width 1s ease}
.wr-area-nums{display:flex;gap:14px;margin-top:6px;font-size:12px;color:var(--muted)}
.wr-area-nums b{color:var(--fg)}
.wr-counts{display:flex;gap:8px;flex-wrap:wrap}
.wr-count{padding:3px 10px;border-radius:99px;font-size:11.5px;font-weight:800;text-transform:uppercase;letter-spacing:.04em}
.wr-recs{display:grid;gap:10px}
.wr-rec{display:flex;gap:12px;align-items:flex-start;padding:12px 14px;border:1px solid var(--border);border-radius:12px;background:#fff;animation:wrIn .5s ease both;transition:transform .2s,box-shadow .2s}
.wr-rec:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(20,45,60,.1)}
.wr-pill{flex:none;min-width:70px;text-align:center;padding:3px 8px;border-radius:99px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.05em}
.is-high{background:#fde2e3;color:#b3262c}
.is-medium{background:#fdefd9;color:#9a5a0c}
.is-low{background:#e1f0f2;color:#1d5e69}
.wr-rec-title{font-weight:800;font-size:14px}
.wr-rec-area{font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);margin-top:1px!important}
.wr-rec-detail{font-size:13px;color:#3c5a60;margin-top:5px!important}
.wr-note{margin-top:14px!important;font-size:12px;color:var(--muted)}
.wr-msg{padding:30px;text-align:center;color:var(--muted);font-size:14px}
@media (max-width:1000px){.wr-grid{grid-template-columns:1fr}.wr-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (prefers-reduced-motion:reduce){.wr *{animation:none!important;transition:none!important}}
`;

const MARKUP = `
<section class="wr" data-sg-anchor="weekly-recommendations">
  <div class="wr-hero">
    <div class="wr-top">
      <div>
        <p class="wr-kicker"><svg viewBox="0 0 24 24"><path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z"/></svg>Agentic AI</p>
        <h2 class="wr-title">Weekly AI Recommendations</h2>
        <p class="wr-sub">Weekly summary and recommendations generated by the Smart Guardian agent.</p>
        <p class="wr-sub-ar" dir="rtl" lang="ar">ملخص أسبوعي وتوصيات ذكية لتشغيل أكثر استدامة</p>
      </div>
      <div class="wr-weeks" role="tablist">
        <button class="on" data-week="0">This week</button>
        <button data-week="1">Last week</button>
      </div>
    </div>
  </div>
  <div class="wr-body" data-body><p class="wr-msg">Analysing the last 7 days…</p></div>
</section>
`;

/* ---------- helpers ---------- */

function readCookie(name) {
  const hit = document.cookie.split('; ').find((row) => row.startsWith(name + '='));
  return hit ? decodeURIComponent(hit.split('=')[1]) : '';
}

async function getJson(url) {
  const res = await fetch(url, {
    credentials: 'same-origin',
    headers: { Accept: 'application/json', 'X-XSRF-TOKEN': readCookie('XSRF-TOKEN') },
  });
  if (!res.ok) throw new Error(url + ' -> HTTP ' + res.status);
  return res.json();
}

const SEVERITY_ORDER = ['CRITICAL', 'MAJOR', 'MINOR', 'WARNING'];

function worstSeverity(alarms) {
  return SEVERITY_ORDER.find((sev) => alarms.some((a) => a.severity === sev));
}

function plural(n, word) {
  return n + ' ' + word + (n === 1 ? '' : 's');
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function deviceUrl(id) {
  // Opens the device page inside the current Cumulocity app (Cockpit)
  return window.location.pathname + '#/device/' + encodeURIComponent(id);
}

function repeats(alarm) {
  return alarm.count || 1;
}

function hoursSince(iso) {
  return Math.round((Date.now() - new Date(iso).getTime()) / 3600000);
}

function shortDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}


export default class WeeklyAiReview extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' }).innerHTML = '<style>' + STYLES + '</style>' + MARKUP;
      this.shadowRoot.addEventListener('click', (event) => {
        const b = event.target.closest('[data-week]');
        if (!b) return;
        this.shadowRoot.querySelectorAll('[data-week]').forEach((x) => x.classList.toggle('on', x === b));
        this.offset = Number(b.dataset.week);
        this.run();
      });
    }
    this.offset = 0;
    this.run();
  }

  async run() {
    const body = this.shadowRoot.querySelector('[data-body]');
    body.innerHTML = '<p class="wr-msg">Analysing the last 7 days…</p>';
    try {
      const week = await this.loadWeek(this.offset);
      body.innerHTML = this.html(week);
      requestAnimationFrame(() => {
        body.querySelectorAll('[data-w]').forEach((el) => { el.style.width = el.dataset.w + '%'; });
      });
    } catch (err) {
      console.warn('[Weekly AI Recommendations] data not loaded:', err);
      body.innerHTML = '<p class="wr-msg">Could not load this week’s data from Cumulocity.</p>';
    }
  }

  async loadDevices() {
    const inv = await getJson('/inventory/managedObjects?fragmentType=c8y_IsDevice&pageSize=2000&withTotalPages=false');
    const byName = {};
    Object.keys(DEVICE_NAMES).forEach((key) => {
      DEVICE_NAMES[key].forEach((name) => { byName[name.trim().toLowerCase()] = key; });
    });
    const list = [];
    (inv.managedObjects || []).forEach((mo) => {
      const key = byName[(mo.name || '').trim().toLowerCase()];
      if (key) list.push({ mo, key });
    });
    return list;
  }

  async loadWeek(offset) {
    const to = new Date(Date.now() - offset * 7 * DAY_MS);
    const from = new Date(to.getTime() - 7 * DAY_MS);
    const range = 'dateFrom=' + encodeURIComponent(from.toISOString()) + '&dateTo=' + encodeURIComponent(to.toISOString());
    const [devices, alm, evt] = await Promise.all([
      this.loadDevices(),
      getJson('/alarm/alarms?' + range + '&pageSize=2000&withTotalPages=false'),
      getJson('/event/events?' + range + '&pageSize=2000&withTotalPages=false'),
    ]);
    const ids = new Set(devices.map((d) => d.mo.id));
    return {
      from, to, devices,
      alarms: (alm.alarms || []).filter((a) => a.source && ids.has(a.source.id)),
      events: (evt.events || []).filter((e) => e.source && ids.has(e.source.id)),
    };
  }

  analyse(week) {
    const { devices, alarms, events } = week;
    const keyOf = {};
    const nameOf = {};
    devices.forEach(({ mo, key }) => { keyOf[mo.id] = key; nameOf[mo.id] = mo.name || mo.id; });
    const catOf = (key) => Object.keys(CATEGORY_CARDS).find((c) => CATEGORY_CARDS[c].includes(key));

    const raised = alarms.reduce((sum, a) => sum + repeats(a), 0);
    const critical = alarms.filter((a) => a.severity === 'CRITICAL').reduce((sum, a) => sum + repeats(a), 0);
    const open = alarms.filter((a) => a.status !== 'CLEARED');

    const perCat = {};
    Object.keys(CATEGORY_CARDS).forEach((c) => { perCat[c] = { alarms: 0, critical: 0, open: 0, events: 0 }; });
    alarms.forEach((a) => {
      const c = perCat[catOf(keyOf[a.source.id])];
      c.alarms += repeats(a);
      if (a.severity === 'CRITICAL') c.critical += repeats(a);
      if (a.status !== 'CLEARED') c.open += 1;
    });
    events.forEach((e) => { perCat[catOf(keyOf[e.source.id])].events += 1; });

    const recs = [];
    const add = (priority, area, title, detail) => recs.push({ priority, area, title, detail });

    // 1. Critical alarms left open for more than a day
    open.filter((a) => a.severity === 'CRITICAL' && hoursSince(a.creationTime || a.time) >= 24).forEach((a) => {
      add('high', CATEGORY_LABEL[catOf(keyOf[a.source.id])],
        'Add an escalation step for ' + nameOf[a.source.id],
        'Critical alarm “' + (a.text || a.type) + '” has been open for ' + hoursSince(a.creationTime || a.time) +
        ' h. Let the agent escalate to the on-call team if a critical alarm is not acknowledged within 30 min.');
    });

    // 2. Noisy alarms (same alarm repeated many times)
    alarms.filter((a) => repeats(a) >= 5).sort((a, b) => repeats(b) - repeats(a)).slice(0, 3).forEach((a) => {
      add(a.severity === 'CRITICAL' ? 'high' : 'medium', CATEGORY_LABEL[catOf(keyOf[a.source.id])],
        'Tune the threshold on ' + nameOf[a.source.id],
        '“' + (a.text || a.type) + '” keeps re-triggering this week. Have the agent group repeats into one incident and review the trigger threshold.');
    });

    // 3. Unauthorized access + camera correlation
    const unauthorized = devices.filter(({ mo }) => /unauthori[sz]ed/i.test(mo.name || '')).map(({ mo }) => mo.id);
    const denied = alarms.filter((a) => unauthorized.includes(a.source.id)).reduce((s, a) => s + repeats(a), 0);
    const cameraAlerts = alarms.filter((a) => keyOf[a.source.id] === 'camera').reduce((s, a) => s + repeats(a), 0);
    if (denied > 0) {
      add(cameraAlerts > 0 ? 'high' : 'medium', 'Security & Access', 'Correlate denied entries with camera footage',
        'Repeated unauthorized permit attempts' + (cameraAlerts ? ' together with camera alerts' : '') +
        ' this week.'+' The agent should attach the nearest camera clip to every denied entry before notifying security.');
    }

    // 4. Pest control follow-up
    const mosquito = alarms.filter((a) => keyOf[a.source.id] === 'mosquito').reduce((s, a) => s + repeats(a), 0);
    const rodent = alarms.filter((a) => keyOf[a.source.id] === 'rodent').reduce((s, a) => s + repeats(a), 0);
    if (mosquito > 0) {
      add(mosquito >= 3 ? 'medium' : 'low', 'Pest Control', 'Auto-create spraying tasks',
        'Mosquito activity stayed high this week. Let the agent open a spraying work order when activity stays high for two readings in a row.');
    }
    if (rodent > 0) {
      add('medium', 'Pest Control', 'Dispatch technicians from trap alerts',
        'The animal control trap reported captures this week. The agent can assign the nearest technician and close the alarm once the trap is serviced.');
    }

    // 5. Environmental follow-up
    const env = alarms.filter((a) => ['water', 'soil'].includes(keyOf[a.source.id])).reduce((s, a) => s + repeats(a), 0);
    if (env > 0) {
      add('medium', 'Environmental', 'Link sensor alerts to irrigation and water supply',
        'Water and soil sensors raised alerts this week. Let the agent adjust the irrigation schedule on low soil moisture and alert utilities on low water level.');
    }

    // 6. Silent devices
    const heard = new Set(alarms.concat(events).map((x) => x.source.id));
    const silent = devices.filter(({ mo }) => !heard.has(mo.id));
    if (silent.length) {
      add('medium', 'Data quality', 'Check silent devices',
        silent.map(({ mo }) => mo.name).join(', ') + ' sent no events or alarms in 7 days. The agent cannot act on devices it does not hear from.');
    }

    // 7. Availability monitoring
    const unmonitored = devices.filter(({ mo }) => !mo.c8y_RequiredAvailability);
    if (unmonitored.length) {
      add('low', 'Data quality', 'Enable availability monitoring',
        plural(unmonitored.length, 'device') + ' have no required interval set, so outages are invisible. Set one in Device management so the agent can detect offline devices.');
    }

    // 8. Warning noise
    const warnings = alarms.filter((a) => a.severity === 'WARNING').reduce((s, a) => s + repeats(a), 0);
    if (raised >= 5 && warnings / raised >= 0.6) {
      add('low', 'Alarm noise', 'Send warnings as a daily digest',
        Math.round((warnings / raised) * 100) + '% of this week’s alarms were warnings. Have the agent summarise them once a day instead of notifying on each one.');
    }

    if (!recs.length) {
      add('low', 'General', 'No issues found this week', 'Alarms were low and every device reported. A good time to add predictive rules, for example forecasting low water levels.');
    }

    const rank = { high: 0, medium: 1, low: 2 };
    recs.sort((a, b) => rank[a.priority] - rank[b.priority]);
    return { raised, critical, open: open.length, events: events.length, perCat, recs: recs.slice(0, 8) };
  }


  html(week) {
    const r = this.analyse(week);
    const fmt = (n) => Number(n).toLocaleString('en-US');
    const keyOf = {};
    week.devices.forEach(({ mo, key }) => { keyOf[mo.id] = key; });
    const catOf = (key) => Object.keys(CATEGORY_CARDS).find((c) => CATEGORY_CARDS[c].includes(key));

    // Incidents = distinct alarms; raw triggers = every repeat counted.
    const incidents = week.alarms.length;
    const criticalIncidents = week.alarms.filter((a) => a.severity === 'CRITICAL').length;
    const perCat = {};
    Object.keys(CATEGORY_CARDS).forEach((c) => { perCat[c] = { incidents: 0, raw: 0, open: r.perCat[c].open, events: r.perCat[c].events }; });
    week.alarms.forEach((a) => { const c = perCat[catOf(keyOf[a.source.id])]; c.incidents += 1; c.raw += repeats(a); });
    const maxInc = Math.max(1, ...Object.keys(perCat).map((c) => perCat[c].incidents));

    const tile = (value, label, extra, cls) =>
      '<div class="wr-kpi ' + (cls || '') + '"><strong>' + value + '</strong><span>' + label + '</span>' + (extra ? '<em>' + extra + '</em>' : '') + '</div>';
    const areas = Object.keys(CATEGORY_CARDS).map((c) => {
      const x = perCat[c];
      return '<div class="wr-area"><div class="wr-area-top"><span><i style="background:' + CATEGORY_COLOR[c] + '"></i>' + CATEGORY_LABEL[c] + '</span><span>' + plural(x.incidents, 'incident') + '</span></div>' +
        '<div class="wr-bar"><span data-w="' + Math.round((x.incidents / maxInc) * 100) + '" style="background:' + CATEGORY_COLOR[c] + '"></span></div>' +
        '<div class="wr-area-nums"><span><b>' + x.open + '</b> still open</span><span><b>' + fmt(x.events) + '</b> events</span></div></div>';
    }).join('');
    const count = (p) => r.recs.filter((x) => x.priority === p).length;
    const recs = r.recs.map((rec, i) =>
      '<li class="wr-rec" style="animation-delay:' + (i * 0.06) + 's"><span class="wr-pill is-' + rec.priority + '">' + rec.priority + '</span>' +
      '<div><p class="wr-rec-title">' + escapeHtml(rec.title) + '</p><p class="wr-rec-area">' + escapeHtml(rec.area) + '</p>' +
      '<p class="wr-rec-detail">' + escapeHtml(rec.detail) + '</p></div></li>').join('');

    return '<div class="wr-meta"><span><b>' + shortDate(week.from) + ' – ' + shortDate(week.to) + '</b> · ' + plural(week.devices.length, 'device') + ' analysed</span>' +
        '<span>Generated ' + new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) + '</span></div>' +
      '<div class="wr-kpis">' +
        tile(fmt(incidents), 'Alarm incidents', 'Distinct alarms this week') +
        tile(fmt(criticalIncidents), 'Critical incidents', 'Need fast response', 'is-critical') +
        tile(fmt(r.open), 'Still open', 'Waiting for action') +
        tile(fmt(r.events), 'Events', 'Permits, traps and sensor events') +
      '</div>' +
      '<div class="wr-grid">' +
        '<div class="wr-panel"><h3 class="wr-h">Activity by area <small>7 days</small></h3>' + areas +
          '<p class="wr-note">Each alarm is counted once, even if the sensor repeats it.</p></div>' +
        '<div class="wr-panel"><h3 class="wr-h">Recommendations for the agent <span class="wr-counts">' +
          '<span class="wr-count is-high">' + count('high') + ' high</span><span class="wr-count is-medium">' + count('medium') + ' medium</span><span class="wr-count is-low">' + count('low') + ' low</span></span></h3>' +
          '<ul class="wr-recs">' + recs + '</ul></div>' +
      '</div>';
  }
}
