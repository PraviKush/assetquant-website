/* AssetQuant V8: self-contained demos, no external libraries or backend */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const files={api:{name:'api.ts',code:`// Integration API · illustrative TypeScript
import { validate, audit } from './controls';

async function ingest(request: Request) {
  const payload = await request.json();
  const result = validate(payload);
  if (!result.ok) return { status: 422, errors: result.errors };

  await audit.record('ingest', payload.id);
  return { status: 202, id: payload.id, state: 'accepted' };
}`,logs:['$ POST /api/v1/ingest','→ Validating request payload…','✓ Schema validation passed','✓ Audit event recorded','← 202 Accepted · AQ-1042']},data:{name:'pipeline.py',code:`# Data pipeline · illustrative Python
from pipeline import extract, validate, publish

records = extract(source='finance_export')
clean, exceptions = validate(records)

if exceptions:
    queue_for_review(exceptions)

publish(clean, destination='analytics_layer')
log('pipeline complete')`,logs:['$ python pipeline.py','→ Extracting 240 sample records…','✓ 238 records validated','! 2 records queued for review','✓ Reviewed dataset published']},cloud:{name:'deploy.yml',code:`# Illustrative delivery pipeline
name: assetquant-service
stages:
  - lint
  - unit_test
  - security_check
  - deploy_staging
  - approval_gate
  - deploy_production

controls:
  audit_logs: enabled
  rollback: enabled`,logs:['$ run deployment pipeline','✓ Lint and unit tests passed','✓ Security checks passed','✓ Staging deployment healthy','◌ Production awaiting human approval']}};
