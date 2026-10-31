const MENU={"Korean":[["Classic Kimbap","Rice rolls with veg & egg",55],["Tteokbokki","Spicy rice cakes, fish cake",75],["Ramyeon Bowl","Cooked to order, egg & cheese",65],["Korean Fried Chicken","Yangnyeom or soy-garlic, 6 pcs",120],["Kimchi Fried Rice","With fried egg",85],["Japchae","Glass noodles & veg",90]],
"Maldivian Fusion":[["Tuna Kimbap","Local tuna, gochujang mayo",65],["Mas Huni Toast","Mas huni on milk bread",60],["Hedhikaa Platter","Gulha, bajiya, keemia + dips",110],["Spicy Tuna Ramyeon","Ramyeon with smoked tuna",80],["Coconut Bingsu","Shaved milk ice, coconut & mango",95]],
"Desserts":[["Strawberry Bingsu","Shaved milk ice & fresh berries",110],["Injeolmi Toast","Honey, soybean powder",70],["Dalgona Cookie","Honeycomb candy",25],["Blossom Roll Cake","Strawberry cream",60]],
"Coffee & Drinks":[["Dalgona Coffee","Whipped coffee on milk",55],["Iced Americano","Double shot",40],["Cherry Blossom Latte","Sakura-pink milk latte",60],["Banana Milk","Korean classic",35],["Yuja Tea","Citron tea, hot or iced",45],["Matcha Latte","",55],["Fresh Lime Soda","",35]]};
const $=s=>document.querySelector(s),cart={};
const toast=m=>{const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.append(t);setTimeout(()=>t.remove(),2600)};
// nav
addEventListener('scroll',()=>$('#nav').classList.toggle('solid',scrollY>40));
$('#burger').onclick=()=>$('#links').classList.toggle('open');
document.querySelectorAll('#links a').forEach(a=>a.onclick=()=>$('#links').classList.remove('open'));
// petals
const P=$('#petals');for(let i=0;i<28;i++){const p=document.createElement('i');p.className='petal';
p.style.left=Math.random()*100+'%';p.style.setProperty('--dx',(Math.random()*200-100)+'px');
p.style.animationDuration=8+Math.random()*10+'s';p.style.animationDelay=-Math.random()*15+'s';
const s=.6+Math.random()*.8;p.style.scale=s;p.style.background=['#E8A0B4','#F6D6DC','#f3b9c8'][i%3];P.append(p)}
// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
// menu
function showCat(c){document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.textContent==c));
$('#menuGrid').innerHTML=MENU[c].map(([n,d,p],i)=>`<div class="item" style="animation-delay:${i*.05}s"><div><h4>${n}</h4><p>${d}</p></div><div class="pr">MVR ${p}<br><button class="add" data-n="${n}" data-p="${p}">+ Add</button></div></div>`).join('')}
Object.keys(MENU).forEach(c=>{const b=document.createElement('button');b.type='button';b.textContent=c;b.onclick=()=>showCat(c);$('#tabs').append(b)});showCat('Korean');
$('#menuGrid').onclick=e=>{const b=e.target.closest('.add');if(!b)return;const n=b.dataset.n;cart[n]=cart[n]||{q:0,p:+b.dataset.p};cart[n].q++;drawCart();toast(n+' added to your basket')};
function drawCart(){const ks=Object.keys(cart).filter(k=>cart[k].q>0);let tot=0;
$('#cart').innerHTML=ks.length?ks.map(k=>{tot+=cart[k].q*cart[k].p;return`<div class="line"><span>${cart[k].q} × ${k}</span><span>MVR ${cart[k].q*cart[k].p} <button type="button" data-rm="${k}">−</button></span></div>`}).join('')+`<div class="line"><b>Estimated total</b><b>MVR ${tot}</b></div>`:'<p class="note">Your basket is empty. Tap “+ Add” on menu items.</p>';return tot}
$('#cart').onclick=e=>{const k=e.target.dataset.rm;if(k){cart[k].q--;drawCart()}};
function send(via,subject,body){const u=encodeURIComponent;
location.href=via=='wa'?`https://wa.me/9609424572?text=${u(subject+'\n\n'+body)}`:`mailto:malaak.office@gmail.com?subject=${u(subject)}&body=${u(body)}`}
$('#orderForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),via=e.submitter?.dataset.via||'wa',tot=drawCart();
const items=Object.keys(cart).filter(k=>cart[k].q).map(k=>`- ${cart[k].q} x ${k} (MVR ${cart[k].q*cart[k].p})`).join('\n');
if(!items)return toast('Add something from the menu first');
if(f.get('type')=='Delivery'&&!f.get('address'))return toast('Please add a delivery address');
send(via,`SOLÉA ${f.get('type')} order request`,`${items}\nEstimated total: MVR ${tot}\n\nName: ${f.get('name')}\nPhone: ${f.get('phone')}\n${f.get('type')=='Delivery'?'Address: '+f.get('address')+'\n':''}Time: ${f.get('time')||'ASAP'}\nNotes: ${f.get('notes')||'-'}\nPayment: on ${f.get('type').toLowerCase()}`)};
document.querySelectorAll('.bookForm').forEach(fm=>fm.onsubmit=e=>{e.preventDefault();const f=new FormData(fm);
send('wa',`SOLÉA ${fm.dataset.zone} booking request`,[...f].map(([k,v])=>`${k[0].toUpperCase()+k.slice(1)}: ${v}`).join('\n'));toast('Opening your booking request…')});
// reviews
const SAMPLES=[["Aishath","The blossom tree is so pretty and the tteokbokki is perfect!",5],["Ibrahim","Study pods are quiet and the sockets work at every seat.",5],["Mariyam","Karaoke room was so fun for my birthday. Tuna kimbap 10/10.",4]];
let rating=5;const st=$('#stars');
const drawStars=()=>st.innerHTML=[1,2,3,4,5].map(i=>`<span data-r="${i}" class="${i<=rating?'on':''}">★</span>`).join('');drawStars();
st.onclick=e=>{if(e.target.dataset.r){rating=+e.target.dataset.r;drawStars()}};
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function drawRevs(){const mine=JSON.parse(localStorage.getItem('soleaReviews')||'[]');
$('#revList').innerHTML=[...mine.map(r=>[...r,1]),...SAMPLES.map(r=>[...r,0])].map(([n,t,r,you])=>`<div class="rev"><b>${esc(n)}</b><span class="badge ${you?'you':''}">${you?'Your review (saved on this device)':'Sample review'}</span><div class="st">${'★'.repeat(r)}${'☆'.repeat(5-r)}</div><p>${esc(t)}</p></div>`).join('')}
drawRevs();
$('#revForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);const mine=JSON.parse(localStorage.getItem('soleaReviews')||'[]');
mine.unshift([f.get('name'),f.get('text'),rating]);localStorage.setItem('soleaReviews',JSON.stringify(mine));e.target.reset();rating=5;drawStars();drawRevs();toast('Thanks! Your review is saved.')};
