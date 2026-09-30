// Smart Guardian - How It Works
// Advanced developer mode -> JavaScript tab -> delete everything -> paste this

const TEMPLATE = `
<div class="sgw" id="sg-how" data-sg-anchor="how-it-works">
  <div class="sgw-head">
    <div>
      <p class="sgw-kicker">From signal to action</p>
      <h2 class="sgw-title">How It Works</h2>
    </div>
    <p class="sgw-lead">Every reading travels the same path in seconds.</p>
  </div>

  <div class="sgw-flow">
    <article class="sgw-step is-active" data-step="0">
      <span class="sgw-icon"><svg viewBox="0 0 24 24"><path d="M2 12 7 2M17 2l5 10M4.5 7h15M12 12v10"/></svg></span>
      <div><p class="sgw-num">01</p><h3>IoT Devices</h3><p class="sgw-desc">Collect and send real-time data</p><p class="sgw-detail">9 field sensors across the island</p></div>
    </article>
    <div class="sgw-link" aria-hidden="true"><i></i></div>
    <article class="sgw-step" data-step="1">
      <span class="sgw-icon"><svg viewBox="0 0 24 24"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg></span>
      <div><p class="sgw-num">02</p><h3>Cumulocity IoT</h3><p class="sgw-desc">Stores and visualizes data</p><p class="sgw-detail">Measurements, events, alarms</p></div>
    </article>
    <div class="sgw-link" aria-hidden="true"><i></i></div>
    <article class="sgw-step" data-step="2">
      <span class="sgw-icon"><svg viewBox="0 0 24 24"><path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7Z"/></svg></span>
      <div><p class="sgw-num">03</p><h3>Agentic AI</h3><p class="sgw-desc">Analyzes data, predicts issues</p><p class="sgw-detail">Finds patterns, recommends actions</p></div>
    </article>
    <div class="sgw-link" aria-hidden="true"><i></i></div>
    <article class="sgw-step" data-step="3">
      <span class="sgw-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/></svg></span>
      <div><p class="sgw-num">04</p><h3>Action &amp; Operations</h3><p class="sgw-desc">Alerts teams, optimizes resources</p><p class="sgw-detail">Work orders and priorities</p></div>
    </article>
  </div>

  <div class="sgw-example">
    <div class="sgw-ex-tabs">
      <span class="sgw-ex-label">Example</span>
      <button class="sgw-ex-tab is-active" data-ex="0">Pest Control</button>
      <button class="sgw-ex-tab" data-ex="1">Security &amp; Access</button>
      <button class="sgw-ex-tab" data-ex="2">Environmental</button>
    </div>
    <ol class="sgw-ex-steps" data-ex-panel="0">
      <li><b>Smart Mosquito Sensor</b> reports high activity</li>
      <li>Alarm raised in the <b>northeast zone</b></li>
      <li>AI sees activity high <b>two readings in a row</b></li>
      <li><b>Spraying work order</b> sent to the pest team</li>
    </ol>
    <ol class="sgw-ex-steps" data-ex-panel="1" hidden>
      <li><b>Permit Reader</b> scans an unauthorized permit</li>
      <li>Denied entry logged as an <b>event</b></li>
      <li>AI attaches the nearest <b>camera clip</b></li>
      <li><b>Security team</b> notified with evidence</li>
    </ol>
    <ol class="sgw-ex-steps" data-ex-panel="2" hidden>
      <li><b>Soil Moisture Sensor</b> reads below threshold</li>
      <li>Warning alarm in the <b>nursery zone</b></li>
      <li>AI checks <b>water level</b> and weather trend</li>
      <li><b>Irrigation schedule</b> adjusted automatically</li>
    </ol>
  </div>
</div>

<style>
.sgw{
  --bg:oklch(.968 .008 210);--fg:oklch(.36 .072 213);--card:oklch(.998 .002 90);--primary:oklch(.46 .09 210);
  --accent:oklch(.91 .04 202);--accent-fg:oklch(.42 .09 180);--mfg:oklch(.49 .055 183);--subtle:oklch(.59 .055 83);
  --border:oklch(.91 .014 220);--gold:oklch(.82 .11 85);
  --shadow:0 2px 12px oklch(.28 .035 225 / 7%);--shadow-h:0 14px 30px oklch(.28 .035 225 / 14%);
  font-family:"DM Sans",system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--fg);line-height:1.5;
  background:var(--bg);border:1px solid var(--border);border-radius:14px;padding:26px 24px 24px}
.sgw *{box-sizing:border-box}
.sgw h2,.sgw h3,.sgw p,.sgw ol{margin:0;padding:0}
.sgw button{font:inherit;cursor:pointer;background:none;border:0;color:inherit}

.sgw-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:10px;margin-bottom:20px}
.sgw-kicker{font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--primary)}
.sgw-title{margin-top:4px!important;font-family:Manrope,inherit;font-size:30px;font-weight:800;letter-spacing:-.01em;color:var(--fg)}
.sgw-lead{font-size:14px;font-weight:500;color:var(--mfg)}

.sgw-flow{display:flex;align-items:stretch}
.sgw-step{flex:1;min-width:0;display:flex;align-items:center;gap:14px;padding:16px;border:1px solid var(--border);border-radius:12px;
  background:var(--card);box-shadow:var(--shadow);transition:transform .35s,box-shadow .35s,border-color .35s;animation:sgwIn .6s ease both;cursor:default}
.sgw-step:nth-of-type(1){animation-delay:.05s}.sgw-step:nth-of-type(2){animation-delay:.2s}
.sgw-step:nth-of-type(3){animation-delay:.35s}.sgw-step:nth-of-type(4){animation-delay:.5s}
@keyframes sgwIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.sgw-step:hover,.sgw-step.is-active{transform:translateY(-4px);box-shadow:var(--shadow-h);border-color:var(--primary)}
.sgw-icon{display:grid;place-items:center;width:50px;height:50px;flex:none;border-radius:50%;background:var(--accent);color:var(--accent-fg);
  transition:background .35s,color .35s}
.sgw-step.is-active .sgw-icon{background:var(--primary);color:#fff;animation:sgwRing 1.8s infinite}
@keyframes sgwRing{0%{box-shadow:0 0 0 0 oklch(.46 .09 210 / 45%)}70%{box-shadow:0 0 0 10px transparent}100%{box-shadow:0 0 0 0 transparent}}
.sgw-icon svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.sgw-num{font-size:11px;font-weight:800;color:var(--primary)}
.sgw-step h3{margin-top:1px!important;font-size:15px;font-weight:700;color:var(--fg)}
.sgw-desc{margin-top:3px!important;font-size:12.5px;color:var(--mfg);line-height:1.5}
.sgw-detail{margin-top:3px!important;font-size:11px;color:var(--subtle)}

.sgw-link{position:relative;flex:0 0 34px;align-self:center;height:2px;margin:0 4px;
  background:repeating-linear-gradient(90deg,var(--primary) 0 5px,transparent 5px 9px);opacity:.55}
.sgw-link::after{content:"";position:absolute;right:-2px;top:-4px;border:5px solid transparent;border-left:7px solid var(--primary);border-right:0}
.sgw-link i{position:absolute;top:-3px;left:0;width:8px;height:8px;border-radius:50%;background:var(--gold);
  box-shadow:0 0 8px var(--gold);animation:sgwDot 1.6s linear infinite}
@keyframes sgwDot{from{left:-4px;opacity:0}15%{opacity:1}85%{opacity:1}to{left:calc(100% - 4px);opacity:0}}

.sgw-example{margin-top:18px;padding:14px 16px;border:1px dashed var(--border);border-radius:12px;background:var(--card)}
.sgw-ex-tabs{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:12px}
.sgw-ex-label{font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--subtle);margin-right:4px}
.sgw-ex-tab{padding:5px 12px!important;border-radius:99px;border:1px solid var(--border)!important;font-size:12px!important;font-weight:700!important;
  color:var(--mfg)!important;transition:all .2s}
.sgw-ex-tab:hover{border-color:var(--primary)!important;color:var(--primary)!important}
.sgw-ex-tab.is-active{background:var(--primary)!important;border-color:var(--primary)!important;color:#fff!important}
.sgw-ex-steps[hidden]{display:none!important}
.sgw-ex-steps{list-style:none;display:grid;grid-template-columns:repeat(4,1fr);gap:10px;counter-reset:ex}
.sgw-ex-steps li{counter-increment:ex;position:relative;padding:10px 12px 10px 38px;border-radius:10px;background:var(--bg);
  font-size:12.5px;color:var(--mfg);line-height:1.45;animation:sgwIn .45s ease both}
.sgw-ex-steps li b{color:var(--fg)}
.sgw-ex-steps li::before{content:counter(ex);position:absolute;left:10px;top:10px;width:20px;height:20px;border-radius:50%;
  display:grid;place-items:center;background:var(--accent);color:var(--accent-fg);font-size:11px;font-weight:800}
.sgw-ex-steps li:nth-child(2){animation-delay:.08s}.sgw-ex-steps li:nth-child(3){animation-delay:.16s}.sgw-ex-steps li:nth-child(4){animation-delay:.24s}
.sgw-ex-steps li.is-active{background:oklch(.46 .09 210 / 10%);box-shadow:inset 0 0 0 1px oklch(.46 .09 210 / 35%)}
.sgw-ex-steps li.is-active::before{background:var(--primary);color:#fff}

@media (max-width:1000px){
  .sgw-flow{flex-direction:column}
  .sgw-link{flex:0 0 26px;width:2px;height:26px;margin:4px 0 4px 40px;
    background:repeating-linear-gradient(180deg,var(--primary) 0 5px,transparent 5px 9px)}
  .sgw-link::after{right:auto;left:-4px;top:auto;bottom:-2px;border:5px solid transparent;border-top:7px solid var(--primary);border-bottom:0}
  .sgw-link i{left:-3px;animation-name:sgwDotV}
  .sgw-ex-steps{grid-template-columns:1fr 1fr}
}
@keyframes sgwDotV{from{top:-4px;opacity:0}15%{opacity:1}85%{opacity:1}to{top:calc(100% - 4px);opacity:0}}
@media (max-width:560px){.sgw{padding:18px 14px}.sgw-title{font-size:24px}.sgw-ex-steps{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){.sgw *{animation:none!important;transition:none!important}}
</style>
`;

