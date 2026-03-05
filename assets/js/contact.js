/* contact.js — TIMBUKTU contact form
 *
 * Requires EmailJS SDK in contact.html <head>:
 *   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
 *
 * Setup (free, ~10 min at emailjs.com):
 *   1. Add Service → connect Gmail → copy Service ID   → EMAILJS_SERVICE_ID
 *   2. Create Template using {{from_name}} {{from_email}} {{subject}} {{message}}
 *                           → copy Template ID          → EMAILJS_TEMPLATE_ID
 *   3. Account → General → Public Key                  → EMAILJS_PUBLIC_KEY
 */

/* contact.js — TIMBUKTU contact form */

const EMAILJS_SERVICE_ID  = 'tmt-contact-email';
const EMAILJS_TEMPLATE_ID = 'template_p3uunsw';
const EMAILJS_PUBLIC_KEY  = 'd2z4MFJgEv0cQIdVB';

emailjs.init(EMAILJS_PUBLIC_KEY);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showErr(id) { document.getElementById(id).classList.add('visible'); }
function hideErr(id) { document.getElementById(id).classList.remove('visible'); }

function setStatus(id, msg, type) {
    const el = document.getElementById(id);
    el.textContent = msg;
    el.className   = 'form-status ' + type;
}

function sendContact() {
    document.getElementById('contactStatus').className   = 'form-status';
    document.getElementById('contactStatus').textContent = '';

    const name    = document.getElementById('c-name').value.trim();
    const email   = document.getElementById('c-email').value.trim();
    const subject = document.getElementById('c-subject').value;
    const message = document.getElementById('c-message').value.trim();
    let valid = true;

    name                 ? hideErr('err-name')    : (showErr('err-name'),    valid = false);
    EMAIL_RE.test(email) ? hideErr('err-email')   : (showErr('err-email'),   valid = false);
    subject              ? hideErr('err-subject') : (showErr('err-subject'), valid = false);
    message              ? hideErr('err-message') : (showErr('err-message'), valid = false);

    if (!valid) return;

    const btn = document.getElementById('contactBtn');
    btn.disabled    = true;
    btn.textContent = 'Sending…';

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        // These names must match your EmailJS template variables exactly
        from_name:    name,
        from_email:   email,
        subject:      subject,
        message:      message,
        // Aliases in case your template uses these instead
        name:         name,
        email:        email,
        title:        subject,
        reply_to:     email
    })
    .then(() => {
        setStatus('contactStatus', '✓ Message sent! We\'ll be in touch soon.', 'success');
        document.getElementById('c-name').value    = '';
        document.getElementById('c-email').value   = '';
        document.getElementById('c-message').value = '';
        document.getElementById('c-subject').selectedIndex = 0;
    })
    .catch(() => {
        setStatus('contactStatus', 'Something went wrong. Please email owner.timbuktu@gmail.com directly.', 'error');
    })
    .finally(() => {
        btn.disabled    = false;
        btn.textContent = 'Send Message';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('contactBtn').addEventListener('click', sendContact);
});