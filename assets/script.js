/**
 * Firebase — wrapped so a failure here never blocks envelope, countdown, or RSVP UI.
 */
(function initFirebase() {
    try {
        if (typeof firebase === 'undefined') return;
        if (!firebase.apps.length) {
            firebase.initializeApp({
                projectId: 'bradley-louise-wedding',
                appId: '1:48953931834:web:c43577a5e9a7dc7bf79d03',
                storageBucket: 'bradley-louise-wedding.firebasestorage.app',
                apiKey: 'AIzaSyCNttgsjEZ4xo9eRD1e7ejtDbgTAk3Ts0w',
                authDomain: 'bradley-louise-wedding.firebaseapp.com',
                messagingSenderId: '48953931834'
            });
        }
        firebase.appCheck().activate(
            new firebase.appCheck.ReCaptchaEnterpriseProvider('6Lc7BL4sAAAAACKhXvLdjCxLfPZxOBvzDMw0hkMW'),
            true
        );
    } catch (err) {
        console.warn('Firebase unavailable:', err);
    }
})();

function isFirebaseReady() {
    return typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0;
}

/** Reject if a promise does not settle within ms (prevents infinite "Submitting..." on slow/blocked App Check). */
function withTimeout(promise, ms) {
    return new Promise(function (resolve, reject) {
        var timer = setTimeout(function () {
            reject(new Error('timeout'));
        }, ms);
        promise.then(
            function (value) {
                clearTimeout(timer);
                resolve(value);
            },
            function (err) {
                clearTimeout(timer);
                reject(err);
            }
        );
    });
}

function waitForAppCheckToken() {
    if (!firebase.appCheck) return Promise.resolve();
    return firebase.appCheck().getToken(false);
}

