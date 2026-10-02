const header=document.querySelector(".nav"),menu=document.querySelector(".menu");
if(menu)menu.addEventListener("click",()=>{const open=header.classList.toggle("open");menu.setAttribute("aria-expanded",String(open))});
document.querySelectorAll('.nav a[href^="#"]').forEach(a=>a.addEventListener("click",()=>header.classList.remove("open")));

const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.1});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));

const modal=document.getElementById("contact-modal");
const openModal=()=>{modal.classList.add("open");document.body.classList.add("modal-open");setTimeout(()=>modal.querySelector("input")?.focus(),100)};
const closeModal=()=>{modal.classList.remove("open");document.body.classList.remove("modal-open")};
document.querySelectorAll(".js-contact").forEach(b=>b.addEventListener("click",openModal));
modal.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",closeModal));
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&modal.classList.contains("open"))closeModal()});

const data={
 invoice:["Exception flagged for review","A suggested summary identifies the mismatch and links the relevant source records for a person to review."],
 report:["Variance summary prepared for review","The workflow groups material movements, retrieves supporting context and drafts a concise management summary."],
 support:["Case evidence assembled","The workflow organises the issue history, highlights unresolved points and drafts a review-ready case summary."]
};
document.querySelectorAll(".request").forEach(btn=>btn.addEventListener("click",()=>{
 document.querySelectorAll(".request").forEach(x=>x.classList.remove("active"));btn.classList.add("active");
 const [t,p]=data[btn.dataset.flow];document.getElementById("flow-title").textContent=t;document.getElementById("flow-text").textContent=p;
}));
document.getElementById("run-flow")?.addEventListener("click",()=>{
 const tabs=[...document.querySelectorAll(".flow-tabs b")],state=document.getElementById("run-state");tabs.forEach(x=>x.classList.remove("on"));state.textContent="Running…";
 let i=0;const timer=setInterval(()=>{tabs.forEach(x=>x.classList.remove("on"));tabs[i].classList.add("on");i++;if(i===tabs.length){clearInterval(timer);setTimeout(()=>state.textContent="Ready for human review",250)}},420);
});
// V22: capability rows expand to show representative work and live demos.
document.querySelectorAll('.cap-row').forEach(btn=>{
 const toggle=()=>{
  const art=btn.closest('article');
  const open=!art.classList.contains('cap-open');
  document.querySelectorAll('.cap-list article.cap-open').forEach(a=>{a.classList.remove('cap-open');a.querySelector('.cap-row').setAttribute('aria-expanded','false')});
  if(open){art.classList.add('cap-open');btn.setAttribute('aria-expanded','true')}
 };
 btn.addEventListener('click',toggle);
 btn.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}});
});

// V23: excellence cards flip to show what each step means in practice.
document.querySelectorAll('.steps article.flip').forEach(card=>{
 const toggle=()=>{const f=card.classList.toggle('flipped');card.setAttribute('aria-pressed',String(f))};
 card.addEventListener('click',toggle);
 card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}});
});

// V36 governance workflow: interactive six-stage control model.
const governanceStages = [
 {badge:'DISCOVERY & CONTEXT',title:'Understand the Decision & Constraints',desc:'Frame the business objective, operating context, stakeholders and constraints before selecting analytical or technology interventions.',tool:'Context & Requirements Mapper',human:'Engagement Lead',telemetry:'Context Signals',mode:'SCOPED INTAKE',lines:['OBJECTIVE_CONTEXT_CAPTURED','CONSTRAINTS_MAPPED','DECISION_SCOPE_CONFIRMED'],risk:'Defined Scope',control:'Human Framing'},
 {badge:'EVIDENCE RETRIEVAL',title:'Retrieve Relevant Evidence',desc:'Bring together the source data, documents, prior knowledge and operational evidence needed to support the decision.',tool:'Evidence Retrieval Layer',human:'Domain Analyst',telemetry:'Evidence Trace',mode:'SOURCE CONTROL',lines:['SOURCE_SET_CONNECTED','RELEVANT_EVIDENCE_RETRIEVED','PROVENANCE_LINKS_READY'],risk:'Source Bounded',control:'Evidence Traceable'},
 {badge:'ANALYTICAL ENGINE',title:'Analyse Patterns, Risks & Scenarios',desc:'Apply analytics and AI where useful to surface patterns, exceptions, risks, opportunities and plausible scenarios.',tool:'Analytics & AI Workbench',human:'Analytics Lead',telemetry:'Analysis Signals',mode:'ASSISTED ANALYSIS',lines:['PATTERN_DETECTION_ACTIVE','SCENARIOS_EVALUATED','IMPACT_SIGNALS_GENERATED'],risk:'Model Guardrails',control:'Explainable Output'},
 {badge:'VALIDATION LAYER',title:'Validate Data, Rules & Assumptions',desc:'Test outputs against validated data, business rules, thresholds and known constraints before recommendations move forward.',tool:'Validation & Rules Engine',human:'Control Owner',telemetry:'Validation Status',mode:'CONTROL GATE',lines:['DATA_CHECKS_PASSED','BUSINESS_RULES_APPLIED','ASSUMPTIONS_FLAGGED'],risk:'Rule Governed',control:'Validation Required'},
 {badge:'HUMAN GOVERNANCE',title:'Review Recommendations & Trade-offs',desc:'Present evidence, assumptions, quantified impact and trade-offs so accountable people can challenge, refine and approve the path forward.',tool:'Decision Review Workspace',human:'Accountable Decision Owner',telemetry:'Review State',mode:'HUMAN REVIEW',lines:['RECOMMENDATION_PACK_READY','TRADE_OFFS_VISIBLE','HUMAN_APPROVAL_REQUIRED'],risk:'Approval Gated',control:'Human Accountable'},
 {badge:'OPERATIONAL INTEGRATION',title:'Execution, Deployment & Value Realisation',desc:'Insights translate into operational change, workflow automation and live production systems, with continuous KPI tracking and outcome feedback.',tool:'Enterprise Delivery Layer',human:'Transformation Operations Lead',telemetry:'Execution Telemetry',mode:'CONTINUOUS DELIVERY',lines:['DEPLOY_INTEGRATED_WORKFLOWS','TELEMETRY_STREAM_CONNECTED','VALUE_REALISATION_ACTIVE'],risk:'Governed Rollout',control:'Human Accountable'}
];
const stageTabs=[...document.querySelectorAll('.stage-tab')];
function renderGovernanceStage(i){const s=governanceStages[i];if(!s)return;stageTabs.forEach((b,n)=>b.classList.toggle('active',n===i));
 const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};set('stage-badge',s.badge);set('stage-count',`Step ${i+1} of 6`);set('stage-title',s.title);set('stage-description',s.desc);set('stage-tool',s.tool);set('stage-human',s.human);set('telemetry-title',s.telemetry);set('telemetry-mode',s.mode);set('stage-risk',s.risk);set('stage-control',s.control);
 typeTerminal(s.lines,s.mode);}
