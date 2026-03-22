// RSVP form handling
const rsvpForm = document.getElementById('rsvp-form');
const rsvpMessage = document.getElementById('rsvp-message');
if (rsvpForm) {
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = rsvpForm.name.value;
        const email = rsvpForm.email.value;
        const attendance = rsvpForm.attendance.value;
        if (name && email && attendance) {
            rsvpMessage.textContent = `Thank you, ${name}, for your RSVP!`;
            rsvpForm.reset();
        } else {
            rsvpMessage.textContent = 'Please fill out all fields.';
        }
    });
}
// Contact form handling
const contactForm = document.getElementById('contact-form');
const contactMessage = document.getElementById('contact-message');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = contactForm.name.value;
        const email = contactForm.email.value;
        const message = contactForm.message.value;
        if (name && email && message) {
            contactMessage.textContent = `Thank you, ${name}, for reaching out!`;
            contactForm.reset();
        } else {
            contactMessage.textContent = 'Please fill out all fields.';
        }
    });
}
// Smooth scroll for navigation
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
        }
    });
});