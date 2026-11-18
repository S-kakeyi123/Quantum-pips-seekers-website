document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
  const toggle=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.main-nav');
  if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded',String(open));});
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');}));}
  document.querySelectorAll('[data-demo-form]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();
    let note=form.querySelector('.form-feedback');
    if(!note){note=document.createElement('p');
      note.className='form-feedback';
      note.style.cssText='color:#c4b4ff;font-size:11px;line-height:1.6';
      form.appendChild(note);}note.textContent='This is a design preview. Secure account and payment services must be connected before launch.';}));
  const current=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.main-nav a').forEach(a=>{if(a.getAttribute('href')===current)a.classList.add('active');});
  if('IntersectionObserver' in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){const targets=document.querySelectorAll('.eco-card,.value-grid article,.feature-grid article,.course-grid article,.academy-photo,.manifesto-copy');
    targets.forEach(el=>{el.style.opacity='0';el.style.transform='translateY(18px)';el.style.transition='opacity .65s ease, transform .65s ease';});
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.style.opacity='1';entry.target.style.transform='translateY(0)';io.unobserve(entry.target);}}),{threshold:.12});
    targets.forEach(el=>io.observe(el));}
});

(() => {
const $ = id => document.getElementById(id);
const fields = ['balance','currency','risk','market','symbol','direction','entry','stop','take','contract','pip','pipValue'];
const money = (value, currency) => {
  try { return new Intl.NumberFormat('en-US',{style:'currency',currency,maximumFractionDigits:2}).format(value); }
  catch { return currency+' '+value.toFixed(2); }
};
const show = (id,value) => $(id).textContent = value;
function calculate() {
  $('error').textContent = '';
  const balance = Number($('balance').value), risk = Number($('risk').value);
  const entry = Number($('entry').value), stop = Number($('stop').value), take = Number($('take').value);
  const contract = Number($('contract').value), pip = Number($('pip').value);
  const pipValueInput = $('pipValue').value.trim();
  const pipValue = pipValueInput === '' ? null : Number(pipValueInput);
  const currency = $('currency').value, market = $('market').value;
  const symbol = $('symbol').value.trim().toUpperCase(), direction = $('direction').value;
  if (![balance,risk,entry,stop,take,contract,pip].every(Number.isFinite) || balance<=0 || risk<=0 || risk>100 || entry<=0 || stop<=0 || take<=0 || contract<=0 || pip<=0) {
    $('error').textContent = 'Enter valid positive numbers. Risk must be greater than 0 and no more than 100%.';
    return;
  }
  if (pipValue !== null && (!Number.isFinite(pipValue) || pipValue<=0)) {
    $('error').textContent = 'Pip value must be a positive number, or left blank for the supported automatic estimate.';
    return;
  }
  const isBuy = direction === 'buy';
  const stopMove = isBuy ? entry-stop : stop-entry;
  const takeMove = isBuy ? take-entry : entry-take;
  if (stopMove<=0) { $('error').textContent='Stop loss must be below entry for a buy, and above entry for a sell.'; return; }
  if (takeMove<=0) { $('error').textContent='Take profit must be above entry for a buy, and below entry for a sell.'; return; }
  let valuePerPip;
  if (pipValue !== null) valuePerPip = pipValue;
  else if (market==='forex' && currency==='USD' && /USD$/.test(symbol)) valuePerPip = pip * contract;
  else {
    $('error').textContent='Enter your broker’s pip/point value per standard lot in your account currency for this instrument/account combination.';
    return;
  }
  const stopPips = stopMove/pip, takePips = takeMove/pip;
  const riskAmount = balance*risk/100;
  const lossPerLot = stopPips*valuePerPip, profitPerLot = takePips*valuePerPip;
  const lots = riskAmount/lossPerLot, loss = lots*lossPerLot, profit = lots*profitPerLot;
  const units = lots*contract, rr = takeMove/stopMove;
  const positionValue = units*entry;
  show('lots',lots.toFixed(4)+' LOTS');
  show('riskAmount',money(riskAmount,currency));
  show('stopDistance',stopPips.toLocaleString('en-US',{maximumFractionDigits:2})+' pips/points');
  show('loss',money(loss,currency)); show('profit',money(profit,currency));
  show('rr','1 : '+rr.toFixed(2)); show('positionValue',money(positionValue,currency));
  show('takeDistance',takePips.toLocaleString('en-US',{maximumFractionDigits:2})+' pips/points');
  show('riskPercent',risk.toFixed(2)+'%');
  show('units',units.toLocaleString('en-US',{maximumFractionDigits:2}));
  show('riskNote','At the specified stop price, this position is designed to risk approximately '+money(loss,currency)+' ('+risk.toFixed(2)+'% of your account), before trading costs. Estimated reward at take profit: '+money(profit,currency)+'.');
}
$('calculate').addEventListener('click',calculate);
$('reset').addEventListener('click',()=>{
  const defaults={balance:'1000',currency:'USD',risk:'1',market:'forex',symbol:'EURUSD',direction:'buy',entry:'1.08500',stop:'1.08000',take:'1.09500',contract:'100000',pip:'0.0001',pipValue:''};
  fields.forEach(id=>$(id).value=defaults[id]);
  $('error').textContent='';
  ['lots','riskAmount','stopDistance','loss','profit','rr','positionValue','takeDistance','riskPercent','units'].forEach(id=>show(id,'—'));
  show('riskNote','Enter your trade details and calculate your position size.');
});
fields.forEach(id=>$(id).addEventListener('change',calculate));
calculate();
})();