// Envelope overlay animation (click + touch for iOS)
(function () {
    var overlay = document.getElementById('envelope-overlay');
    if (!overlay) return;

    function openEnvelope() {
        if (overlay.classList.contains('opening')) return;
        overlay.classList.add('opening');

        var hint = document.querySelector('.envelope-hint');
        var seal = document.querySelector('.wax-seal');
        var flap = document.querySelector('.envelope-flap');
        var letter = document.querySelector('.envelope-letter');

        hint.classList.add('hide');
        setTimeout(function () { seal.classList.add('break'); }, 120);
        setTimeout(function () { flap.classList.add('open'); }, 600);
        setTimeout(function () {
            flap.style.zIndex = '0';
            letter.classList.add('slide-out');
        }, 2300);
        setTimeout(function () { letter.style.zIndex = '10'; }, 3560);
        setTimeout(function () { overlay.classList.add('fade-out'); }, 4600);
        setTimeout(function () {
            overlay.remove();
            document.body.classList.remove('no-scroll');
        }, 6300);
    }

    overlay.addEventListener('click', openEnvelope);
    overlay.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openEnvelope();
        }
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
        if (href && href.charAt(0) === '#') {
            e.preventDefault();
            var target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// RSVP form submission
(function () {
    var form = document.getElementById('rsvp-form');
    if (!form) return;

    var dayGuests = [
        'Louise Lynch',
        'Bradley Tenuta',
        'Julie Lynch',
        'Nobby Rolls',
        'Lee-Anne Roche',
        'Liam Roche',
        'Jack Lynch',
        'Ria Huxley',
        'Rachel Rooney',
        'Alan Bradburn',
        'Tom Tenuta',
        'Amelia Rooney',
        'Elena Rooney',
        'Jimmy Rooney',
        'Marion Rooney',
        'Rodney Hammond',
        'Andrew Hammond',
        'Ollie Barker',
        'Laura Barker',
        'Stephen Rooney',
        'Jennifer Curror',
        'Tony Tenuta',
        'Ferruccio Tenuta',
        'Marilena Presta',
        'Asunta Presta',
        'Eileen Lynch',
        'Dolores McMahon',
        'Debbie Figg',
        'John Lynch',
        'Clare McCarthy',
        'Finbarr McCarthy',
        'Scott Granger',
        'Mary Granger',
        'Shala McMahon',
        'Matthew Wood',
        'Isabelle Tudor',
        'Michal Karpuk',
        'Liv Raciniewska',
        'Maryam Aziz',
        'Julio Petalio',
        'Ryan Ashton',
        'Sumayyah Khan',
        'Lucia Cuzzocrea',
        'Molly Hammond',
        'Sophie Morris',
        'Samuel Murkin',
        'Megan Neathway',
        'Dani Fisher',
        'Abigayle Goodrick-Latham',
        'Henry Garrard',
        'Dafydd Herdman',
        'Naim Awal',
        'Chai Chai',
        'Lucy Ladyman',
        'Richard Hope',
        'Adam Main',
        'Matt Bull',
        'Leyla Turkoglu',
        'Yash Chawhan',
        'Ally Rawlings',
        'Rupi Rai',
        'Robert Micklem',
        'Catrin Dawson',
        'Julian Bremner',
        'Juliet Carr',
        'Victoria Laycock',
        'Doug Gilder',
        'Karen Gilder',
        'Beverley Smith',
        'Adrian Smith',
        'Martin Hammond',
        'Tony Hammond',
        'Sofia Proud',
        'Sinead Pickford',
    ];

    var eveningGuests = [
        'Luisa Bell',
        'Stuart Bell',
        'Christian Bell',
        'Jessica Bell',
        'Dom Gilberts',
        'Beth Gilberts',
        'Igor Cilic',
        'James Lynch',
        'Jackie Heywood',
        'Sian Lynch',
        'Shannon Lynch',
        'John Lynch Jr',
        'Rosie Deller',
        'Clare Russell',
        'Danny Russell',
        'Emily Granger',
        'Evie Granger',
        'James Granger',
        'Poppy Granger',
        'Scarlett Granger',
        'Adama Kalokoh',
        'Callum Pickford',
        'Edel McMahon',
        'Maeve McMahon',
        'Kieran Chittock',
        'Bruno Duarte',
        'Kinnard Lowe',
        'Elisha Wontumi',
        'Manisha Kohli',
        'Camilla Catling',
        'Alyson Morrell',
        'Megan Brown',
        'Emily Cannell',
        'Paige Gibbons',
        'Michelle Sparrow',
        'Colin Sparrow ',
        'Oscar Chan',
        'Tania Jansen Van Rensburg',
        'Arthur Roche',
        'Logan Rooney',
        'Luke Rooney',
        'Isla Barker',
        'Neil Griffin',
        'Sue Griffin',
        'Jessica Smith',
        'Paul Gummersall',
        'Michelle Dickson',
        'Neil Dickson',
        'Christine Teare',
        'Steven Teare',
        'Ewa Sierawska',
        'Evan McVittie',
        'Lorraine Levy',
        'Richard Levy',
        'Chelsea Rawlings',
        'Reggie Howard',
        'Emma Parker',
        'Sharon Spraggon',
        'Paul Bendall',
        'Josh Badrick',
        'Patrick McMahon',
        'Sue Lambi',
        'Carlos Lambi',
        'Deann McCoy',
        'Ollie McCoy',
        'Angela Blackman',
        'Michael McCarthy',
        'Ella Quashie',
        'Kane Tenuta',
        'Ottavio Tenuta',
        'Carolyn Tenuta'
    ];

    var guestList = dayGuests.concat(eveningGuests);

    function isDayGuest(name) {
        return dayGuests.some(function (g) {
            return g.toLowerCase() === name.toLowerCase();
        });
    }

    function isValidGuest(name) {
        return guestList.some(function (g) {
            return g.toLowerCase() === name.toLowerCase();
        });
    }

    var NAME_ERROR_TEXT = 'Please enter a name from the dropdown.';

    function clearNameError(nameInput) {
        nameInput.classList.remove('rsvp-name-input-invalid');
        var field = nameInput.closest('.rsvp-name-field');
        if (!field) return;
        var err = field.querySelector('.rsvp-name-error');
        if (err) err.remove();
    }

    function showNameError(nameInput) {
        nameInput.classList.add('rsvp-name-input-invalid');
        var field = nameInput.closest('.rsvp-name-field');
        if (!field || field.querySelector('.rsvp-name-error')) return;
        var err = document.createElement('p');
        err.className = 'rsvp-name-error';
        err.setAttribute('role', 'alert');
        err.textContent = NAME_ERROR_TEXT;
        field.appendChild(err);
    }

    function clearAllNameErrors() {
        form.querySelectorAll('.rsvp-name-input').forEach(clearNameError);
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
            clearNameError(input);
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

        clearAllNameErrors();
        messageEl.textContent = '';
        messageEl.className = 'rsvp-message';

        var entries = entriesContainer.querySelectorAll('.rsvp-entry');
        var invalidNameInputs = [];
        for (var j = 0; j < entries.length; j++) {
            var entryNameInput = entries[j].querySelector('.rsvp-name-input');
            if (!isValidGuest(entryNameInput.value.trim())) {
                invalidNameInputs.push(entryNameInput);
            }
        }
        if (invalidNameInputs.length) {
            invalidNameInputs.forEach(showNameError);
            invalidNameInputs[0].focus();
            return;
        }

        if (!isFirebaseReady()) {
            messageEl.textContent = 'Unable to submit right now. Please refresh and try again.';
            messageEl.className = 'rsvp-message rsvp-message-error';
            return;
        }

        var rsvps = [];
        for (var i = 0; i < entries.length; i++) {
            var nameInput = entries[i].querySelector('.rsvp-name-input');
            var selected = entries[i].querySelector('input[name^="attending"]:checked');
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

        var SUBMIT_TIMEOUT_MS = 25000;
        var submitWork = waitForAppCheckToken().then(function () {
            return batch.commit();
        });

        withTimeout(submitWork, SUBMIT_TIMEOUT_MS).then(function () {
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
        }).catch(function (err) {
            if (err && err.message === 'timeout') {
                messageEl.textContent =
                    'Submission is taking too long. Try Wi-Fi, turn off ad blockers or private browsing, refresh the page, and submit again.';
            } else {
                messageEl.textContent = 'Something went wrong. Please try again.';
            }
            messageEl.classList.add('rsvp-message-error');
        }).finally(function () {
            submitBtn.disabled = false;
            addBtn.disabled = false;
            submitBtn.textContent = 'Submit';
        });
    });
})();

(function initStoryFilmReel() {
    var track = document.querySelector('.film-reel-track');
    if (!track) return;

    var frames = track.querySelectorAll('.film-frame');
    frames.forEach(function (frame) {
        var clone = frame.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.querySelectorAll('img').forEach(function (img) {
            img.alt = '';
            img.removeAttribute('fetchpriority');
            img.loading = 'lazy';
        });
        track.appendChild(clone);
    });
})();
