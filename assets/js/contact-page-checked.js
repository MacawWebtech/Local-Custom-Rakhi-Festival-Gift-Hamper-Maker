(() => {
  const get = id => document.getElementById(id), api = window.tyohaarRequests;
  const todayParts = new Intl.DateTimeFormat('en-CA', {timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit'}).formatToParts(new Date());
  const part = type => todayParts.find(p => p.type === type).value;
  const today = part('year') + '-' + part('month') + '-' + part('day');
  get('enquiry-date').min = today; get('consultation-date').min = today;
  const form = get('enquiry-form'), filesInput = get('enquiry-files'), purpose = get('enquiry-purpose');
  const params = new URLSearchParams(location.search);
  if ([...purpose.options].some(option => option.value === params.get('purpose'))) purpose.value = params.get('purpose');
  ['quantity', 'budget'].forEach(key => {const n = Number(params.get(key)); if (Number.isInteger(n) && n >= 1 && n <= Number(form.elements[key].max)) form.elements[key].value = String(n);});
  if (params.get('package')) form.elements.message.value = 'Preferred package: ' + params.get('package').slice(0, 500);
  function purposeFields() {
    const feedback = purpose.value === 'feedback' || purpose.value === 'account', visit = purpose.value === 'visit';
    ['quantity', 'budget', 'occasion', 'date', 'location'].forEach(key => {
      const field = form.elements[key]; const hidden = feedback || (visit && ['quantity', 'budget', 'occasion'].includes(key));
      field.closest('label').hidden = hidden; field.disabled = hidden; field.required = !hidden && !(visit && key === 'location');
    });
    form.elements.message.placeholder = purpose.value === 'account' ? 'Tell us what help you need with account access…' : feedback ? 'Tell us about the gift, the recipient and the detail they loved…' : 'Gift contents, names, notes, packaging or branding requirements…';
  }
  purpose.addEventListener('change', purposeFields); purposeFields();
  filesInput.addEventListener('change', () => {
    const files = [...filesInput.files], error = api.validateFiles(files);
    filesInput.setCustomValidity(error);
    get('file-status').textContent = error || (files.length ? files.map(file => file.name + ' (' + (file.size / 1024 / 1024).toFixed(1) + ' MB)').join(' · ') : 'No files selected.');
  });
  form.addEventListener('submit', async event => {
    event.preventDefault(); const files = [...filesInput.files], error = api.validateFiles(files);
    if (error) {get('enquiry-status').textContent = error; return;}
    if (!form.reportValidity()) return;
    if (!form.elements.date.disabled && form.elements.date.value < today) {get('enquiry-status').textContent = 'Please choose today or a future gifting date.'; return;}
    const values = new FormData(form); const button = get('enquiry-submit'); button.disabled = true; filesInput.disabled = true;
    get('enquiry-status').textContent = 'Preparing your enquiry packet…';
    try {
      const text = 'TYOHAAR GIFTING ENQUIRY\n\n' + [...values].map(([key, value]) => key.charAt(0).toUpperCase() + key.slice(1) + ': ' + value).join('\n') + '\n\nReferences: ' + (files.map(file => file.name).join(', ') || 'None') + '\n\nPlease confirm availability, contents, final pricing and delivery.\n';
      const entries = [{name: 'gifting-enquiry.txt', bytes: api.encode(text)}];
      for (let i = 0; i < files.length; i++) {
        let filename = files[i].name.replace(/[\\/\u0000-\u001f:]/g, '_');
        if (filename.length > 120) filename = filename.slice(0, 110) + filename.slice(filename.lastIndexOf('.'));
        entries.push({name: 'references/' + String(i + 1).padStart(2, '0') + '-' + filename, bytes: new Uint8Array(await files[i].arrayBuffer())});
      }
      api.download(api.makeZip(entries), 'tyohaar-enquiry-packet.zip');
      get('enquiry-status').textContent = 'Your enquiry packet is ready. Share the downloaded ZIP with the maker to confirm your gifting plan.';
    } catch {get('enquiry-status').textContent = 'The packet could not be prepared. Please reselect your files and try again.';}
    finally {button.disabled = false; filesInput.disabled = false;}
  });
  get('consultation-form').addEventListener('submit', event => {
    event.preventDefault(); const form = event.currentTarget; if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form));
    try {
      const calendar = api.calendar(values);
      const brief = 'TYOHAAR CONSULTATION REQUEST\n\nName: ' + values.name + '\nEmail: ' + values.email + '\nPreferred date: ' + values.date + '\nPreferred time: ' + values.time + ' (India time)\n\n' + values.message + '\n\nRequest is unconfirmed. Share with the maker to agree availability.\n';
      api.download(api.makeZip([{name: 'consultation-request.txt', bytes: api.encode(brief)}, {name: 'tentative-consultation.ics', bytes: api.encode(calendar)}]), 'tyohaar-consultation-request.zip');
      get('consultation-status').textContent = 'Your request and tentative calendar reminder are ready. Share the request with the maker; the appointment is not yet confirmed.';
    } catch (error) {get('consultation-status').textContent = error.message;}
  });
  get('area-form')?.addEventListener('submit', event => {
    event.preventDefault(); const query = get('area-query').value.trim(); if (!query) return;
    get('area-map').src = 'https://maps.google.com/maps?q=' + encodeURIComponent(query) + '&output=embed';
    get('area-map').hidden = false; get('map-start').hidden = true;
    get('area-status').textContent = 'Map for ' + query + '. Confirm delivery availability with the maker.';
  });
})();

