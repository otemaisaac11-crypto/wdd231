import discoverItems from '../data/discover-data.mjs';

document.addEventListener('DOMContentLoaded', () => {
    initializeFooter();
    initializeNavigationMenu();
    renderDiscoverCards();
    renderVisitMessage();
});

function initializeFooter() {
    const yearEl = document.getElementById('currentyear');
    const lastModEl = document.getElementById('lastModified');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    if (lastModEl) lastModEl.textContent = document.lastModified;
}

function initializeNavigationMenu() {
    const menuButton = document.querySelector('#menu');
    const navigation = document.querySelector('.navigation');
    if (!menuButton || !navigation) return;

    menuButton.addEventListener('click', () => {
        navigation.classList.toggle('open');
        menuButton.classList.toggle('open');
    });
}

function renderDiscoverCards() {
    const grid = document.getElementById('discover-grid');
    if (!grid) return;

    const fragment = document.createDocumentFragment();

    discoverItems.forEach((item, index) => {
        const card = document.createElement('article');
        card.className = `discover-card card card-${item.id}`;
        card.innerHTML = `
            <figure>
                <img src="images/${item.image}" alt="${item.imageAlt}" loading="lazy" width="300" height="200">
            </figure>
            <div class="card-content">
                <h2>${item.name}</h2>
                <address>${item.address}</address>
                <p>${item.description}</p>
                <button type="button">Learn More</button>
            </div>
        `;

        fragment.appendChild(card);
    });

    grid.appendChild(fragment);
}

function renderVisitMessage() {
    const display = document.getElementById('visitMessage');
    if (!display) return;

    const storageKey = 'discoverLastVisit';
    const now = Date.now();
    const previous = parseInt(localStorage.getItem(storageKey), 10);

    let message = 'Welcome! Let us know if you have any questions.';

    if (!Number.isNaN(previous)) {
        const diffMs = now - previous;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            message = 'Back so soon! Awesome!';
        } else {
            message = `You last visited ${diffDays} day${diffDays === 1 ? '' : 's'} ago.`;
        }
    }

    display.textContent = message;
    localStorage.setItem(storageKey, String(now));
}
