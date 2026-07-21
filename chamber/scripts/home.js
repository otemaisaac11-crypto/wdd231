const weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=0.3476&lon=32.5825&units=metric&appid=6baa57d97277e89d98a6f522a3dc7399';

// Helper function to capitalize each word in weather descriptions
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
            console.error('Weather response error:', await response.text());
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
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

    // Filter for 12:00 PM entries for future days
    const todayStr = new Date().toISOString().split('T')[0];
    let forecastList = data.list.filter(item => item.dt_txt.includes('12:00:00') && !item.dt_txt.includes(todayStr)).slice(0, 3);

    // Fallback if current time is late in the day and today's 12:00 PM passed
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

fetchWeather();