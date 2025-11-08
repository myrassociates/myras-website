function submitForm(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const out = document.getElementById('formResult');

  // For now we'll just show a friendly message (no server)
  out.innerText = `Thanks ${name}! Your message has been noted. We will contact you at ${email}.`;
  // Clear form
  document.getElementById('contactForm').reset();
  return false;
}
