const state={chats:[
{id:1,name:"أحمد",avatar:"👨",status:"متصل الآن",msgs:[{t:"أهلاً! 👋",mine:false},{t:"أهلاً يا أحمد، عامل إيه؟",mine:true},{t:"تمام الحمد لله 😄",mine:false}]},
{id:2,name:"سارة",avatar:"👩",status:"آخر ظهور اليوم",msgs:[{t:"فينك؟",mine:false}]},
{id:3,name:"أصحابي",avatar:"👥",status:"3 أعضاء",msgs:[{t:"يلا يا جماعة 😄",mine:false}]}
],view:"chats",active:null};

const main=document.getElementById("main"), fab=document.getElementById("fab"), toast=document.getElementById("toast");
function save(){localStorage.setItem("mockchat",JSON.stringify(state.chats))}
function load(){try{const x=JSON.parse(localStorage.getItem("mockchat"));if(Array.isArray(x))state.chats=x}catch{}}
function time(){return new Date().toLocaleTimeString("ar-EG",{hour:"2-digit",minute:"2-digit"})}
function render(){
 document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x.dataset.view===state.view));
 if(state.view==="chats") renderChats();
 else if(state.view==="updates") renderUpdates();
 else if(state.view==="communities") renderCommunities();
 else renderCalls();
}
function renderChats(){
 main.innerHTML='<div class="search"><input id="filter" placeholder="🔎  بحث"></div><div class="list" id="chatList"></div>';
 const list=document.getElementById("chatList");
 const draw=q=>{list.innerHTML="";state.chats.filter(c=>c.name.includes(q)).forEach(c=>{
  const last=c.msgs.at(-1);const el=document.createElement("div");el.className="row";el.innerHTML=`<div class="avatar">${c.avatar}</div><div class="info"><b>${esc(c.name)}</b><div class="preview">${esc(last?.t||"لا توجد رسائل")}</div></div><div class="time">${last?time():""}</div>`;
  el.onclick=()=>openChat(c.id);list.appendChild(el);
 })};draw("");document.getElementById("filter").oninput=e=>draw(e.target.value);
 fab.onclick=()=>createChat();
}
function openChat(id){
 state.active=id;const c=state.chats.find(x=>x.id===id);const frag=document.getElementById("chatTemplate").content.cloneNode(true);
 main.replaceChildren(frag);document.querySelector(".chat-screen #chatName").textContent=c.name;document.querySelector(".chat-screen #chatStatus").textContent=c.status;
 const box=document.getElementById("messages");c.msgs.forEach(m=>addBubble(box,m));
 box.scrollTop=box.scrollHeight;document.querySelector(".back").onclick=()=>{state.active=null;render()};
 document.getElementById("send").onclick=send;document.getElementById("msgInput").onkeydown=e=>{if(e.key==="Enter")send()};
 document.getElementById("emoji").onclick=()=>document.getElementById("msgInput").value+=" 😊";
 document.getElementById("attach").onclick=()=>toastMsg("مرفقات — محاكاة Offline");
}
function addBubble(box,m){const d=document.createElement("div");d.className="bubble "+(m.mine?"mine":"theirs");d.innerHTML=`${esc(m.t)} <span class="meta">${m.time||time()} ${m.mine?'<span class="ticks">✓✓</span>':''}</span>`;box.appendChild(d)}
function send(){
 const input=document.getElementById("msgInput"),text=input.value.trim();if(!text)return;const c=state.chats.find(x=>x.id===state.active);c.msgs.push({t:text,mine:true,time:time()});addBubble(document.getElementById("messages"),{t:text,mine:true,time:time()});input.value="";save();
 setTimeout(()=>botReply(c),650);
}
function botReply(c){
 const replies=["تمام 😄","حاضر، ولا يهمك.","ههههه 😂","ماشي، خلينا نكمل.","أنا موجود 👍","فهمتك.","حلو جدًا!"];
 const r=replies[Math.floor(Math.random()*replies.length)];c.msgs.push({t:r,mine:false,time:time()});if(state.active===c.id){addBubble(document.getElementById("messages"),{t:r,mine:false,time:time()});const b=document.getElementById("messages");b.scrollTop=b.scrollHeight}else toastMsg(c.name+" أرسل رسالة");save();
}
function createChat(){const name=prompt("اسم الصديق الوهمي:");if(!name)return;state.chats.unshift({id:Date.now(),name,avatar:"👤",status:"متصل الآن",msgs:[]});save();render()}
function renderUpdates(){main.innerHTML='<div class="card"><h2>التحديثات</h2><p>الحالات والقنوات — محاكاة Offline.</p><button class="primary" onclick="toastMsg('تم إنشاء حالة وهمية')">＋ إضافة حالة</button></div>'}
function renderCommunities(){main.innerHTML='<div class="card"><h2>المجتمعات</h2><p>أنشئ مساحة تجمع فيها مجموعاتك الوهمية.</p><button class="primary" onclick="toastMsg('ميزة المجتمعات جاهزة للمحاكاة')">إنشاء مجتمع</button></div>'}
function renderCalls(){main.innerHTML='<div class="card"><h2>المكالمات</h2><p>سجل المكالمات وواجهات الاتصال هنا للمحاكاة فقط.</p><button class="primary" onclick="toastMsg('هذه مكالمة محاكاة Offline')">بدء مكالمة</button></div>'}
function toastMsg(s){toast.textContent=s;toast.style.display="block";clearTimeout(window.tt);window.tt=setTimeout(()=>toast.style.display="none",1800)}
function esc(s){return String(s).replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]))}
document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{state.view=t.dataset.view;render()});
document.getElementById("searchBtn").onclick=()=>toastMsg("استخدم البحث داخل قائمة الدردشات");
document.getElementById("menuBtn").onclick=()=>toastMsg("القائمة — محاكاة");
load();render();
