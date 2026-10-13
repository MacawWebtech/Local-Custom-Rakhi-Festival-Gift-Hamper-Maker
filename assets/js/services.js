(() => {
  const title = document.getElementById('service-title');
  if (!title) return;
  const data = {
    personal: {title: 'Personal gifting.', intro: 'Handmade details, chosen around the person and the occasion.', heading: 'Make the gift feel like them.', copy: 'Choose a rakhi, gift set or personal box and add the details that belong to your bond.', package: '499', purpose: 'personal', items: [['A thoughtful selection', 'Rakhis, sibling sets and personalized gifts around the recipient’s taste.'], ['A personal detail memory', 'Initials, names and a note with a memory or a meaningful thank you.'], ['A considered finish', 'Packaging choices and final details confirmed before your gift is prepared.']]},
    festival: {title: 'Festival hamper planning.', intro: 'A considered collection for the moments that bring people together.', heading: 'Bring the celebration into the details.', copy: 'Build around your occasion, choose complementary treats and finish with a personal message.', package: '999', purpose: 'custom', items: [['Occasion-led choices', 'Choose a gifting direction around the festival and the people receiving it.'], ['A balanced hamper', 'Combine treats and keepsakes within your preferred budget.'], ['Packaging and notes', 'Coordinate the box, ribbon and personal message with the maker.']]},
    corporate: {title: 'Corporate gifting.', intro: 'Coordinated gifts for teams, clients and shared milestones.', heading: 'A thank you, thoughtfully scaled.', copy: 'Share your quantity, budget, branding and delivery requirements for a tailored gifting plan.', package: '2499', purpose: 'corporate', items: [['A coordinated collection', 'Gift contents and packaging chosen around your team or client occasion.'], ['Personal messages', 'Discuss individual notes, names and branding requirements.'], ['A clear order brief', 'Confirm the quantities, preparation schedule and delivery destinations.']]}
  };
  const requested = new URLSearchParams(location.search).get('service') || 'personal';
  const service = data[requested] || data.personal;
  title.textContent = service.title;
  document.title = service.title + ' | Tyohaar';
  document.getElementById('service-intro').textContent = service.intro;
  document.getElementById('service-heading').textContent = service.heading;
  document.getElementById('service-copy').textContent = service.copy;
  document.getElementById('service-enquire').href = 'contact.html?purpose=' + service.purpose + '#enquiry';
  service.items.forEach(([heading, copy]) => {
    const article = document.createElement('article');
    const h3 = document.createElement('h3'); h3.textContent = heading;
    const p = document.createElement('p'); p.textContent = copy;
    article.append(h3, p); document.getElementById('service-inclusions').append(article);
  });
  const form = document.getElementById('service-calculator');
  const packageSelect = document.getElementById('estimate-package');
  const quantity = document.getElementById('estimate-quantity');
  const packaging = document.getElementById('estimate-packaging');
  packageSelect.value = service.package;
  const rupees = n => '₹' + n.toLocaleString('en-IN');
  const perGift = () => Number(packageSelect.value) + Number(packaging.value);
  function update() {
    const valid = Number.isInteger(Number(quantity.value)) && Number(quantity.value) >= 1 && Number(quantity.value) <= 10000;
    quantity.setCustomValidity(valid ? '' : 'Choose a whole number from 1 to 10,000.');
    document.getElementById('estimate-total').textContent = valid ? rupees(perGift() * Number(quantity.value)) : 'Choose a quantity';
    document.getElementById('estimate-per-gift').textContent = rupees(perGift()) + ' per gift';
  }
  form.addEventListener('input', update); form.addEventListener('change', update);
  form.addEventListener('submit', event => {
    event.preventDefault(); update(); if (!form.reportValidity()) return;
    const url = new URL('contact.html', location.href);
    url.searchParams.set('purpose', service.purpose);
    url.searchParams.set('quantity', quantity.value);
    url.searchParams.set('budget', String(perGift()));
    url.searchParams.set('package', packageSelect.selectedOptions[0].text + '; ' + packaging.selectedOptions[0].text);
    url.hash = 'enquiry'; location.href = url.href;
  });
  update();
})();
