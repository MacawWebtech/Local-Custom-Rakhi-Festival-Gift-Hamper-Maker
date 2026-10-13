(() => {
  const get = id => document.getElementById(id);
  const form = get('register-form');
  const fields = ['name', 'email', 'password', 'confirm'].map(key => get('register-' + key));
  const password = get('register-password'), confirmation = get('register-confirm');
  get('register-submit').disabled = false;
  document.querySelectorAll('[data-password-toggle]').forEach(button => {
    button.addEventListener('click', () => {
      const field = get(button.dataset.passwordToggle), visible = field.type === 'password';
      field.type = visible ? 'text' : 'password';
      button.textContent = visible ? 'Hide' : 'Show';
      button.setAttribute('aria-pressed', String(visible));
      button.setAttribute('aria-label', (visible ? 'Hide ' : 'Show ') + (field === confirmation ? 'confirmation password' : 'password'));
    });
  });
  function validate(field) {
    if (field.id === 'register-name' || field.id === 'register-email') field.value = field.value.trim();
    let message = '';
    if (!field.value) {
      message = ({'register-name': 'Enter your full name.', 'register-email': 'Enter your email address.', 'register-password': 'Enter a password.', 'register-confirm': 'Confirm your password.'})[field.id];
    } else if (field === password && field.value.length < 8) {
      message = 'Use at least 8 characters for your password.';
    } else if (field === confirmation && field.value !== password.value) {
      message = 'Your passwords do not match.';
    } else if (!field.checkValidity()) {
      message = field.id === 'register-email' ? 'Enter a valid email address.' : 'Check this field and try again.';
    }
    get(field.id + '-error').textContent = message;
    field.setAttribute('aria-invalid', String(Boolean(message)));
    return !message;
  }
  fields.forEach(field => {
    field.addEventListener('blur', () => {if (field.value || field.getAttribute('aria-invalid') === 'true') validate(field);});
    field.addEventListener('input', () => {
      get('register-status').textContent = '';
      if (field.getAttribute('aria-invalid') === 'true') validate(field);
      if (field === password && (confirmation.value || confirmation.getAttribute('aria-invalid') === 'true')) validate(confirmation);
    });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const validity = fields.map(validate);
    if (validity.some(valid => !valid)) {
      get('register-status').textContent = 'Check the highlighted fields to continue.';
      fields[validity.indexOf(false)].focus();
      return;
    }
    get('register-status').textContent = 'Account registration is unavailable at the moment. Contact the studio for account assistance.';
  });
})();
