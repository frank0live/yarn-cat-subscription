(function(){
'use strict';
var body=document.body, root=document.documentElement;
var $=function(id){return document.getElementById(id)};
var fa=new Intl.NumberFormat('fa-IR'), fa1=new Intl.NumberFormat('fa-IR',{maximumFractionDigits:1});
var LOW=20, HALF=50;
var D={
  title:body.dataset.ti||'سرای اشتراک', sub:body.dataset.sub||'',
  sup:body.dataset.sup||'', ann:body.dataset.ann||'',
  dl:+body.dataset.dl||0, ul:+body.dataset.ul||0, cap:+body.dataset.cap||0,
  exp:+body.dataset.exp||0, lo:+body.dataset.lo||0,
  en:body.dataset.en!=='false', on:body.dataset.on==='true'
};
function fmtU(f){return !f?'#':f+(f.indexOf('?')>=0?'&':'?')+'format='+f;}
var UN=['بایت','کیلوبایت','مگابایت','گیگابایت','ترابایت'];
function fb(n){n=+n||0;if(n<=0)return'۰ بایت';var i=Math.floor(Math.log(n)/Math.log(1024));if(i>=UN.length)i=UN.length-1;var v=n/Math.pow(1024,i);return fa1.format(+v.toFixed(v>=100||!i?0:1))+' '+UN[i];}
function fdate(ms){if(!ms)return'—';try{return new Intl.DateTimeFormat('fa-IR-u-ca-persian',{year:'numeric',month:'long',day:'numeric'}).format(new Date(+ms));}catch(e){return'—';}}
function copyT(t){
  if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(t).then(function(){return true;},function(){return false;});
  try{var ta=document.createElement('textarea');ta.value=t;ta.style.cssText='position:fixed;top:-2000px';document.body.appendChild(ta);ta.select();var ok=document.execCommand('copy');ta.remove();return Promise.resolve(ok);}catch(e){return Promise.resolve(false);}
}
var tt=null;
function toast(m){var e=$('toastMsg');e.querySelector('.ttx').textContent=m;e.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){e.classList.remove('show');},2000);}
(function bubbles(){var h=$('bubbles');if(!h)return;for(var i=0;i<14;i++){var b=document.createElement('i');var s=4+Math.random()*10;b.style.cssText='left:'+(Math.random()*100)+'%;width:'+s+'px;height:'+s+'px;animation-duration:'+(6+Math.random()*8)+'s;animation-delay:'+(Math.random()*6)+'s';h.appendChild(b);}})();
var stage=$('stage'),yarnBall=$('yarnBall'),yarnCirc=$('yarnCirc'),yarnS2=$('yarnString2');
/* کلاف با تموم شدن حجم کوچیک و خاکستری میشه — گربه بی‌حوصله میشه */
function setYarn(p){
  p=Math.max(0,Math.min(100,+p||0));
  var s=0.35+0.65*(p/100);
  if(yarnBall)yarnBall.setAttribute('transform','translate(238,190) scale('+s.toFixed(3)+')');
  var sh=$('yarnShadow'); if(sh) sh.setAttribute('rx',(40*s).toFixed(1));
  if(yarnCirc)yarnCirc.setAttribute('fill',p<=LOW?'url(#yarnLowG)':'url(#yarnG)');
  if(yarnS2)yarnS2.style.opacity=(0.15+0.85*(p/100)).toFixed(2);
}
function moodOf(r,days,en,on){if(!en)return'cry';if(days!==null&&days<0)return'cry';if(r<=LOW)return'panic';if(r<=HALF)return'weak';if(on===false)return'sleep';if(on===true)return'happy';return'idle';}
function renderUse(v){var used=v.dl+v.ul;
  $('dlTx').textContent=fb(v.dl);$('ulTx').textContent=fb(v.ul);$('useTx').textContent=fb(used);
  var g=$('gaugeFill'),tk=$('tickTx');g.className='';
  if(v.cap>0){var up=Math.min(used/v.cap*100,100),rp=Math.max(100-up,0);
    if(rp<=10)g.classList.add('crit');else if(rp<=40)g.classList.add('low');
    g.style.width=rp.toFixed(1)+'%';tk.textContent=fa1.format(+rp.toFixed(1))+'٪ کلاف مونده';
    $('capTx').textContent=fb(v.cap);$('leftTx').textContent=fb(Math.max(v.cap-used,0));
    setYarn(rp);var db=$('dangerBox');db.hidden=!(rp<=LOW);return rp;}
  g.style.width='100%';tk.textContent='کلاف نامحدود';$('capTx').textContent='نامحدود';$('leftTx').textContent='∞';setYarn(100);$('dangerBox').hidden=true;return 100;}
