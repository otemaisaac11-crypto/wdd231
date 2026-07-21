// name=chamber/scripts/home.js
document.addEventListener('DOMContentLoaded', () => {
    // Footer dates (safe checks)
    const yearEl = document.getElementById('currentyear');
    const lastModEl = document.getElementById('lastModified');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    if (lastModEl) lastModEl.textContent = document.lastModified;

    // Toggle responsive navigation menu (safe checks)
    const menuButton = document.querySelector('#menu');
    const navigation = document.querySelector('.navigation');
    if (menuButton && navigation) {
        menuButton.addEventListener('click', () => {
            navigation.classList.toggle('open');
            menuButton.classList.toggle('open');
        });
    }

    // Weather URL (ensure key is active)
    const weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=0.3476&lon=32.5825&units=metric&appid=6baa57d97277e89d98a6f522a3dc7399';

    // Helper function to capitalize each word in weather descriptions
    function capitalizeWords(text) {
        return (text || '').toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    async function fetchWeather() {
        const weatherContainer = document.querySelector('#weather-info');
        const forecastContainer = document.querySelector('#forecast-info');
        if (!weatherContainer || !forecastContainer) return;

        // Loading state
        weatherContainer.innerHTML = '<p>Loading current weather...</p>';
        forecastContainer.innerHTML = '<p>Loading forecast...</p>';

        try {
            const response = await fetch(weatherUrl);
            if (!response.ok) {
                const text = await response.text().catch(() => '');
                throw new Error(`Weather API error: ${response.status} ${response.statusText} ${text}`);
            }

            const data = await response.json();
            if (!data || !data.list || data.list.length === 0) {
                throw new Error('Weather data is empty');
            }

            displayCurrentWeather(data, weatherContainer);
            displayForecast(data, forecastContainer);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            weatherContainer.innerHTML = '<p>Weather information is currently unavailable.</p>';
            forecastContainer.innerHTML = '<p>Forecast information is currently unavailable.</p>';
        }
    }

    function displayCurrentWeather(data, weatherContainer) {
        const current = data.list && data.list[0];
        if (!current) {
            weatherContainer.innerHTML = '<p>No current weather data available.</p>';
            return;
        }

        const currentTemp = Math.round(current.main.temp);
        const description = capitalizeWords(current.weather[0].description);
        const iconCode = current.weather[0].icon;
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

    function displayForecast(data, forecastContainer) {
        const todayStr = new Date().toISOString().split('T')[0];
        let forecastList = (data.list || []).filter(item => item.dt_txt && item.dt_txt.includes('12:00:00') && !item.dt_txt.includes(todayStr)).slice(0, 3);

        if (forecastList.length < 3) {
            forecastList = (data.list || []).filter(item => item.dt_txt && item.dt_txt.includes('12:00:00')).slice(0, 3);
        }

        if (!forecastList || forecastList.length === 0) {
            forecastContainer.innerHTML = '<p>No forecast data available.</p>';
            return;
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

    // Spotlights
    async function fetchSpotlights() {
        const spotlightContainer = document.querySelector('#spotlight-cards');
        if (!spotlightContainer) return;

        spotlightContainer.innerHTML = '<p>Loading spotlights...</p>';

        try {
            const response = await fetch('data/members.json');
            if (!response.ok) throw new Error(`Members fetch failed: ${response.status}`);

            const members = await response.json();
            if (!Array.isArray(members) || members.length === 0) {
                spotlightContainer.innerHTML = '<p>No member spotlights available.</p>';
                return;
            }

            // Filter Silver (2) and Gold (3)
            let candidates = members.filter(m => m.membershipLevel === 2 || m.membershipLevel === 3);
            if (candidates.length === 0) {
                spotlightContainer.innerHTML = '<p>No Silver/Gold members to spotlight.</p>';
                return;
            }

            // Shuffle candidates
            for (let i = candidates.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
            }

            // Choose up to 3
            const selection = candidates.slice(0, Math.min(3, candidates.length));

            spotlightContainer.innerHTML = selection.map(m => {
                const website = m.website ? `<p><a href="${m.website}" target="_blank" rel="noopener">Visit Website</a></p>` : '';
                const img = m.image ? `<img src="images/${m.image}" alt="${m.name} logo" loading="lazy" class="spotlight-img">` : '';
                return `
                    <div class="spotlight-card card">
                        ${img}
                        <h3>${m.name}</h3>
                        <p>${m.addresses || ''}</p>
                        <p>${m.phone || ''}</p>
                        ${website}
                    </div>
                `;
            }).join('');

        } catch (error) {
            console.error('Error fetching spotlights:', error);
            spotlightContainer.innerHTML = '<p>Spotlights are currently unavailable.</p>';
        }
    }

    // Kick off data loads
    fetchWeather();
    fetchSpotlights();
});