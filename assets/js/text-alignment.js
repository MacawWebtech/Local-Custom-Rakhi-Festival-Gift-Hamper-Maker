/* Match text space only between visible peers in the same row. */
(() => {
 const groups = '.products,.hamper-grid,.shop-grid,.related-grid,.collection-grid,.journal-grid,.journal-stories,.values,.steps,.maker-grid,.testimonial-grid,.service-catalogue,.service-roles,.service-inclusions,.budget-grid,.budget-gifts,.craft-grid,.h2-collection,.inspiration-grid,.about-process,.corporate-process,.corporate-usecases,.occasion-list';
 const originals = new Map(); let frame;
 function align(){
  originals.forEach((value,node)=>node.style.minHeight=value); originals.clear();
  document.querySelectorAll(groups).forEach(group=>{
   const rows=[];
   [...group.children].filter(e=>e.getClientRects().length&&getComputedStyle(e).position!=='absolute').forEach(card=>{
    const top=card.offsetTop; let row=rows.find(r=>Math.abs(r.top-top)<5);
    if(!row) rows.push(row={top,cards:[]}); row.cards.push(card);
   });
   rows.filter(r=>r.cards.length>1).forEach(({cards})=>{
    const bodies=cards.map(c=>c.querySelector(':scope>.product-info')||c);
    ['h3','h4','p:not(.eyebrow)','blockquote'].forEach(selector=>{
     const matches=bodies.map(b=>[...b.children].filter(n=>n.matches(selector)&&n.getClientRects().length));
     const count=Math.min(...matches.map(n=>n.length));
     for(let i=0;i<count;i++){
      const nodes=matches.map(n=>n[i]); const height=Math.max(...nodes.map(n=>n.getBoundingClientRect().height));
      nodes.forEach(n=>{originals.set(n,n.style.minHeight);n.style.minHeight=Math.ceil(height)+'px'});
     }
    });
   });
  });
 }
 function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(align)}
 addEventListener('resize',schedule);addEventListener('load',schedule);
 document.fonts?.ready.then(schedule);
 new MutationObserver(schedule).observe(document.querySelector('main'),{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','class']});
 schedule();
})();
