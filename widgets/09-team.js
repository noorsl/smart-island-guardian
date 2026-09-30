// Smart Guardian - The Island Guardians (team)
// Advanced developer mode -> Web Component tab -> delete everything -> paste this

// Edit names, roles or sections here. cat = device section the card opens: security, pest, env (all = whole devices widget).
const TEAM = [
  { g: 'f', en: 'Team Member 1', ar: 'عضو الفريق 1',
    callsign: 'The Architect', role: 'Platform Builder & Device Installer', zone: 'Command Center',
    story: 'Built most of the Smart Guardian platform and installed the devices.',
    cat: 'all' },
  { g: 'm', en: 'Team Member 2', ar: 'عضو الفريق 2',
    callsign: 'The Gatekeeper', role: 'Island Entry Permit Officer', zone: 'Main Gate',
    story: 'Guards every permit at the island gate. No permit, no entry.',
    cat: 'security' },
  { g: 'f', en: 'Team Member 3', ar: 'عضو الفريق 3',
    callsign: 'The Watchman', role: 'Alarm Response Officer', zone: 'Alarm Desk',
    story: 'Hears every alarm before it rings twice.',
    cat: 'pest' },
  { g: 'f', en: 'Team Member 4', ar: 'عضو الفريق 4',
    callsign: 'The Voice', role: 'Monitor & Presentations Officer', zone: 'Visitor Center',
    story: 'Keeps watch over the island and leads every Smart Guardian presentation.',
    cat: 'pest' },
  { g: 'f', en: 'Team Member 5', ar: 'عضو الفريق 5',
    callsign: 'The Builder', role: 'Field Systems Officer', zone: 'Sensor Grid',
    story: 'Keeps the sensor grid wired and the workflow flowing.',
    cat: 'env' },
  { g: 'f', en: 'Team Member 6', ar: 'عضو الفريق 6',
    callsign: 'The Coder', role: 'Interface Support Officer', zone: 'Control Room',
    story: 'Shapes the interface and keeps a device talking to the platform.',
    cat: 'env' }
];

// Managers: name only, no post, no shift, no link.
const MANAGERS = [
  { en: 'Supervisor 1', ar: 'المشرف 1' },
  { en: 'Supervisor 2', ar: 'المشرف 2' }
];

const ALERT_LABEL = { all: 'All alarms', security: 'Security alarms', pest: 'Pest control alarms', env: 'Environmental alarms' };
const SECTION_LABEL = { all: 'All devices', security: 'Security & Access', pest: 'Pest Control', env: 'Environmental' };