let active='api',techTimer=null;
function selectFile(key){if(!files[key])return;clearInterval(techTimer);active=key;$('dev-code').textContent=files[key].code;$('dev-filename').textContent=files[key].name;$('dev-output').textContent='Ready · click Run sample to inspect the simulated output.';$('dev-run').disabled=false;document.querySelectorAll('.v7-dev-file').forEach(b=>{b.classList.toggle('active',b.dataset.file===key);b.setAttribute('aria-pressed',String(b.dataset.file===key));});}
if($('dev-code')&&$('dev-run')){document.querySelectorAll('.v7-dev-file').forEach(b=>b.addEventListener('click',()=>selectFile(b.dataset.file)));$('dev-run').addEventListener('click',()=>{clearInterval(techTimer);const output=$('dev-output'),button=$('dev-run'),lines=files[active].logs;output.replaceChildren();button.disabled=true;let i=0;const advance=()=>{if(i===lines.length){clearInterval(techTimer);button.disabled=false;return;}const line=document.createElement('div');line.textContent=lines[i++];output.append(line);output.scrollTop=output.scrollHeight;};advance();techTimer=setInterval(advance,480);});selectFile('api');}
const capabilities={
strategy:{title:'Business & strategy consulting',desc:'A hypothetical process-improvement scenario: assess the current operation, find friction, test a change and define a practical action plan.',label:'Target process improvement',unit:'%',steps:['Map current process','Locate bottlenecks','Model the change','Review action plan'],metric:v=>`${Math.round(55+v*.4)} / 100`,caption:'Illustrative process effectiveness index'},
analytics:{title:'Financial & business analytics',desc:'A simple illustrative financial model: adjust revenue growth, review assumptions and see the effect on a hypothetical margin.',label:'Revenue growth assumption',unit:'%',steps:['Load sample accounts','Apply assumptions','Recalculate scenario','Review financial impact'],metric:v=>`${(12+v*.14).toFixed(1)}%`,caption:'Illustrative operating margin'},
reporting:{title:'Management & investor reporting',desc:'Follow an illustrative reporting cycle from source data to validation, reconciliation and a review-ready reporting pack.',label:'Sample source records',unit:' records',steps:['Collect source data','Check completeness','Reconcile totals','Prepare report for review'],metric:v=>`${Math.round(100+v*9)}`,caption:'Illustrative records checked'},
ai:{title:'AI & intelligent automation',desc:'Explore how an incoming request could be classified, checked against available context and sent to a person for final review.',label:'Confidence threshold',unit:'%',steps:['Receive example request','Retrieve relevant context','Flag uncertain items','Send draft for human review'],metric:v=>`${v}%`,caption:'Illustrative confidence threshold'},
engineering:{title:'Software & API engineering',desc:'A simulated API integration: receive a request, validate its shape, write an audit event and prepare a response.',label:'Simulated API requests',unit:' requests',steps:['Receive API request','Validate payload schema','Write audit event','Return example response'],metric:v=>`${Math.round(1+v*2)}`,caption:'Illustrative requests processed'},
data:{title:'Data platforms & governance',desc:'Trace example records through ingestion, completeness checks, exception handling and controlled publication.',label:'Input quality assumption',unit:'%',steps:['Ingest source records','Check data quality','Flag exceptions','Publish reviewed subset'],metric:v=>`${v}%`,caption:'Assumed records passing checks'},
realestate:{title:'Real estate & investment analytics',desc:'An indicative, hypothetical property comparison based on a user-adjusted price per square foot and a fixed example area.',label:'Price assumption (₹ per sq ft)',unit:' ₹/sq ft',steps:['Define example property','Choose price assumption','Apply 1,200 sq ft area','Review indicative estimate'],metric:v=>`₹${(4000+v*120).toLocaleString('en-IN')}`,caption:'Hypothetical price per sq ft; not an appraisal'},
operations:{title:'Operations & process improvement',desc:'Explore a service-request workflow: intake, categorisation, exception routing and status tracking.',label:'Incoming example requests',unit:' requests',steps:['Receive requests','Categorise by priority','Route to an owner','Track sample queue'],metric:v=>`${Math.round(5+v*3)}`,caption:'Illustrative requests triaged'}};
const overlay=$('strength-detail'),range=$('strength-input'),visual=$('strength-visual'),story=$('strength-story'),status=$('strength-status'),run=$('strength-run');
let current=null,dialogTimer=null,priorFocus=null;
function updateScene(){const c=capabilities[current];if(!c)return;const v=Number(range.value);$('strength-value').textContent=v+c.unit;visual.replaceChildren();const metric=document.createElement('div');metric.className='v7-demo-metric';const label=document.createElement('span');label.textContent=c.caption;const val=document.createElement('strong');val.textContent=c.metric(v);metric.append(label,val);const bars=document.createElement('div');bars.className='v7-demo-bars';c.steps.forEach((name,i)=>{const row=document.createElement('div');row.className='v7-demo-bar';const title=document.createElement('span');title.textContent=name;const track=document.createElement('div');track.className='v7-demo-track';const fill=document.createElement('i');fill.style.width=`${Math.max(12,Math.min(100,15+v*.65+i*7))}%`;track.append(fill);row.append(title,track);bars.append(row);});visual.append(metric,bars);story.replaceChildren();c.steps.forEach((name,i)=>{const step=document.createElement('div');step.className='v8-story-step';const num=document.createElement('b');num.textContent=`0${i+1} / ${i===0?'INPUT':i===3?'OUTPUT':'PROCESS'}`;const txt=document.createElement('span');txt.textContent=name;step.append(num,txt);story.append(step);});}
function close(){if(!overlay)return;clearInterval(dialogTimer);overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');document.body.classList.remove('v7-detail-open');run.disabled=false;priorFocus?.focus();}
if(overlay&&range&&visual&&story&&run){document.querySelectorAll('.v7-strength-card').forEach(card=>card.addEventListener('click',()=>{const key=card.dataset.strength;if(!capabilities[key])return;priorFocus=document.activeElement;current=key;const c=capabilities[key];$('strength-kicker').textContent=`ASSETQUANT / ${key.toUpperCase()} / INTERACTIVE`;$('strength-title').textContent=c.title;$('strength-desc').textContent=c.desc;$('strength-input-label').textContent=c.label;range.value=55;clearInterval(dialogTimer);run.disabled=false;status.textContent='Ready · adjust the scenario or run the animation';updateScene();overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');document.body.classList.add('v7-detail-open');overlay.querySelector('.v7-detail-close').focus();}));range.addEventListener('input',()=>{clearInterval(dialogTimer);run.disabled=false;status.textContent='Scenario updated · ready to run';updateScene();});run.addEventListener('click',()=>{if(!current)return;clearInterval(dialogTimer);updateScene();run.disabled=true;let i=0;status.textContent='Running illustrative workflow…';const advance=()=>{const steps=story.querySelectorAll('.v8-story-step');if(i>=steps.length){clearInterval(dialogTimer);run.disabled=false;status.textContent='✓ Demonstration complete · hypothetical output';return;}steps.forEach((el,j)=>{el.classList.toggle('active',j===i);el.classList.toggle('done',j<i);});visual.querySelectorAll('.v7-demo-bar').forEach((el,j)=>el.classList.toggle('is-complete',j<=i));status.textContent=`${i+1}/4 · ${capabilities[current].steps[i]}`;i++;};advance();dialogTimer=setInterval(advance,680);});overlay.querySelectorAll('[data-close-strength]').forEach(b=>b.addEventListener('click',close));document.addEventListener('keydown',e=>{if(!overlay.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='Tab'){const focusable=[...overlay.querySelectorAll('button:not([disabled]),input')];const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});}
})();