function renderExp(s){var e=+s||0,dt=$('dayTx'),et=$('expTx');
  if(!e){dt.textContent='بینهایت';et.textContent='پایان ندارد';return{days:null};}
  var ms=e*1000,days=Math.ceil((ms-Date.now())/864e5);
  if(days<0){dt.textContent='تمام شد!';dt.style.color='#d61f3c';}
  else if(!days){dt.textContent='امروز';dt.style.color='#c47a00';}
  else{dt.textContent=fa.format(days)+' روز';if(days<=3)dt.style.color='#c47a00';}
  et.textContent=fdate(ms);return{days:days};}
function renderOn(on){var p=$('presence');p.classList.remove('on','off','unknown');
  if(on===null||on===undefined){p.classList.add('unknown');$('presenceTx').textContent='نامشخص';}
  else if(on){p.classList.add('on');$('presenceTx').textContent='بیدار';}
  else{p.classList.add('off');$('presenceTx').textContent='خواب';}}
var PL={vless:'VLESS',vmess:'VMess',trojan:'Trojan',ss:'SS',ssr:'SSR',hysteria:'HYS',hysteria2:'HYS2',hy2:'HYS2',tuic:'TUIC',wireguard:'WG',wg:'WG'};
function parseL(u){var s='',n='',a='',i=u.indexOf('://');if(i>0){s=u.slice(0,i).toLowerCase();var r=u.slice(i+3),h=r.indexOf('#');if(h>=0){try{n=decodeURIComponent(r.slice(h+1));}catch(e){n=r.slice(h+1);}}var at=r.lastIndexOf('@');a=(at>=0?r.slice(at+1):r).split(/[/?#]/)[0];}return{sc:s,lb:PL[s]||s.toUpperCase()||'CFG',nm:n,ad:a};}
function buildRows(){var src=document.querySelectorAll('#linkSrc .lsrc'),host=$('rows');
  if(!src.length){host.innerHTML='<div class="tiny">هنوز پیکربندی ساخته نشده</div>';$('cfgN').textContent='۰';return;}
  var order=[],g={};Array.prototype.forEach.call(src,function(n){var u=(n.querySelector('.u')||{}).textContent||'';u=u.trim();if(!u)return;var e=((n.querySelector('.e')||{}).textContent||'').trim();if(!g[e]){g[e]=[];order.push(e);}g[e].push({u:u,p:parseL(u)});});
  var tot=0,fr=document.createDocumentFragment();
  order.forEach(function(em){var li=g[em];tot+=li.length;
    var box=document.createElement('div');box.className='entry';
    var hd=document.createElement('div');hd.className='entry-h';
    var av=document.createElement('div');av.className='ava';av.textContent=em?em.trim().charAt(0).toUpperCase():'★';
    var ml=document.createElement('div');ml.className='ml';ml.textContent=em||'بی‌نام';
    var nc=document.createElement('span');nc.className='nchip2';nc.textContent=fa.format(li.length)+' لینک';
    hd.appendChild(av);hd.appendChild(ml);hd.appendChild(nc);box.appendChild(hd);
    li.forEach(function(it,n){var r=document.createElement('div');r.className='cfgrow';
      var inf=document.createElement('div');inf.className='inf';
      var nm=document.createElement('div');nm.className='nm';nm.textContent=it.p.nm||(it.p.lb+' #'+fa.format(n+1));
      var mt=document.createElement('div');mt.className='mt';
      var tg=document.createElement('span');tg.className='ptag';tg.textContent=it.p.lb;mt.appendChild(tg);
      if(it.p.ad){var ad=document.createElement('span');ad.textContent=it.p.ad;mt.appendChild(ad);}
      inf.appendChild(nm);inf.appendChild(mt);
      var bc=document.createElement('button');bc.className='minibtn';bc.textContent='⧉';bc.title='کپی';
      bc.onclick=function(){copyT(it.u).then(function(ok){toast(ok?'کپی شد!':'کپی نشد');});};
      var bq=document.createElement('button');bq.className='minibtn';bq.textContent='◈';bq.title='QR';
      bq.onclick=function(){openQ(it.u,it.p.nm||it.p.lb);};
      r.appendChild(inf);r.appendChild(bc);r.appendChild(bq);box.appendChild(r);});
    fr.appendChild(box);});
  host.innerHTML='';host.appendChild(fr);$('cfgN').textContent=fa.format(tot);}
var qp=null,cur='';
function loadQ(){if(window.QRCode)return Promise.resolve();if(qp)return qp;
  qp=new Promise(function(res,rej){var s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';s.async=true;s.onload=function(){window.QRCode?res():rej()};s.onerror=rej;document.head.appendChild(s);});return qp;}
function openQ(u,lb){cur=u;$('qrSub').textContent=lb||'';var h=$('qrBox');h.innerHTML='<div class="tiny" style="color:#666">در حال ساخت…</div>';$('qrSheet').hidden=false;
  loadQ().then(function(){h.innerHTML='';try{new window.QRCode(h,{text:u,width:200,height:200,colorDark:'#0b1e2e',colorLight:'#fff'});}catch(e){h.innerHTML='<div class="tiny">خیلی بلند است — کپی کن.</div>';}}).catch(function(){h.innerHTML='<div class="tiny">QR لود نشد — کپی کن.</div>';});}
function closeQ(){$('qrSheet').hidden=true;$('qrBox').innerHTML='';cur='';}
$('qrX').onclick=closeQ;$('qrSheet').addEventListener('click',function(e){if(e.target===$('qrSheet'))closeQ();});
$('qrCp').onclick=function(){copyT(cur).then(function(ok){toast(ok?'کپی شد!':'کپی نشد');});};
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!$('qrSheet').hidden)closeQ();});
function applyMode(m){root.setAttribute('data-mode',m==='dark'?'dark':'light');}
var sm='light';try{sm=localStorage.getItem('yarn-mode')||'light';}catch(e){}
applyMode(sm);
$('modeTg').onclick=function(){var n=root.getAttribute('data-mode')==='dark'?'light':'dark';applyMode(n);try{localStorage.setItem('yarn-mode',n);}catch(e){}toast(n==='dark'?'شب شد':'روز شد');};
$('soundTg').onclick=function(){toast('میو! 🐱');};
function applyAll(d){var r=renderUse({dl:d.dl,ul:d.ul,cap:d.cap});var ex=renderExp(d.exp);renderOn(d.online);
  var m=moodOf(r,ex.days,d.enabled,d.online);if(stage)stage.setAttribute('data-mood',m);
  var life='ok';if(!d.enabled||m==='cry'||r<=LOW)life='dying';else if(r<=HALF)life='weak';else if(m==='sleep')life='sleep';
  if(stage)stage.setAttribute('data-life',life);}
function poll(){if(location.protocol!=='http:'&&location.protocol!=='https:')return;
  fetch(location.pathname+'?format=info',{headers:{'Accept':'application/json'},cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json();}).then(function(i){
    applyAll({dl:i.downloadByte!==undefined?i.downloadByte:D.dl,ul:i.uploadByte!==undefined?i.uploadByte:D.ul,cap:i.totalByte!==undefined?i.totalByte:D.cap,exp:i.expire!==undefined?i.expire:D.exp,lo:i.lastOnline!==undefined?i.lastOnline:D.lo,online:i.isOnline,enabled:i.enabled!==undefined?i.enabled:D.en});}).catch(function(){});}
document.title=D.title;
Array.prototype.forEach.call(document.querySelectorAll('[data-t="title"]'),function(e){e.textContent=D.title;});
if(D.ann){$('msgTx').textContent=D.ann;$('msgBox').hidden=false;}
if(!D.en)$('offBox').hidden=false;
if(D.sub){$('copyMain').onclick=function(){copyT(D.sub).then(function(ok){toast(ok?'کپی شد!':'کپی نشد');});};$('qrMain').onclick=function(){openQ(D.sub,D.title);};}
else{$('copyMain').hidden=true;$('qrMain').hidden=true;}
if(D.sub){$('jsonA').href=fmtU(D.sub,'json');$('clashA').href=fmtU(D.sub,'clash');}else{$('jsonA').hidden=true;$('clashA').hidden=true;}
[$('dangerSup'),$('tailSup')].forEach(function(a){if(!a)return;if(D.sup){a.href=D.sup;a.hidden=false;}else a.hidden=true;});
buildRows();
applyAll({dl:D.dl,ul:D.ul,cap:D.cap,exp:D.exp,lo:D.lo,online:D.on,enabled:D.en});
poll();setInterval(poll,10000);
})();
