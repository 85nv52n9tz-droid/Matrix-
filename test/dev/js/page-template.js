// Single shared visual template for every development page.
// Page content stays empty until the user requests features.
export function mountTemplate(el,title,theme='gold'){
 const safe=String(title).toUpperCase();
 const page=document.createElement('section');page.className='dev-master-page theme-'+theme;
 const banner=document.createElement('div');banner.className='dev-master-banner';
 const label=document.createElement('strong');label.textContent='⌂  '+safe+' // COMMAND CORE';
 const meta=document.createElement('span');meta.className='dev-master-meta';meta.textContent='DEV • 0.0';
 banner.append(label,meta);
 const content=document.createElement('div');content.className='dev-master-content';
 const grid=document.createElement('div');grid.className='dev-master-grid';content.append(grid);
 page.append(banner,content);el.replaceChildren(page);
}
