'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
$('#year').textContent = new Date().getFullYear();
const menu = $('.menu-button');
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); $('.nav').classList.toggle('open', open); });
$$('.nav a').forEach(link => link.addEventListener('click', () => { $('.nav').classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }));
const progress = $('.progress');
let scrollQueued = false;
window.addEventListener('scroll', () => { if (scrollQueued) return; scrollQueued = true; requestAnimationFrame(() => { const max = document.documentElement.scrollHeight - window.innerHeight; progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`; scrollQueued = false; }); }, { passive: true });
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reduceMotion.matches) { const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .1 }); $$('.reveal').forEach(el => observer.observe(el)); } else { $$('.reveal').forEach(el => el.classList.add('visible')); }

const services = {
 consulting: { kicker: 'STRATEGY / OPERATIONS / TRANSFORMATION', title: 'Make complexity<br>actionable.', description: 'Translate business challenges into practical strategies, stronger operating models and clearer priorities.', flow: ['Assess', 'Design', 'Implement'], number: '01' },
 analytics: { kicker: 'FINANCIAL / BUSINESS / DECISION SUPPORT', title: 'Turn information<br>into direction.', description: 'Connect financial modelling, performance analysis, research and reporting to the decisions that matter.', flow: ['Consolidate', 'Model', 'Interpret'], number: '02' },
 ai: { kicker: 'INTELLIGENT WORKFLOWS / AUTOMATION', title: 'Make the work<br>work smarter.', description: 'Identify repetitive work, design responsible AI-assisted workflows and build automation around real business needs.', flow: ['Identify', 'Automate', 'Validate'], number: '03' },
 technology: { kicker: 'SOFTWARE / DATA / ENGINEERING', title: 'Build what the<br>business needs.', description: 'Design and develop software, integrations and data systems that connect insight to everyday execution.', flow: ['Architect', 'Engineer', 'Evolve'], number: '04' }
};
function selectService(key) { const service = services[key]; if (!service) return; $$('.explorer-tab').forEach(btn => { const active = btn.dataset.service === key; btn.classList.toggle('active', active); btn.setAttribute('aria-selected', String(active)); }); $('#service-kicker').textContent = service.kicker; $('#service-title').innerHTML = service.title; $('#service-description').textContent = service.description; $('.panel-meta span:last-child').textContent = `ASSETQUANT / ${service.number}`; $('#service-flow').replaceChildren(...service.flow.flatMap((step, index) => { const node = document.createElement('span'); node.textContent = step; if (!index) return [node]; const arrow = document.createElement('i'); arrow.textContent = '→'; return [arrow, node]; })); }
$$('.explorer-tab').forEach(btn => btn.addEventListener('click', () => selectService(btn.dataset.service)));
$$('.orbit-label').forEach(btn => btn.addEventListener('click', () => { selectService(btn.dataset.target); $('#capabilities').scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth' }); }));

const scenarios = {
 technology: { inputs: [['Existing applications', 'Legacy and cloud systems'], ['Data and integrations', 'Interfaces and source records'], ['Business requirements', 'Security and delivery needs']], actions: ['Architect', 'Integrate', 'Modernise'], outputs: [['Connected services', 'Reliable integration patterns'], ['Trusted data flows', 'Validation and governance'], ['Maintainable platforms', 'Ready for iterative improvement']] },
 financial: { inputs: [['Financial records', 'Historical performance'], ['Operating metrics', 'Business drivers'], ['Planning assumptions', 'Future scenarios']], actions: ['Consolidate', 'Analyse', 'Validate'], outputs: [['Performance dashboard', 'Metrics that matter'], ['Decision-ready analysis', 'Clearer trade-offs'], ['Scenario model', 'Explore what changes']] },
 automation: { inputs: [['Business documents', 'Forms and files'], ['Manual workflows', 'Repeated tasks'], ['Business rules', 'Validation criteria']], actions: ['Extract', 'Check', 'Route'], outputs: [['Structured information', 'Ready for review'], ['Automated workflow', 'Less manual handling'], ['Exception alerts', 'Human review where needed']] },
 strategy: { inputs: [['Business objectives', 'Desired outcomes'], ['Operating data', 'Current performance'], ['Stakeholder insights', 'Practical constraints']], actions: ['Diagnose', 'Prioritise', 'Plan'], outputs: [['Strategic options', 'Informed choices'], ['Operating roadmap', 'Clear next steps'], ['Measurement framework', 'Track progress']] }
};
$$('.scenario').forEach(btn => btn.addEventListener('click', () => { const key = btn.dataset.scenario; const scenario = scenarios[key]; $$('.scenario').forEach(item => { const active = item === btn; item.classList.toggle('active', active); item.setAttribute('aria-selected', String(active)); }); scenario.inputs.forEach(([title, detail], index) => { $(`#input-${index + 1}`).replaceChildren(document.createTextNode(title)); const small = document.createElement('small'); small.textContent = detail; $(`#input-${index + 1}`).append(small); }); scenario.outputs.forEach(([title, detail], index) => { $(`#output-${index + 1}`).replaceChildren(document.createTextNode(title)); const small = document.createElement('small'); small.textContent = detail; $(`#output-${index + 1}`).append(small); }); $('.core-actions').replaceChildren(...scenario.actions.map(action => { const span = document.createElement('span'); span.textContent = action; return span; })); }));

if (document.getElementById("revenue")) {
const revenue = $('#revenue'), cost = $('#cost'), growth = $('#growth');
const lakh = number => `₹${number.toFixed(1)}L`;
const yearly = number => Math.abs(number) >= 100 ? `₹${(number / 100).toFixed(2)}Cr` : `₹${number.toFixed(1)}L`;
function updateModel() { const base = Number(revenue.value), operatingCost = Number(cost.value), rate = Number(growth.value); const projected = base * (1 + rate / 100), profit = projected - operatingCost, annual = profit * 12, margin = projected ? (profit / projected) * 100 : 0; $('#revenue-out').textContent = lakh(base); $('#cost-out').textContent = lakh(operatingCost); $('#growth-out').textContent = `${rate}%`; $('#metric-revenue').textContent = lakh(projected); $('#metric-profit').textContent = lakh(profit); $('#metric-annual').textContent = yearly(annual); $('#profit-label').textContent = `${margin.toFixed(1)}% operating margin`; const scale = Math.max(projected, operatingCost, Math.max(0, profit), 1); $('#bar-revenue').style.height = `${projected / scale * 100}%`; $('#bar-cost').style.height = `${operatingCost / scale * 100}%`; $('#bar-profit').style.height = `${Math.max(0, profit) / scale * 100}%`; }
[revenue, cost, growth].forEach(input => input.addEventListener('input', updateModel));
$('#reset-model').addEventListener('click', () => { revenue.value = 50; cost.value = 30; growth.value = 10; updateModel(); });
updateModel();

}

// Lightweight, original canvas illustration: no external graphics or 3D libraries required.
const canvas = $('#network');
const context = canvas ? canvas.getContext('2d') : null;
if (canvas && context) { let width = 0, height = 0, frame = 0, visible = true, pointer = { x: 0, y: 0 }, raf = null; const nodes = Array.from({ length: 110 }, (_, index) => { const angle = index * 2.399963229728653, z = 1 - (index + .5) * 2 / 110, radius = Math.sqrt(1 - z * z); return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, z }; });
 function resize() { const rect = canvas.getBoundingClientRect(); width = rect.width; height = rect.height; const dpr = Math.min(window.devicePixelRatio || 1, 2); canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr); context.setTransform(dpr, 0, 0, dpr, 0, 0); draw(); }
 function draw() { if (!width || !height) return; context.clearRect(0, 0, width, height); const centerX = width / 2, centerY = height / 2, sphere = Math.min(width, height) * .36, time = reduceMotion.matches ? .3 : frame * .0022; const points = nodes.map(node => { const a = time + pointer.x * .3, b = .25 + Math.sin(time * .5) * .15 + pointer.y * .25; const x = node.x * Math.cos(a) - node.z * Math.sin(a), z = node.x * Math.sin(a) + node.z * Math.cos(a); const y = node.y * Math.cos(b) - z * Math.sin(b), zz = node.y * Math.sin(b) + z * Math.cos(b); const perspective = 1 + zz * .12; return { x: centerX + x * sphere * perspective, y: centerY + y * sphere * perspective, z: zz }; }); context.strokeStyle = 'rgba(182,239,180,.10)'; context.lineWidth = 1; [1, .76, .52].forEach(scale => { context.beginPath(); context.ellipse(centerX, centerY, sphere * scale, sphere * scale, 0, 0, Math.PI * 2); context.stroke(); }); points.forEach((point, i) => { for (let j = i + 1; j < points.length; j++) { const other = points[j], dx = point.x - other.x, dy = point.y - other.y, dist = Math.hypot(dx, dy); if (dist < sphere * .32 && Math.abs(point.z - other.z) < .3) { context.strokeStyle = `rgba(176,241,175,${(1 - dist / (sphere * .32)) * .19})`; context.beginPath(); context.moveTo(point.x, point.y); context.lineTo(other.x, other.y); context.stroke(); } } context.fillStyle = `rgba(199,255,164,${.27 + (point.z + 1) * .33})`; context.beginPath(); context.arc(point.x, point.y, point.z > 0 ? 1.7 : 1.05, 0, Math.PI * 2); context.fill(); }); }
 function tick() { if (!visible || reduceMotion.matches) { raf = null; return; } frame++; draw(); raf = requestAnimationFrame(tick); }
 const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible && !raf && !reduceMotion.matches) raf = requestAnimationFrame(tick); }, { threshold: .01 }); observer.observe(canvas); canvas.addEventListener('pointermove', event => { const box = canvas.getBoundingClientRect(); pointer.x = (event.clientX - box.left) / box.width - .5; pointer.y = (event.clientY - box.top) / box.height - .5; }); canvas.addEventListener('pointerleave', () => { pointer.x = 0; pointer.y = 0; }); window.addEventListener('resize', resize, { passive: true }); reduceMotion.addEventListener?.('change', () => { draw(); if (!reduceMotion.matches && visible && !raf) raf = requestAnimationFrame(tick); }); resize(); if (!reduceMotion.matches) raf = requestAnimationFrame(tick); }

