import { fetchAttractions } from './data.js';

const filterButtons = document.querySelectorAll('.filter-pill');
const destinationsGrid = document.querySelector('#destinations-grid');
const modal = document.querySelector('#destination-modal');
const modalContent = document.querySelector('#modal-content');

const savedFilter = localStorage.getItem('uganda-filter') || 'All';

function createCard(attraction) {
    return `
    <article class="destination-card">
      <img src="${attraction.image}" alt="${attraction.name}" loading="lazy" width="800" height="600">
      <div class="destination-body">
        <div class="meta-row">
          <span>${attraction.region}</span>
          <span>${attraction.estimatedCost}</span>
        </div>
        <h3>${attraction.name}</h3>
        <p>${attraction.description}</p>
        <div class="card-actions">
          <button class="secondary-btn view-details" data-id="${attraction.id}">View details</button>
          <button class="small-btn save-choice" data-name="${attraction.name}">Save</button>
        </div>
      </div>
    </article>
  `;
}

function openModal(item) {
    modalContent.innerHTML = `
    <button class="modal-close" type="button" aria-label="Close destination details">&times;</button>
    <img class="modal-image" src="${item.image}" alt="${item.name}" loading="lazy" width="800" height="600">
    <div class="meta-row">
      <span>${item.region}</span>
      <span>${item.bestTime}</span>
    </div>
    <h2>${item.name}</h2>
    <p>${item.description}</p>
    <p><strong>Highlight:</strong> ${item.highlight}</p>
    <p><strong>Distance:</strong> ${item.distance}</p>
    <p><strong>Estimated cost:</strong> ${item.estimatedCost}</p>
    <ul class="list-inline">
      ${item.activities.map((activity) => `<li>${activity}</li>`).join('')}
    </ul>
  `;

    const closeButton = modalContent.querySelector('.modal-close');
    closeButton.addEventListener('click', () => modal.close());
    modal.showModal();
}

function renderAttractions(items) {
    destinationsGrid.innerHTML = items.map(createCard).join('');

    const detailButtons = document.querySelectorAll('.view-details');
    detailButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            const selected = items.find((item) => item.id === Number(button.dataset.id));
            if (selected) openModal(selected);
        });
    });

    const saveButtons = document.querySelectorAll('.save-choice');
    saveButtons.forEach((button) => {
        button.addEventListener('click', () => {
            localStorage.setItem('uganda-favorite', button.dataset.name);
            button.textContent = 'Saved';
            button.disabled = true;
        });
    });
}

async function loadAttractions(filter = 'All') {
    try {
        const attractions = await fetchAttractions();
        const filteredItems = filter === 'All'
            ? attractions
            : attractions.filter((item) => item.category === filter);

        renderAttractions(filteredItems);
    } catch (error) {
        destinationsGrid.innerHTML = '<div class="alert">We could not load the destinations. Please try again soon.</div>';
    }
}

filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === savedFilter;
    button.classList.toggle('active', isActive);
    button.addEventListener('click', () => {
        filterButtons.forEach((item) => item.classList.toggle('active', item === button));
        localStorage.setItem('uganda-filter', button.dataset.filter);
        loadAttractions(button.dataset.filter);
    });
});

loadAttractions(savedFilter);
