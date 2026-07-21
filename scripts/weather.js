// Select HTML elements in the document
const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');

// Construct the OpenWeatherMap API URL
const url = 'https://api.openweathermap.org/data/2.5/weather?lat=49.75&lon=6.64&units=imperial&appid=6baa57d97277e89d98a6f522a3dc7399'; 

// Define the async function to fetch data from the API
async function apiFetch() {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log(data); // Testing output in browser console
      displayResults(data); // Calls displayResults once data arrives
    } else {
      throw Error(await response.text());
    }
  } catch (error) {
    console.log(error);
  }
}

//Function to insert the data into your HTML elements
function displayResults(data) {
  // Format temperature
  currentTemp.innerHTML = `${data.main.temp}&deg;F`;

  // Build icon URL (using OpenWeatherMap's icon library)
  const iconsrc = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
  let desc = data.weather[0].description;

  // Set image attributes and caption text
  weatherIcon.setAttribute('src', iconsrc);
  weatherIcon.setAttribute('alt', desc);
  captionDesc.textContent = `${desc}`;
}

//Invoke the fetch function
apiFetch();