const modal = $('#contact-modal'), form = $('#enquiry-form'); let currentStep = 0, previousFocus = null;
function renderStep() { $$('.form-step').forEach((el, index) => el.classList.toggle('active', index === currentStep)); $$('.step-bars i').forEach((el, index) => el.classList.toggle('current', index <= currentStep)); $('#step-indicator').textContent = `STEP 0${currentStep + 1} / 03`; $('#back-step').hidden = currentStep === 0; $('#next-step').hidden = currentStep === 2; $('#submit-enquiry').hidden = currentStep !== 2; $('#form-error').textContent = ''; $('.modal-dialog').scrollTop = 0; }
function openContact() { previousFocus = document.activeElement; currentStep = 0; $('#form-success').hidden = true; $('.form-actions', form).hidden = false; $('.step-bars', modal).hidden = false; renderStep(); modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('modal-open'); $('.modal-close').focus(); }
function closeContact() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('modal-open'); previousFocus?.focus(); }
$$('[data-open-contact]').forEach(button => button.addEventListener('click', openContact));
$$('[data-close-contact]').forEach(button => button.addEventListener('click', closeContact));
modal.addEventListener('keydown', event => { if (event.key === 'Escape') closeContact(); if (event.key !== 'Tab') return; const focusable = $$('button:not([hidden]),input:not([type=radio]),textarea,input[type=radio]:checked', modal).filter(el => !el.closest('.form-step:not(.active)') && !el.disabled && el.getClientRects().length); const first = focusable[0], last = focusable.at(-1); if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } });
$('#next-step').addEventListener('click', () => { if (currentStep === 0 && !form.querySelector('input[name="interest"]:checked')) { $('#form-error').textContent = 'Please select an area to continue.'; return; } if (currentStep === 1 && !$('#project-details').value.trim()) { $('#form-error').textContent = 'Please describe your project or challenge.'; $('#project-details').focus(); return; } currentStep = Math.min(2, currentStep + 1); renderStep(); });
$('#back-step').addEventListener('click', () => { currentStep = Math.max(0, currentStep - 1); renderStep(); });
// Enquiries are submitted directly to the configured Formspree form; no email app is required.
const ENQUIRY_ENDPOINT = 'https://formspree.io/f/mbglgzkw';
let enquirySending = false;
form.addEventListener('submit', async event => {
 event.preventDefault();
 if (enquirySending) return;
 const name = $('#contact-name'), email = $('#contact-email'), details = $('#project-details');
 const interest = form.querySelector('input[name="interest"]:checked');
 if (!interest) { currentStep = 0; renderStep(); $('#form-error').textContent = 'Please select an area.'; return; }
 if (!details.value.trim()) { currentStep = 1; renderStep(); $('#form-error').textContent = 'Please describe your project.'; details.focus(); return; }
 if (!name.value.trim()) { name.setCustomValidity('Please enter your name.'); name.reportValidity(); name.setCustomValidity(''); return; }
 if (!email.checkValidity()) { email.reportValidity(); return; }
 const button = $('#submit-enquiry'), message = $('#form-error');
 const payload = new FormData(form);
 payload.set('_subject', `AssetQuant project enquiry — ${interest.value}`);
 payload.set('details', details.value.trim());
 payload.set('name', name.value.trim());
 payload.set('email', email.value.trim());
 enquirySending = true;
 button.disabled = true;
 button.innerHTML = 'Sending…';
 message.textContent = 'Sending your enquiry securely…';
 try {
  const response = await fetch(ENQUIRY_ENDPOINT, { method: 'POST', body: payload, headers: { Accept: 'application/json' } });
  if (!response.ok) {
   let errorText = 'Your enquiry could not be sent. Please try again.';
   try { const result = await response.json(); if (Array.isArray(result.errors) && result.errors.length) errorText = result.errors.map(item => item.message).join(' '); } catch (_) {}
   throw new Error(errorText);
  }
  message.textContent = '';
  $$('.form-step', form).forEach(step => step.classList.remove('active'));
  $('.form-actions', form).hidden = true;
  $('.step-bars', modal).hidden = true;
  $('#step-indicator').textContent = 'COMPLETE';
  $('#form-success').hidden = false;
  $('.modal-dialog').scrollTop = 0;
  form.reset();
 } catch (error) {
  message.textContent = error.message || 'Network error. Check your connection and try again.';
 } finally {
  enquirySending = false;
  button.disabled = false;
  button.innerHTML = 'Submit enquiry <span>↗</span>';
 }
});


