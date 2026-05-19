self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
// Firebase initialisation
firebase.initializeApp({
    projectId: "bradley-louise-wedding",
    appId: "1:48953931834:web:c43577a5e9a7dc7bf79d03",
    storageBucket: "bradley-louise-wedding.firebasestorage.app",
    apiKey: "AIzaSyCNttgsjEZ4xo9eRD1e7ejtDbgTAk3Ts0w",
    authDomain: "bradley-louise-wedding.firebaseapp.com",
    messagingSenderId: "48953931834"
});
firebase.appCheck().activate(
    new firebase.appCheck.ReCaptchaEnterpriseProvider('6Lc7BL4sAAAAACKhXvLdjCxLfPZxOBvzDMw0hkMW'),
    true
);

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

    var dayGuests = [
        'Bradley Tenuta',
        'Louise Lynch'
    ];

    var eveningGuests = [
        'Louisa Tenuta'
    ];

    var guestList = dayGuests.concat(eveningGuests);

    function isDayGuest(name) {
        return dayGuests.some(function (g) {
            return g.toLowerCase() === name.toLowerCase();
        });
    }

    function isAttendingYes(entry) {
        var selected = entry.querySelector('input[name^="attending"]:checked');
        return selected && selected.value === 'yes';
    }

    function updateConditionalFields(entry) {
        var attending = isAttendingYes(entry);
        var nameInput = entry.querySelector('.rsvp-name-input');
        var name = nameInput ? nameInput.value.trim() : '';
        var menuField = entry.querySelector('.rsvp-menu-field');
        var dietaryField = entry.querySelector('.rsvp-dietary-field');

        if (attending && isDayGuest(name)) {
            menuField.style.display = '';
            menuField.querySelectorAll('.rsvp-menu-question').forEach(function (q) {
                q.querySelector('input[type="radio"]').required = true;
            });
            var dessert = menuField.querySelector('input[name^="dessert"]');
            if (dessert) dessert.checked = true;
        } else {
            menuField.style.display = 'none';
            menuField.querySelectorAll('input[type="radio"]').forEach(function (r) {
                r.required = false;
                r.checked = false;
            });
        }

        if (attending) {
            dietaryField.style.display = '';
        } else {
            dietaryField.style.display = 'none';
            var textarea = dietaryField.querySelector('textarea');
            if (textarea) textarea.value = '';
        }
    }

    function initAttendingListener(entry) {
        entry.querySelectorAll('input[name^="attending"]').forEach(function (radio) {
            radio.addEventListener('change', function () {
                updateConditionalFields(entry);
            });
        });
    }

    function initAutocomplete(input) {
        var list = input.nextElementSibling;
        var entry = input.closest('.rsvp-entry');

        input.addEventListener('input', function () {
            var val = input.value.trim().toLowerCase();
            list.innerHTML = '';
            updateConditionalFields(entry);
            if (val.length < 2) return;
            var matches = guestList.filter(function (name) {
                return name.toLowerCase().indexOf(val) !== -1;
            });
            matches.forEach(function (name) {
                var li = document.createElement('li');
                li.textContent = name;
                li.addEventListener('mousedown', function (e) {
                    e.preventDefault();
                    input.value = name;
                    list.innerHTML = '';
                    updateConditionalFields(entry);
                });
                list.appendChild(li);
            });
        });

        input.addEventListener('blur', function () {
            setTimeout(function () { list.innerHTML = ''; }, 150);
        });
    }

    var firstEntry = form.querySelector('.rsvp-entry');
    var firstInput = form.querySelector('.rsvp-name-input');
    if (firstInput) initAutocomplete(firstInput);
    if (firstEntry) initAttendingListener(firstEntry);

    var entriesContainer = document.getElementById('rsvp-entries');
    var addBtn = document.getElementById('rsvp-add-another');
    var submitBtn = form.querySelector('.rsvp-submit-btn');
    var messageEl = document.getElementById('rsvp-message');
    var entryCount = 1;

    addBtn.addEventListener('click', function () {
        entryCount++;
        var entry = document.createElement('div');
        entry.className = 'rsvp-entry';
        entry.innerHTML =
            '<fieldset class="rsvp-name-field">' +
                '<legend>Full Name</legend>' +
                '<div class="rsvp-autocomplete">' +
                    '<input type="text" class="form-control rsvp-name-input" name="fullname_' + entryCount + '" placeholder="Start typing their name..." autocomplete="off" required>' +
                    '<ul class="rsvp-autocomplete-list"></ul>' +
                '</div>' +
            '</fieldset>' +
            '<fieldset>' +
                '<legend>Will they be attending the wedding?</legend>' +
                '<div class="form-check">' +
                    '<input class="form-check-input" type="radio" name="attending_' + entryCount + '" id="attending-yes-' + entryCount + '" value="yes" required>' +
                    '<label class="form-check-label" for="attending-yes-' + entryCount + '">Yes</label>' +
                '</div>' +
                '<div class="form-check">' +
                    '<input class="form-check-input" type="radio" name="attending_' + entryCount + '" id="attending-no-' + entryCount + '" value="no">' +
                    '<label class="form-check-label" for="attending-no-' + entryCount + '">No</label>' +
                '</div>' +
            '</fieldset>' +
            '<div class="rsvp-menu-field" style="display:none;">' +
                '<legend class="rsvp-menu-title">Please select your meal choices</legend>' +
                '<fieldset class="rsvp-menu-question">' +
                    '<legend>Starters</legend>' +
                    '<div class="form-check">' +
                        '<input class="form-check-input" type="radio" name="starter_' + entryCount + '" id="starter-' + entryCount + '-1" value="Woodlands Prawn Cocktail">' +
                        '<label class="form-check-label" for="starter-' + entryCount + '-1">Woodlands Prawn Cocktail</label>' +
                    '</div>' +
                    '<div class="form-check">' +
                        '<input class="form-check-input" type="radio" name="starter_' + entryCount + '" id="starter-' + entryCount + '-2" value="Roasted Tomato and Basil Soup">' +
                        '<label class="form-check-label" for="starter-' + entryCount + '-2">Roasted Tomato and Basil Soup</label>' +
                    '</div>' +
                '</fieldset>' +
                '<fieldset class="rsvp-menu-question">' +
                    '<legend>Mains</legend>' +
                    '<div class="form-check">' +
                        '<input class="form-check-input" type="radio" name="main_' + entryCount + '" id="main-' + entryCount + '-1" value="Roast Breast of Corn Fed Chicken">' +
                        '<label class="form-check-label" for="main-' + entryCount + '-1">Roast Breast of Corn Fed Chicken</label>' +
                    '</div>' +
                    '<div class="form-check">' +
                        '<input class="form-check-input" type="radio" name="main_' + entryCount + '" id="main-' + entryCount + '-2" value="Wild Mushroom Risotto">' +
                        '<label class="form-check-label" for="main-' + entryCount + '-2">Wild Mushroom Risotto</label>' +
                    '</div>' +
                '</fieldset>' +
                '<fieldset class="rsvp-menu-question">' +
                    '<legend>Dessert</legend>' +
                    '<div class="form-check">' +
                        '<input class="form-check-input" type="radio" name="dessert_' + entryCount + '" id="dessert-' + entryCount + '-1" value="Sticky Toffee Pudding" checked>' +
                        '<label class="form-check-label" for="dessert-' + entryCount + '-1">Sticky Toffee Pudding</label>' +
                    '</div>' +
                '</fieldset>' +
            '</div>' +
            '<fieldset class="rsvp-dietary-field" style="display:none;">' +
                '<legend>Do you have any dietary requirements?</legend>' +
                '<textarea class="form-control rsvp-dietary-input" name="dietary_' + entryCount + '" rows="2" placeholder="E.g. vegetarian, gluten-free, nut allergy..."></textarea>' +
            '</fieldset>';
        entriesContainer.appendChild(entry);
        var newInput = entry.querySelector('.rsvp-name-input');
        initAutocomplete(newInput);
        initAttendingListener(entry);
        newInput.focus();
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var entries = entriesContainer.querySelectorAll('.rsvp-entry');
        var rsvps = [];
        for (var i = 0; i < entries.length; i++) {
            var nameInput = entries[i].querySelector('.rsvp-name-input');
            var selected = entries[i].querySelector('input[type="radio"]:checked');
            var dietaryInput = entries[i].querySelector('.rsvp-dietary-input');
            var starterSelected = entries[i].querySelector('input[name^="starter"]:checked');
            var mainSelected = entries[i].querySelector('input[name^="main"]:checked');
            var dessertSelected = entries[i].querySelector('input[name^="dessert"]:checked');
            if (!nameInput.value.trim() || !selected) return;
            rsvps.push({
                fullName: nameInput.value.trim(),
                attending: selected.value === 'yes',
                starter: starterSelected ? starterSelected.value : '',
                main: mainSelected ? mainSelected.value : '',
                dessert: dessertSelected ? dessertSelected.value : '',
                dietary: dietaryInput ? dietaryInput.value.trim() : '',
                submittedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }

        submitBtn.disabled = true;
        addBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        messageEl.textContent = '';
        messageEl.className = 'rsvp-message';

        var batch = firebase.firestore().batch();
        rsvps.forEach(function (rsvp) {
            var ref = firebase.firestore().collection('rsvps').doc();
            batch.set(ref, rsvp);
        });

        batch.commit().then(function () {
            messageEl.textContent = 'Thank you for your RSVP!';
            messageEl.classList.add('rsvp-message-success');
            form.reset();
            while (entriesContainer.children.length > 1) {
                entriesContainer.removeChild(entriesContainer.lastChild);
            }
            entryCount = 1;
            var remainingEntry = entriesContainer.querySelector('.rsvp-entry');
            remainingEntry.querySelector('.rsvp-menu-field').style.display = 'none';
            remainingEntry.querySelector('.rsvp-dietary-field').style.display = 'none';
        }).catch(function () {
            messageEl.textContent = 'Something went wrong. Please try again.';
            messageEl.classList.add('rsvp-message-error');
        }).finally(function () {
            submitBtn.disabled = false;
            addBtn.disabled = false;
            submitBtn.textContent = 'Submit';
        });
    });
})();