const TEMPLATE = `
<div class="sgt" data-sg-anchor="team">
  <div class="sgt-head">
    <div>
      <p class="sgt-kicker">One team · on watch 24/7</p>
      <h2 class="sgt-title">The Island Guardians</h2>
      <p class="sgt-ar" dir="rtl" lang="ar">حرّاس الجزيرة… فريق واحد يحرس الجزيرة على مدار الساعة</p>
    </div>
    <div class="sgt-roll"><span class="sgt-dot"></span><b data-count>7</b> guardians on duty</div>
  </div>
  <div class="sgt-grid" data-grid></div>
  <div class="sgt-mgr-wrap">
    <p class="sgt-mgr-kicker">Under the guidance of · بإشراف</p>
    <div class="sgt-mgr" data-mgr></div>
  </div>
  <div class="sgt-toast" data-toast></div>
</div>

<style>
.sgt{
  --bg:oklch(.975 .01 91);--fg:oklch(.36 .072 213);--card:oklch(.998 .002 90);--primary:oklch(.46 .09 210);
  --muted:oklch(.968 .008 210);--mfg:oklch(.49 .055 183);--border:oklch(.91 .014 220);--pos:oklch(.52 .13 158);
  --gold:oklch(.82 .11 85);--navy:oklch(.28 .06 226);
  --shadow:0 2px 12px oklch(.28 .035 225 / 7%);--shadow-h:0 18px 36px oklch(.28 .035 225 / 16%);
  position:relative;font-family:"DM Sans",system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--fg);line-height:1.5;
  background:var(--bg);border:1px solid var(--border);border-radius:14px;padding:26px 24px 24px}
.sgt *{box-sizing:border-box}
:where(.sgt) :where(h2,h3,p){margin:0}
:where(.sgt) button{font:inherit;cursor:pointer;border:0;background:none;color:inherit}

.sgt-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:12px;margin-bottom:20px}
.sgt-kicker{font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--primary)}
.sgt-title{margin-top:4px;font-family:Manrope,inherit;font-size:26px;font-weight:800;letter-spacing:-.01em;color:var(--fg)}
.sgt-ar{margin-top:2px;font-size:15px;font-weight:600;color:var(--mfg);font-family:"Segoe UI",Tahoma,sans-serif;text-align:left}
.sgt-roll{display:inline-flex;align-items:center;gap:8px;padding:7px 14px;border-radius:99px;background:var(--card);border:1px solid var(--border);font-size:13px;color:var(--mfg)}
.sgt-roll b{color:var(--fg)}
.sgt-dot{width:9px;height:9px;border-radius:50%;background:var(--pos);animation:sgtPulse 1.8s infinite}
@keyframes sgtPulse{0%{box-shadow:0 0 0 0 oklch(.52 .13 158 / 60%)}70%{box-shadow:0 0 0 8px transparent}100%{box-shadow:0 0 0 0 transparent}}

.sgt-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(175px,1fr));gap:12px}
.sgt-card{position:relative;display:flex;flex-direction:column;overflow:hidden;border:1px solid var(--border);border-radius:14px;
  background:var(--card);box-shadow:var(--shadow);transition:transform .3s,box-shadow .3s;animation:sgtIn .6s ease both}
.sgt-card:hover{transform:translateY(-6px) rotate(-.4deg);box-shadow:var(--shadow-h)}
@keyframes sgtIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}

.sgt-band{position:relative;height:50px;background:linear-gradient(120deg,#123f4a,#1d5a63,#0f3a44);overflow:hidden}
.sgt-band::after{content:"";position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,rgba(243,212,138,.25) 50%,transparent 70%);
  transform:translateX(-100%);transition:transform .9s}
.sgt-card:hover .sgt-band::after{transform:translateX(100%)}
.sgt-badge-no{position:absolute;left:10px;top:7px;font-size:8.5px;font-weight:800;letter-spacing:.16em;color:rgba(255,255,255,.75)}
.sgt-hole{display:none;position:absolute;left:50%;top:4px;width:34px;height:7px;margin-left:-17px;border-radius:99px;background:rgba(255,255,255,.22)}

.sgt-avatar{position:relative;width:56px;height:56px;margin:-28px auto 0;border-radius:50%;display:grid;place-items:center;
  background:var(--card);box-shadow:0 6px 16px oklch(.28 .04 225 / 20%)}
.sgt-avatar::before{content:"";position:absolute;inset:-4px;border-radius:50%;border:2px dashed var(--gold);animation:sgtSpin 14s linear infinite}
.sgt-card:hover .sgt-avatar::before{animation-duration:3s}
@keyframes sgtSpin{to{transform:rotate(360deg)}}
.sgt-avatar span{width:47px;height:47px;border-radius:50%;display:grid;place-items:center;color:#fff;font-size:16px;font-weight:800;letter-spacing:.02em}

.sgt-body{padding:8px 11px 12px;text-align:center;display:flex;flex-direction:column;flex:1}
.sgt-name{font-size:13px;font-weight:800;color:var(--fg);line-height:1.3}
.sgt-name-ar{font-size:12px;font-weight:600;color:var(--mfg);font-family:"Segoe UI",Tahoma,sans-serif}
.sgt-call{display:inline-block;margin:6px auto 0;padding:2px 9px;border-radius:99px;background:oklch(.82 .11 85 / 22%);
  color:oklch(.45 .09 70);font-size:10.5px;font-weight:800;font-style:italic}
.sgt-rows{margin-top:8px;display:grid;gap:3px;text-align:left;font-size:10.5px;color:var(--mfg)}
.sgt-rows div{display:flex;justify-content:space-between;gap:6px;padding:4px 7px;border-radius:8px;background:var(--muted)}
.sgt-rows b{color:var(--fg);font-weight:700;text-align:right}
.sgt-stars{color:var(--gold);letter-spacing:1px}
.sgt-duty{display:inline-flex;align-items:center;gap:6px;color:var(--pos);font-weight:800}
.sgt-duty i{width:7px;height:7px;border-radius:50%;background:var(--pos);animation:sgtPulse 1.8s infinite}

.sgt-story{max-height:0;opacity:0;overflow:hidden;font-size:11px;color:var(--mfg);line-height:1.5;transition:max-height .4s,opacity .4s,margin .4s}
.sgt-card:hover .sgt-story{max-height:90px;opacity:1;margin-top:10px}
.sgt-go{margin-top:auto;padding-top:9px}
.sgt-go button{width:100%;padding:6px 8px;border-radius:8px;border:1px solid var(--border);background:var(--card);
  font-size:11px;font-weight:800;color:var(--primary);transition:all .2s}
.sgt-go button:hover{background:var(--primary);border-color:var(--primary);color:#fff}

.sgt-card{cursor:pointer}
.sgt-mgr-wrap{margin-top:22px;padding-top:18px;border-top:1px dashed var(--border)}
.sgt-mgr-kicker{font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--primary);margin-bottom:12px}
.sgt-mgr{display:flex;flex-wrap:wrap;gap:14px}
.sgt-mgr-card{display:flex;align-items:center;gap:10px;min-width:200px;padding:9px 14px 9px 9px;border:1px solid var(--border);border-radius:14px;
  background:var(--card);box-shadow:var(--shadow);animation:sgtIn .6s ease both}
.sgt-mgr-card span{width:38px;height:38px;flex:none;border-radius:50%;display:grid;place-items:center;color:var(--navy);font-weight:800;font-size:16px;
  background:linear-gradient(135deg,oklch(.9 .08 85),var(--gold));box-shadow:0 0 0 3px var(--card),0 0 0 4px oklch(.82 .11 85 / 60%)}
.sgt-mgr-card b{display:block;font-size:13px;color:var(--fg)}
.sgt-mgr-card em{display:block;font-style:normal;font-size:12px;color:var(--mfg);font-family:"Segoe UI",Tahoma,sans-serif}
.sgt-toast{position:absolute;left:50%;bottom:16px;transform:translate(-50%,10px);opacity:0;z-index:5;padding:8px 14px;border-radius:8px;
  background:var(--navy);color:#fff;font-size:12px;transition:.3s;pointer-events:none}
.sgt-toast.show{opacity:1;transform:translate(-50%,0)}

@media (max-width:600px){.sgt{padding:18px 14px}.sgt-title{font-size:24px}}
@media (hover:none){.sgt-story{max-height:none;opacity:1;margin-top:10px}}
@media (prefers-reduced-motion:reduce){.sgt *{animation:none!important;transition:none!important}}
</style>
`;

