/* empty css              */(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function e(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(t){if(t.ep)return;t.ep=!0;const r=e(t);fetch(t.href,r)}})();const g=document.getElementById("people-data"),i=JSON.parse(g.textContent),c=document.getElementById("grid"),m=document.getElementById("search"),d=document.getElementById("stats"),l=document.getElementById("empty");function u(n){if(c.innerHTML="",n.length===0){l.classList.remove("hidden"),d.textContent="";return}l.classList.add("hidden");const o=new Set(n.map(e=>e.country)).size;d.textContent=`${n.length} brag page${n.length!==1?"s":""} across ${o} countries`;for(const e of n){const s=document.createElement("a");s.href=e.url,s.target="_blank",s.className="block bg-brag-card border border-brag-card-border rounded-2xl p-6 transition-all duration-200 hover:border-brag-orange hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(244,162,97,0.15)]";const t=`/images/people/${e.key}.jpg`,r=[e.city,e.state,e.country].filter(Boolean).join(", ");s.innerHTML=`
      <div class="flex items-center gap-4 mb-3">
        <img
          src="${t}"
          alt="${e.name}"
          class="w-14 h-14 rounded-full border-2 border-brag-orange object-cover"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        >
        <div class="w-14 h-14 rounded-full border-2 border-brag-orange bg-gradient-to-br from-brag-search-bg to-brag-card-border items-center justify-center text-xl hidden">
          ${e.name.split(" ").map(a=>a[0]).join("").slice(0,2).toUpperCase()}
        </div>
        <div>
          <h3 class="font-heading font-bold text-xl text-white">${e.name}</h3>
          <p class="text-brag-text-muted text-sm">${e.tagline}</p>
        </div>
      </div>
      <p class="text-brag-text-dim text-xs flex items-center gap-1.5">
        <span>📍</span>
        <span>${r}</span>
      </p>
    `,c.appendChild(s)}}function p(n){const o=n.toLowerCase().trim();return o?i.filter(e=>e.name.toLowerCase().includes(o)||e.tagline.toLowerCase().includes(o)||e.city.toLowerCase().includes(o)||e.state.toLowerCase().includes(o)||e.country.toLowerCase().includes(o)):i}m.addEventListener("input",n=>{u(p(n.target.value))});u(i);