// V41: the telemetry terminal types its signals live for the selected stage.
let termTimers=[];
function typeTerminal(lines,mode){
 const t=document.getElementById('stage-terminal');if(!t)return;
 termTimers.forEach(clearTimeout);termTimers=[];
 t.classList.remove('signal-run');
 const statusLine='> '+String(mode||'STAGE').replace(/\s+/g,'_')+' :: ACTIVE';
 if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches){
  t.innerHTML=lines.map(x=>`<code>&gt; ${x}</code>`).join('')+`<code class="term-ok">${statusLine.replace('>','&gt;')}</code>`;return;
 }
 t.innerHTML='';
 let li=0;
 const nextLine=()=>{
  const isStatus=li===lines.length;
  if(li>lines.length)return;
  const code=document.createElement('code');
  code.className='typing'+(isStatus?' term-ok':'');
  t.appendChild(code);
  const text=isStatus?statusLine:'> '+lines[li];
  const start=performance.now(),cps=75;
  const tick=()=>{
   const ci=Math.min(text.length,Math.max(1,Math.floor((performance.now()-start)/1000*cps)));
   code.textContent=text.slice(0,ci);
   if(ci<text.length){termTimers.push(setTimeout(tick,26));}
   else{code.classList.remove('typing');li++;termTimers.push(setTimeout(nextLine,isStatus?0:140));}
  };
  termTimers.push(setTimeout(tick,30));
 };
 nextLine();
}
stageTabs.forEach((b,i)=>b.addEventListener('click',()=>renderGovernanceStage(i)));if(stageTabs.length)renderGovernanceStage(0);


// V40: keep every enquiry submission inside AssetQuant.
(() => {
  const form = document.querySelector('#contact-modal form[action="https://formspree.io/f/mbglgzkw"]');
  if (!form) return;

  const submit = form.querySelector('button[type="submit"]');
  const status = form.querySelector('.form-status');
  const original = submit ? submit.innerHTML : '';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    if (!form.checkValidity()) {
      form.reportValidity();
      return false;
    }

    if (status) {
      status.hidden = true;
      status.className = 'form-status';
      status.innerHTML = '';
    }
    if (submit) {
      submit.disabled = true;
      submit.textContent = 'Sending…';
    }

    try {
      const response = await fetch('https://formspree.io/f/mbglgzkw', {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        let msg = 'We could not send your enquiry. Please try again.';
        try {
          const data = await response.json();
          if (Array.isArray(data.errors) && data.errors.length) {
            msg = data.errors.map(x => x.message).filter(Boolean).join(' ');
          }
        } catch (_) {}
        throw new Error(msg);
      }

      form.reset();
      if (status) {
        status.className = 'form-status success';
        status.innerHTML = '<span class="status-icon">✓</span><div><strong>Thank you. Your enquiry has been received.</strong><small>Our team will review it and get back to you.</small></div>';
        status.hidden = false;
      }
      if (submit) submit.hidden = true;
    } catch (err) {
      if (status) {
        status.className = 'form-status error';
        status.innerHTML = '<div><strong>Unable to send your enquiry.</strong><small>' + (err?.message || 'Please try again in a moment.') + '</small></div>';
        status.hidden = false;
      }
      if (submit) {
        submit.disabled = false;
        submit.innerHTML = original;
      }
    }
    return false;
  }, true);

  // Reset the modal for a fresh enquiry after it has been closed.
  document.querySelectorAll('#contact-modal [data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.setTimeout(() => {
        if (submit) {
          submit.hidden = false;
          submit.disabled = false;
          submit.innerHTML = original;
        }
        if (status) {
          status.hidden = true;
          status.className = 'form-status';
          status.innerHTML = '';
        }
      }, 250);
    });
  });
})();

// V40: visible workflow motion attached to the actual V36 elements.
(() => {
  const tabs = [...document.querySelectorAll('.stage-tab')];
  const panel = document.querySelector('.stage-panel');

  function animateStage() {
    if (!panel) return;
    panel.classList.add('processing');
    setTimeout(() => {
      panel.classList.remove('processing');
    }, 330);
  }

  tabs.forEach(tab => tab.addEventListener('click', () => setTimeout(animateStage, 20)));
  setTimeout(animateStage, 250);
})();
