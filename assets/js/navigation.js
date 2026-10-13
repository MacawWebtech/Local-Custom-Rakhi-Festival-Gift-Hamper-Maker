(() => {
  const nav = document.querySelector('#nav');
  const links = [...nav.querySelectorAll('a')];
  const groups = [...nav.querySelectorAll('.home-dropdown')];
  const menu = document.querySelector('#menu-toggle');
  const pageName = url => url.pathname.split('/').pop() || 'index.html';
  function updateActiveMenu() {
    const current = new URL(location.href);
    const currentPage = pageName(current);
    const page = ({'product-details.html': 'shop.html', 'blog-details.html': 'blog.html'})[currentPage] || currentPage;
    links.forEach(link => {link.classList.remove('active'); link.removeAttribute('aria-current');});
    groups.forEach(group => group.classList.remove('active'));
    const selected = links.find(link => {
      const target = new URL(link.getAttribute('href'), current);
      return pageName(target) === page && !target.hash;
    });
    if (selected) {
      selected.classList.add('active'); selected.setAttribute('aria-current', 'page');
      groups.filter(group => group.contains(selected)).forEach(group => group.classList.add('active'));
    }
  }
  function closeMenus() {
    nav.classList.remove('open'); groups.forEach(group => group.open = false);
    menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation');
    menu.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
  }
  links.forEach(link => {link.onclick = closeMenus;});
  groups.forEach(group => group.addEventListener('toggle', () => {
    if (group.open) groups.filter(other => other !== group).forEach(other => other.open = false);
  }));
  menu.addEventListener('click', () => menu.setAttribute('aria-label', nav.classList.contains('open') ? 'Close navigation' : 'Open navigation'));
  document.addEventListener('keydown', event => {if (event.key === 'Escape') closeMenus();});
  document.addEventListener('click', event => {if (!nav.contains(event.target) && !menu.contains(event.target)) groups.forEach(group => group.open = false);});
  window.addEventListener('hashchange', updateActiveMenu); window.addEventListener('pageshow', updateActiveMenu);
  updateActiveMenu();
})();