function sgwInit(root){
  if(!root || root.__sgwReady) return; root.__sgwReady = true;
  var steps = [].slice.call(root.querySelectorAll('.sgw-step'));
  var tabs = [].slice.call(root.querySelectorAll('.sgw-ex-tab'));
  var panels = [].slice.call(root.querySelectorAll('.sgw-ex-steps'));
  var cur = 0, ex = 0, paused = false;
  function show(i){
    cur = i;
    steps.forEach(function(s, k){ s.classList.toggle('is-active', k === i); });
    var lis = panels[ex].querySelectorAll('li');
    [].forEach.call(lis, function(li, k){ li.classList.toggle('is-active', k === i); });
  }
  tabs.forEach(function(t){
    t.addEventListener('click', function(){
      ex = +t.getAttribute('data-ex');
      tabs.forEach(function(x){ x.classList.toggle('is-active', x === t); });
      panels.forEach(function(p, k){ p.hidden = k !== ex; });
      show(0);
    });
  });
  steps.forEach(function(s, k){ s.addEventListener('mouseenter', function(){ paused = true; show(k); });
                                 s.addEventListener('mouseleave', function(){ paused = false; }); });
  show(0);
  var timer = setInterval(function(){
    if(!root.isConnected){ clearInterval(timer); return; }
    if(!paused) show((cur + 1) % steps.length);
  }, 2200);
}

export default class SmartGuardianHowItWorks extends HTMLElement {
  connectedCallback() {
    if (this.__init) return;
    this.__init = true;
    this.innerHTML = TEMPLATE;
    sgwInit(this.querySelector('.sgw'));
  }
}
