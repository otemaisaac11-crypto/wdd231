document.addEventListener('DOMContentLoaded', () => {
    updateFooterDates();
    initializeNavigationMenu();
    setFormTimestamp();
    initializeMembershipModals();
    populateThankYouPage();
});

function updateFooterDates() {
    const yearEl = document.getElementById('currentyear');
    const lastModEl = document.getElementById('lastModified');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    if (lastModEl) lastModEl.textContent = document.lastModified;
}

function setFormTimestamp() {
    const timestampField = document.getElementById('timestamp');
    if (!timestampField) return;
    const now = new Date();
    timestampField.value = now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
    });
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

function initializeMembershipModals() {
    const modalLinks = document.querySelectorAll('[data-dialog]');
    modalLinks.forEach(link => {
        const dialogId = link.getAttribute('data-dialog');
        const dialog = dialogId ? document.getElementById(dialogId) : null;
        if (!dialog) return;

        link.addEventListener('click', event => {
            event.preventDefault();
            if (typeof dialog.showModal === 'function') {
                dialog.showModal();
            } else {
                dialog.setAttribute('open', '');
            }
        });
    });

    const closeButtons = document.querySelectorAll('.membership-modal .close');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const dialog = button.closest('dialog');
            if (!dialog) return;
            dialog.close();
        });
    });
}

function populateThankYouPage() {
    const summarySection = document.querySelector('.thank-you-summary');
    if (!summarySection) return;

    const params = new URLSearchParams(window.location.search);
    const firstName = params.get('firstName');
    const lastName = params.get('lastName');
    const email = params.get('email');
    const mobile = params.get('mobile');
    const organization = params.get('organization');
    const timestamp = params.get('timestamp');

    const valuesPresent = firstName && lastName && email && mobile && organization && timestamp;
    const fallback = document.getElementById('fallbackMessage');

    if (!valuesPresent) {
        if (fallback) fallback.style.display = 'block';
        return;
    }

    document.getElementById('displayFirstName').textContent = firstName;
    document.getElementById('displayLastName').textContent = lastName;
    document.getElementById('displayEmail').textContent = email;
    document.getElementById('displayMobile').textContent = mobile;
    document.getElementById('displayOrganization').textContent = organization;
    document.getElementById('displayTimestamp').textContent = timestamp;

    if (fallback) fallback.style.display = 'none';
}