// V4.1 interactive illustrative pipeline
(()=>{const grid=document.getElementById('pipeline-grid');if(!grid)return;const stages=['Source check','Extract data','Validate fields','Reconcile','Generate output','Quality review'];const records=Array.from({length:14},(_,i)=>`R${String(i+1).padStart(2,'0')}`);let step=0,paused=false,selected=0,timer;const logs=document.getElementById('pipeline-log-lines'),detail=document.getElementById('pipeline-selection'),toggle=document.getElementById('pipeline-toggle');function status(r,s){const progress=Math.floor(step/2)-r; if(s===3&&r===5&&progress>=3)return 'flag';if(s<progress)return 'done';if(s===progress)return 'running';return 'wait'}function render(){grid.innerHTML='<div class="row-label">PROCESS / RECORD</div>'+records.map((r,i)=>`<div class="column-head">${r}</div>`).join('')+stages.map((stage,s)=>`<div class="row-label">${stage}</div>`+records.map((r,i)=>`<button type="button" class="cell ${status(i,s)} ${selected===i?'selected':''}" data-record="${i}" data-stage="${s}" aria-label="${r}, ${stage}: ${status(i,s)}"><i></i></button>`).join('')).join('');grid.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{selected=+b.dataset.record;showDetail(+b.dataset.stage);render()}));showDetail();}function showDetail(stage){const progress=Math.max(0,Math.min(stages.length-1,Math.floor(step/2)-selected));const s=stage??progress;detail.textContent=`${records[selected]} · ${stages[s]} · ${status(selected,s)==='flag'?'Flagged for review':status(selected,s)==='done'?'Completed':status(selected,s)==='running'?'Processing':'Waiting'}`;}function tick(){step=(step+1)%(records.length*2+stages.length*2);render();const rec=records[Math.min(records.length-1,Math.floor(step/2)%records.length)];const line=document.createElement('div');line.className='pipeline-log-entry';const t=document.createElement('time');t.textContent=new Date().toLocaleTimeString('en-GB',{hour12:false});const msg=document.createElement('span');msg.textContent=`${rec}  ${stages[step%stages.length].toLowerCase()}  ${step%7===0?'review flag':'ok'}`;line.append(t,msg);logs.prepend(line);while(logs.children.length>4)logs.lastElementChild.remove();}toggle.addEventListener('click',()=>{paused=!paused;toggle.textContent=paused?'Resume demo ▶':'Pause demo Ⅱ';document.getElementById('pipeline-live').textContent=paused?'Ⅱ PAUSED':'● LIVE DEMO'});document.getElementById('pipeline-reset').addEventListener('click',()=>{step=0;selected=0;logs.innerHTML='';render()});render();timer=setInterval(()=>{if(!paused&&!document.hidden)tick()},1150);})();
// V4.1 illustrative comparable selection — no external or live data
(()=>{const list=document.getElementById('comps-list');if(!list)return;const data=[['Alder Court',212000,1241,0.20],['Birch Road',230000,1275,0.43],['Cedar Lane',228000,1324,0.67],['Dunmore Avenue',235000,1318,0.82],['Elm Terrace',100000,1288,1.12],['Fairhaven Drive',255000,1296,1.38],['Glen Oak Lane',242000,1264,1.85]];const active=new Set([0,1,2,3,5,6]);const subjectSize=1318;const fmt=n=>'$'+Math.round(n).toLocaleString('en-US');function render(){list.innerHTML=data.map(([name,price,sqft,dist],i)=>`<div class="comp-row ${active.has(i)?'':'excluded'}"><div><strong>${name}</strong><small>${sqft.toLocaleString()} sq ft · ${dist.toFixed(2)} mi · sample only</small></div><div class="comp-price">${fmt(price/sqft)}</div><div><button type="button" aria-pressed="${active.has(i)}" data-comp="${i}" aria-label="${active.has(i)?'Exclude':'Include'} ${name}">${active.has(i)?'✓ Include':'+ Add'}</button></div></div>`).join('');list.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{const i=+b.dataset.comp;active.has(i)?active.delete(i):active.add(i);render()}));const chosen=[...active].map(i=>data[i]);document.getElementById('comps-count').textContent=chosen.length;if(chosen.length){const sorted=chosen.map(([,price,sqft])=>price/sqft).sort((a,b)=>a-b);const n=sorted.length;const med=n%2?sorted[(n-1)/2]:(sorted[n/2-1]+sorted[n/2])/2;document.getElementById('comps-median').textContent=fmt(med);document.getElementById('comps-value').textContent=fmt(med*subjectSize);const prices=chosen.map(x=>x[1]);document.getElementById('comps-range').textContent=fmt(Math.min(...prices))+' – '+fmt(Math.max(...prices));}else{for(const id of ['comps-median','comps-value','comps-range'])document.getElementById(id).textContent='—';}const map=document.getElementById('comps-map');map.querySelectorAll('.map-pin').forEach(x=>x.remove());data.forEach((row,i)=>{const dot=document.createElement('span');dot.className='map-pin '+(active.has(i)?'':'off');const a=i*2.39996,rad=30+row[3]*33;dot.style.left=`calc(50% + ${Math.cos(a)*rad}px)`;dot.style.top=`calc(50% + ${Math.sin(a)*rad}px)`;dot.title=row[0];map.append(dot)});}document.getElementById('comps-reset').addEventListener('click',()=>{active.clear();[0,1,2,3,5,6].forEach(i=>active.add(i));render()});render();})();


