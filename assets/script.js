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