const AVATAR_COLORS = ['#1d5a63', '#00809e', '#2a7482', '#b8770a', '#3f6f8f', '#9c4a2f', '#4b6b3a'];

function sgtInit(root, host){
  var grid = root.querySelector('[data-grid]'), toastEl = root.querySelector('[data-toast]');
  root.querySelector('[data-count]').textContent = TEAM.length;

  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(ch){ return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[ch]; }); }
  function initials(name){ var p = name.split(' ').filter(Boolean); return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase(); }
  function pad(n){ return ('00' + n).slice(-3); }

  grid.innerHTML = TEAM.map(function(m, i){
    return '<article class="sgt-card" data-i="' + i + '" style="animation-delay:' + (i * 0.07) + 's">' +
      '<div class="sgt-band"><span class="sgt-hole"></span><span class="sgt-badge-no">GUARDIAN #' + pad(i + 1) + '</span>' +
        '</div>' +
      '<div class="sgt-avatar"><span style="background:' + AVATAR_COLORS[i % AVATAR_COLORS.length] + '">' + esc(initials(m.en)) + '</span></div>' +
      '<div class="sgt-body">' +
        '<h3 class="sgt-name">' + esc(m.en) + '</h3>' +
        '<p class="sgt-name-ar" dir="rtl" lang="ar">' + esc(m.ar) + '</p>' +
        (m.callsign ? '<span class="sgt-call">“' + esc(m.callsign) + '”</span>' : '') +
        '<div class="sgt-rows">' +
          '<div><span>Post</span><b>' + esc(m.role) + '</b></div>' +
          (m.zone ? '<div><span>Station</span><b>' + esc(m.zone) + '</b></div>' : '') +
          '<div><span>Monitors</span><b>' + esc(ALERT_LABEL[m.cat] || 'Alarms') + '</b></div>' +
          '<div><span>Clearance</span><b class="sgt-stars">★★★★★</b></div>' +
          '<div><span>Shift</span><span class="sgt-duty"><i></i>24/7 · ON DUTY</span></div>' +
        '</div>' +
        (m.story ? '<p class="sgt-story">' + esc(m.story) + '</p>' : '') +
        '<div class="sgt-go"><button data-i="' + i + '">' + esc(SECTION_LABEL[m.cat] || 'Our IoT Devices') + ' ↓</button></div>' +
      '</div></article>';
  }).join('');

  root.querySelector('[data-mgr]').innerHTML = MANAGERS.map(function(m, i){
    return '<div class="sgt-mgr-card" style="animation-delay:' + (0.5 + i * 0.08) + 's"><span>' + esc(initials(m.en)) + '</span>' +
      '<div><b>' + esc(m.en) + '</b><em dir="rtl" lang="ar">' + esc(m.ar) + '</em></div></div>';
  }).join('');

  function toast(msg){ toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(toastEl.t);
    toastEl.t = setTimeout(function(){ toastEl.classList.remove('show'); }, 2200); }

  function deepFind(start, test){
    var stack = [start];
    while(stack.length){
      var node = stack.shift();
      var all = node.querySelectorAll ? node.querySelectorAll('*') : [];
      for(var i = 0; i < all.length; i++){
        var el = all[i];
        if(test(el)) return el;
        if(el.shadowRoot) stack.push(el.shadowRoot);
      }
    }
    return null;
  }
  function norm(s){ return String(s || '').split(String.fromCharCode(10)).join(' ').split(' ').filter(Boolean).join(' ').toLowerCase(); }
  function isMine(el){ return el === host || host.contains(el); }
  function outerCard(el){
    var node = el;
    while(node){
      if(node.tagName === 'C8Y-DASHBOARD-CHILD') return node;
      node = node.parentNode;
      if(node && node.nodeType === 11) node = node.host;
    }
    return el;
  }
  function flash(el){
    var old = el.style.boxShadow, oldT = el.style.transition;
    el.style.transition = 'box-shadow .4s';
    el.style.boxShadow = '0 0 0 3px #f3d48a, 0 0 26px rgba(243,212,138,.6)';
    setTimeout(function(){ el.style.boxShadow = old; setTimeout(function(){ el.style.transition = oldT; }, 400); }, 1600);
  }

  function findSection(cat){
    if(cat && cat !== 'all'){
      var sec = deepFind(document, function(el){ return el.classList && el.classList.contains('iot-cat') && el.getAttribute('data-cat') === cat; });
      if(sec) return { el:sec, inner:true };
    }
    var w = deepFind(document, function(el){ return el.getAttribute && el.getAttribute('data-sg-anchor') === 'iot-devices'; }) ||
            deepFind(document, function(el){ return ['H1', 'H2', 'H3'].indexOf(el.tagName) > -1 && norm(el.textContent) === 'our iot devices' && !isMine(el); });
    return w ? { el:w, inner:false } : null;
  }

  grid.addEventListener('click', function(e){
    var card = e.target.closest('[data-i]'); if(!card) return;
    var m = TEAM[+card.getAttribute('data-i')];
    var hit = findSection(m.cat);
    if(!hit){
      try{ sessionStorage.setItem('sg-jump', JSON.stringify({ cat:m.cat, t:Date.now() })); }catch(err){}
      location.hash = '#/home';
      return;
    }
    var box = hit.inner ? hit.el : outerCard(hit.el);
    box.scrollIntoView({ behavior:'smooth', block:'start' });
    setTimeout(function(){ flash(box); }, 550);
  });
}

export default class SmartGuardianTeam extends HTMLElement {
  connectedCallback() {
    if (this.__init) return;
    this.__init = true;
    var shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = '<style>:host{display:block}</style>' + TEMPLATE;
    sgtInit(shadow.querySelector('.sgt'), this);
  }
}
