(() => {
  const gifts = Object.entries(window.tyohaarProducts);
  const buttons = [...document.querySelectorAll('[data-budget]')];
  const grid = document.querySelector('#budget-gifts');
  const caption = document.querySelector('#budget-caption');
  const ranges = {500: [0, 500], 1000: [500, 1000], 2000: [1000, 2000], 3000: [2000, 3000]};
  const rupees = value => '₹' + value.toLocaleString('en-IN');
  function chooseBudget(button) {
    const [minimum, maximum] = ranges[button.dataset.budget];
    buttons.forEach(item => {
      item.classList.toggle('selected', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    grid.replaceChildren();
    const matching = gifts.filter(([, gift]) => gift.price > minimum && gift.price <= maximum).slice(0, 3);
    grid.dataset.count = String(matching.length);
    caption.textContent = minimum ? 'Gift ideas from ' + rupees(minimum + 1) + ' to ' + rupees(maximum) + '.' : 'Small, personal gestures up to ' + rupees(maximum) + '.';
    matching.forEach(([name, gift]) => {
      const card = document.createElement('article');
      const imageLink = document.createElement('a');
      imageLink.href = 'product-details.html?gift=' + encodeURIComponent(name);
      imageLink.className = 'budget-gift-image';
      imageLink.setAttribute('aria-label', 'Explore ' + name);
      const img = document.createElement('img');
      img.src = 'assets/images/' + gift.image + '.jpg';
      img.alt = name;
      img.width = 1000;
      img.height = 800;
      img.loading = 'lazy';
      imageLink.append(img);
      const category = document.createElement('span');
      category.className = 'eyebrow';
      category.textContent = gift.category;
      const title = document.createElement('h3');
      title.textContent = name;
      const price = document.createElement('p');
      price.className = 'budget-gift-price';
      price.textContent = rupees(gift.price);
      const link = document.createElement('a');
      link.href = imageLink.href;
      link.className = 'text-button';
      link.textContent = 'See gift details ↗';
      card.append(imageLink, category, title, price, link);
      grid.append(card);
    });
  }
  buttons.forEach(button => button.addEventListener('click', () => chooseBudget(button)));
  chooseBudget(buttons[0]);
})();
