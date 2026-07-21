JavaScript
const weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=0.3476&lon=32.5825&units=metric&appid=6baa57d97277e89d98a6f522a3dc7399';
const membersUrl = 'members.json'; // Ensure this matches your JSON file path

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle Adjustment
    const menuButton = document.querySelector('#menu');
    const navMenu = document.querySelector('.navigation');

    if (menuButton && navMenu) {
        menuButton.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            menuButton.classList.toggle('open');
        });
    }

    // 2. Dynamic Footer Dates Adjustment
    const currentYearSpan = document.querySelector('#currentyear');
    const lastModifiedSpan = document.querySelector('#lastModified');

    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    if (lastModifiedSpan) {
        lastModifiedSpan.textContent = document.lastModified;
    }

    // Load API and JSON data
    fetchWeather();
    fetchSpotlights();
});

// --- Weather Functions ---
function capitalizeWords(text) {
    return text.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

async function fetchWeather() {
    try {
        const response = await fetch(weatherUrl);
        if (response.ok) {
            const data = await response.json();
            displayCurrentWeather(data);
            displayForecast(data);
        } else {
            console.error('Weather response error:', response.status);
            displayWeatherError('Unable to load weather data');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        displayWeatherError('Weather data unavailable');
    }
}

function displayWeatherError(message) {
    const weatherContainer = document.querySelector('#weather-info');
    const forecastContainer = document.querySelector('#forecast-info');
    
    if (weatherContainer) {
        weatherContainer.innerHTML = `<p>${message}</p>`;
    }
    if (forecastContainer) {
        forecastContainer.innerHTML = `<p>${message}</p>`;
    }
}

function displayCurrentWeather(data) {
    const weatherContainer = document.querySelector('#weather-info');
    if (!weatherContainer) return;

    const currentTemp = Math.round(data.list[0].main.temp);
    const description = capitalizeWords(data.list[0].weather[0].description);
    const iconCode = data.list[0].weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    weatherContainer.innerHTML = `
        <div class="current-weather-display">
            <img src="${iconUrl}" alt="${description}" width="60" height="60">
            <div>
                <p><strong>Temperature:</strong> ${currentTemp}&deg;C</p>
                <p><strong>Condition:</strong> ${description}</p>
            </div>
        </div>
    `;
}

function displayForecast(data) {
    const forecastContainer = document.querySelector('#forecast-info');
    if (!forecastContainer) return;

    const todayStr = new Date().toISOString().split('T')[0];
    let forecastList = data.list.filter(item => item.dt_txt.includes('12:00:00') && !item.dt_txt.includes(todayStr)).slice(0, 3);

    if (forecastList.length < 3) {
        forecastList = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 3);
    }

    forecastContainer.innerHTML = forecastList.map(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        const temp = Math.round(day.main.temp);
        const description = capitalizeWords(day.weather[0].description);
        const iconCode = day.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        return `
            <div class="forecast-day">
                <p><strong>${date}:</strong> ${temp}&deg;C — <img src="${iconUrl}" alt="${description}" class="forecast-icon"> ${description}</p>
            </div>
        `;
    }).join('');
}

// --- 3. Member Spotlights Adjustment ---
async function fetchSpotlights() {
    try {
        const response = await fetch(membersUrl);
        if (response.ok) {
            const members = await response.json();

            // Filter for Gold (3) and Silver (2) members only
            const qualifiedMembers = members.filter(member => member.membershipLevel === 2 || member.membershipLevel === 3);

            // Randomly shuffle the qualified members
            const shuffled = qualifiedMembers.sort(() => 0.5 - Math.random());

            // Select 2 or 3 members randomly
            const selectedMembers = shuffled.slice(0, 3);

            displaySpotlights(selectedMembers);
        } else {
            console.error('Error fetching members data');
        }
    } catch (error) {
        console.error('Error fetching member spotlights:', error);
    }
}

function displaySpotlights(members) {
    const spotlightContainer = document.querySelector('#spotlight-cards');
    if (!spotlightContainer) return;

    spotlightContainer.innerHTML = members.map(member => {
        const levelName = member.membershipLevel === 3 ? 'Gold Member' : 'Silver Member';
        return `
            <div class="member-card spotlight-card">
                <img src="images/${member.image}" alt="${member.name} Logo" loading="lazy">
                <h3>${member.name}</h3>
                <p class="membership-level"><strong>${levelName}</strong></p>
                <p>${member.addresses}</p>
                <p>${member.phone}</p>
                <p><a href="${member.website}" target="_blank" rel="noopener">Visit Website</a></p>
            </div>
        `;
    }).join('');
}