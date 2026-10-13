(() => {
  const get = id => document.getElementById(id);
  const form = get('login-form'), email = get('login-email'), password = get('login-password');
  const toggle = get('password-toggle');
  get('login-submit').disabled = false;
  toggle.addEventListener('click', () => {
    const visible = password.type === 'password';
    password.type = visible ? 'text' : 'password';
    toggle.textContent = visible ? 'Hide' : 'Show';
    toggle.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
    toggle.setAttribute('aria-pressed', String(visible));
  });
  function validate(field) {
    if (field === email) field.value = field.value.trim();
    const error = field === email ? get('email-error') : get('password-error');
    const valid = field.checkValidity();
    error.textContent = valid ? '' : (field === email ? (field.value ? 'Enter a valid email address.' : 'Enter your email address.') : 'Enter your password.');
    field.setAttribute('aria-invalid', String(!valid));
    return valid;
  }
  [email, password].forEach(field => {
    field.addEventListener('blur', () => {if (field.value || field.getAttribute('aria-invalid') === 'true') validate(field);});
    field.addEventListener('input', () => {
      get('login-status').textContent = '';
      if (field.getAttribute('aria-invalid') === 'true') validate(field);
    });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const emailValid = validate(email), passwordValid = validate(password);
    if (!emailValid || !passwordValid) {
      get('login-status').textContent = 'Check the highlighted fields to continue.';
      (emailValid ? password : email).focus();
      return;
    }
    get('login-status').textContent = 'Sign-in is unavailable at the moment. Contact the studio for account assistance.';
  });
})();