/* V5 · SVG path-following signals, scenario storytelling, human-governed AI demo */
(()=>{
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const palette=['#c2ff79','#f4b45b','#80d8c1','#a6bbff','#e9f5de'];
  function makeSignals(svg, paths, prefix, count=3){
    if(!svg)return;
    svg.querySelectorAll('.v5-token').forEach(n=>n.remove());
    if(reduced.matches)return;
    const ns='http://www.w3.org/2000/svg';
    paths.forEach((path,i)=>{
      for(let k=0;k<count;k++){
        const dot=document.createElementNS(ns,'circle');
        const color=palette[(i+k)%palette.length];
        dot.setAttribute('r',k===0?'5':'3.2');dot.setAttribute('fill',color);
        dot.setAttribute('class','v5-token');dot.style.color=color;
        const motion=document.createElementNS(ns,'animateMotion');
        motion.setAttribute('dur',`${2.8+i*.23}s`);
        motion.setAttribute('begin',`${-(k*.95+i*.33)}s`);
        motion.setAttribute('repeatCount','indefinite');
        motion.setAttribute('rotate','auto');
        const mpath=document.createElementNS(ns,'mpath');
        mpath.setAttributeNS('http://www.w3.org/1999/xlink','href',`#${prefix}${i+1}`);
        motion.append(mpath);dot.append(motion);svg.append(dot);
      }
    });
  }
  const tech=document.querySelector('[data-demo="tech"]');
  if(tech){
    const svg=tech.querySelector('svg');
    const lines=[...svg.querySelectorAll('path')];
    makeSignals(svg,lines,'tech-in-',0); // paths use explicit IDs, including outputs
    function replay(){svg.querySelectorAll('.v5-token').forEach(n=>n.remove());if(reduced.matches)return;
      const ns='http://www.w3.org/2000/svg';
      lines.forEach((path,i)=>{for(let k=0;k<3;k++){
        const circle=document.createElementNS(ns,'circle');const color=palette[(i+k)%palette.length];
        circle.setAttribute('class','v5-token');circle.setAttribute('r',k===0?'5':'3');circle.setAttribute('fill',color);circle.style.color=color;
        const anim=document.createElementNS(ns,'animateMotion');anim.setAttribute('dur',`${3+i*.15}s`);anim.setAttribute('begin',`${-k*1.02-i*.19}s`);anim.setAttribute('repeatCount','indefinite');
        const mp=document.createElementNS(ns,'mpath');mp.setAttributeNS('http://www.w3.org/1999/xlink','href','#'+path.id);anim.append(mp);circle.append(anim);svg.append(circle);
      }});
    }
    replay();tech.querySelector('[data-replay]')?.addEventListener('click',replay);
  }
  // Upgrade the original three-scenario engine with real SVG path-following particles.
  const engineSvg=document.querySelector('#engine-map .engine-paths');
  if(engineSvg){
    const original=engineSvg.querySelector('path');
    const segments=['M250 85 C335 85 330 200 420 200','M250 200 H420','M250 315 C335 315 330 200 420 200','M580 200 C665 200 665 85 750 85','M580 200 H750','M580 200 C665 200 665 315 750 315'];
    if(original)original.remove();
    const ns='http://www.w3.org/2000/svg';
    segments.forEach((d,i)=>{const path=document.createElementNS(ns,'path');path.id='v5-engine-route-'+i;path.setAttribute('d',d);engineSvg.append(path)});
    function engineReplay(){engineSvg.querySelectorAll('.v5-token').forEach(n=>n.remove());if(reduced.matches)return;
      segments.forEach((d,i)=>{for(let k=0;k<3;k++){
        const c=document.createElementNS(ns,'circle');const color=palette[(i+k)%palette.length];c.setAttribute('class','v5-token');c.setAttribute('fill',color);c.setAttribute('r',k===0?'5':'3.2');c.style.color=color;
        const a=document.createElementNS(ns,'animateMotion');a.setAttribute('dur',`${2.5+i*.18}s`);a.setAttribute('begin',`${-k*.8-i*.31}s`);a.setAttribute('repeatCount','indefinite');
        const m=document.createElementNS(ns,'mpath');m.setAttributeNS('http://www.w3.org/1999/xlink','href','#v5-engine-route-'+i);a.append(m);c.append(a);engineSvg.append(c);
      }});
    }
    engineReplay();document.querySelectorAll('[data-scenario]').forEach(b=>b.addEventListener('click',engineReplay));
  }
  // Tree / waterfall: dots descend from a single runtime node into the record columns.
  const tree=document.getElementById('v5-pipeline-tree');
  if(tree){
    const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 900 75');svg.setAttribute('preserveAspectRatio','none');
    const root=document.createElementNS(ns,'circle');root.setAttribute('cx','450');root.setAttribute('cy','6');root.setAttribute('r','4');root.setAttribute('fill','#193c2c');svg.append(root);
    for(let i=0;i<14;i++){
      const x=25+i*65.38,id='v5-branch-'+i,d=`M450 6 C450 34 ${x} 31 ${x} 72`;
      const path=document.createElementNS(ns,'path');path.id=id;path.setAttribute('d',d);svg.append(path);
      if(!reduced.matches){for(let j=0;j<2;j++){
        const c=document.createElementNS(ns,'circle');c.setAttribute('r',j?'2.5':'3.5');c.setAttribute('fill',palette[(i+j)%palette.length]);c.style.color=palette[(i+j)%palette.length];
        const a=document.createElementNS(ns,'animateMotion');a.setAttribute('dur',`${3.2+(i%4)*.37}s`);a.setAttribute('begin',`${-(i*.29+j*1.65)}s`);a.setAttribute('repeatCount','indefinite');
        const m=document.createElementNS(ns,'mpath');m.setAttributeNS('http://www.w3.org/1999/xlink','href','#'+id);a.append(m);c.append(a);svg.append(c);
      }}
    }
    tree.append(svg);
  }
  const cases={
    growth:['Revenue is growing. Profit isn’t.','Costs, customer mix and delivery performance are hard to compare.',['Map profit drivers','Test the trade-offs','Assign actions and owners','Review the indicators'],'A clearer path to profitable growth.','A practical roadmap with accountable actions and defined performance measures.'],
    operations:['Teams are busy. Work still stalls.','Handoffs, duplicated effort and unclear ownership create friction.',['Map the process','Locate bottlenecks','Redesign handoffs','Track cycle times'],'A more coherent operating model.','A prioritised improvement plan with clearer roles, workflows and measurable service indicators.'],
    transformation:['The business needs to change. The route is unclear.','Strategy, systems and people need a shared direction.',['Assess current state','Sequence initiatives','Define delivery ownership','Monitor adoption'],'A transformation plan people can execute.','A staged roadmap that connects priorities, implementation and measurable checkpoints.']
  };
  document.querySelectorAll('.v5-choice').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('.v5-choice').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});
    const [problem,context,steps,result,impact]=cases[b.dataset.case];
    document.getElementById('consult-problem').textContent=problem;document.getElementById('consult-context').textContent=context;
    steps.forEach((v,i)=>document.getElementById('consult-step-'+(i+1)).textContent=v);
    document.getElementById('consult-result').textContent=result;document.getElementById('consult-impact').textContent=impact;
  }));
  const aiCases={invoice:['Exception flagged for review','A suggested summary identifies the mismatch and links the relevant source records for a person to review.'],report:['Draft variance summary prepared','The sample workflow groups changes by category and flags unusual movements for analyst verification.'],support:['Case context organised for review','The sample workflow groups the issue history and proposes a draft response for a support specialist to check.']};
  let aiSelected='invoice',aiTimer=null;
  document.querySelectorAll('.v5-ai-request').forEach(el=>el.addEventListener('click',()=>{
    if(aiTimer)return;aiSelected=el.dataset.ai;document.querySelectorAll('.v5-ai-request').forEach(x=>x.classList.toggle('active',x===el));
    document.getElementById('ai-output-title').textContent='Ready to process sample';document.getElementById('ai-output-text').textContent='Select “Run sample workflow” to step through this illustrative process.';
    document.querySelectorAll('.v5-ai-step').forEach((x,i)=>x.classList.toggle('active',i===0));document.getElementById('ai-status').textContent='Ready to run';
  }));
  const aiRun=document.getElementById('ai-run');
  aiRun?.addEventListener('click',()=>{
    if(aiTimer)return;aiRun.disabled=true;let stage=0;
    document.getElementById('ai-output-title').textContent='Processing sample…';document.getElementById('ai-output-text').textContent='Following the defined workflow and validation stages.';
    function advance(){document.querySelectorAll('.v5-ai-step').forEach((el,i)=>{el.classList.toggle('active',i===stage);el.classList.toggle('done',i<stage)});
      document.getElementById('ai-status').textContent=['Understanding request','Retrieving sample context','Checking against rules','Awaiting human review'][stage];
      if(stage===3){const [title,desc]=aiCases[aiSelected];document.getElementById('ai-output-title').textContent=title;document.getElementById('ai-output-text').textContent=desc;aiRun.disabled=false;clearInterval(aiTimer);aiTimer=null;return;}stage++;
    }
    advance();aiTimer=setInterval(advance,720);
  });
})();

/* V6 consulting animation retained */
(()=>{const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const consulting=document.getElementById('consult-demo');if(consulting){let timer;function animate(){consulting.classList.remove('is-running');void consulting.offsetWidth;consulting.classList.add('is-running');clearTimeout(timer);timer=setTimeout(()=>consulting.classList.remove('is-running'),4700)}document.querySelectorAll('.v5-choice').forEach(btn=>btn.addEventListener('click',animate));const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){if(!reduced.matches)animate();observer.disconnect()}},{threshold:.35});observer.observe(consulting)}
})();
