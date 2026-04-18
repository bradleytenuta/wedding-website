// Firebase initialisation
firebase.initializeApp({
    projectId: "bradley-louise-wedding",
    appId: "1:48953931834:web:c43577a5e9a7dc7bf79d03",
    storageBucket: "bradley-louise-wedding.firebasestorage.app",
    apiKey: "AIzaSyCNttgsjEZ4xo9eRD1e7ejtDbgTAk3Ts0w",
    authDomain: "bradley-louise-wedding.firebaseapp.com",
    messagingSenderId: "48953931834"
});
firebase.appCheck().activate('6Lc7BL4sAAAAACKhXvLdjCxLfPZxOBvzDMw0hkMW', true);

// Envelope overlay animation
(function () {
    var overlay = document.getElementById('envelope-overlay');
    if (!overlay) return;

    overlay.addEventListener('click', function () {
        if (overlay.classList.contains('opening')) return;
        overlay.classList.add('opening');

        var hint = document.querySelector('.envelope-hint');
        var seal = document.querySelector('.wax-seal');
        var flap = document.querySelector('.envelope-flap');
        var letter = document.querySelector('.envelope-letter');

        hint.classList.add('hide');
        setTimeout(function () { seal.classList.add('break'); }, 100);
        setTimeout(function () { flap.classList.add('open'); }, 500);
        setTimeout(function () {
            flap.style.zIndex = '0';
            letter.classList.add('slide-out');
        }, 1900);
        setTimeout(function () { letter.style.zIndex = '10'; }, 2950);
        setTimeout(function () { overlay.classList.add('fade-out'); }, 3800);
        setTimeout(function () {
            overlay.remove();
            document.body.classList.remove('no-scroll');
        }, 4800);
    });
})();

// Wedding countdown timer
(function () {
    var countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;

    var targetDate = new Date('2026-08-01T13:00:00');

    function updateCountdown() {
        var now = new Date();
        var diff = Math.max(0, targetDate - now);

        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        var minutes = Math.floor((diff / (1000 * 60)) % 60);
        var seconds = Math.floor((diff / 1000) % 60);

        countdownEl.innerHTML =
            '<span class="countdown-unit"><span>' + days + '</span><span>days</span></span>' +
            '<span class="countdown-separator">|</span>' +
            '<span class="countdown-unit"><span>' + hours + '</span><span>hours</span></span>' +
            '<span class="countdown-separator">|</span>' +
            '<span class="countdown-unit"><span>' + minutes + '</span><span>minutes</span></span>' +
            '<span class="countdown-separator">|</span>' +
            '<span class="countdown-unit"><span>' + seconds + '</span><span>seconds</span></span>';
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
})();

// Smooth scroll for navigation
document.querySelectorAll('nav a').forEach(function (link) {
    link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// RSVP form submission
(function () {
    var form = document.getElementById('rsvp-form');
    if (!form) return;

    var submitBtn = form.querySelector('.rsvp-submit-btn');
    var messageEl = document.getElementById('rsvp-message');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var selected = form.querySelector('input[name="attending"]:checked');
        if (!selected) return;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        messageEl.textContent = '';
        messageEl.className = 'rsvp-message';

        firebase.firestore().collection('rsvps').add({
            attending: selected.value === 'yes',
            submittedAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(function () {
            messageEl.textContent = 'Thank you for your RSVP!';
            messageEl.classList.add('rsvp-message-success');
            form.reset();
        }).catch(function () {
            messageEl.textContent = 'Something went wrong. Please try again.';
            messageEl.classList.add('rsvp-message-error');
        }).finally(function () {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
        });
    });
})();
