const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
const yearEl = document.querySelector('#year');

if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });
}

const tripForm = document.querySelector('#trip-form');
if (tripForm) {
    tripForm.addEventListener('submit', (event) => {
        const name = document.querySelector('#name');
        const email = document.querySelector('#email');
        const duration = document.querySelector('#duration');

        if (!name.value.trim() || !email.value.trim() || Number(duration.value) < 3) {
            event.preventDefault();
            const alert = document.createElement('div');
            alert.className = 'alert';
            alert.textContent = 'Please complete all fields. Trip durations must be at least 3 days.';
            tripForm.prepend(alert);
        }
    });
}
