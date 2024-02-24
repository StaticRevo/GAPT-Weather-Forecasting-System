const newAPIKey = 'K7AN4VPX6ZTLUL4ET72UFN5DB'; // Replace with your new API key

// Mapping of conditions to emojis
const conditionEmojis = {
    'Rain, Partially cloudy': '🌦️',
    'Rain': '🌧️',
    'Partially cloudy': '⛅',
    'Rain, Overcast': '🌧️',
    'Snow, Rain, Overcast': '🌨️',
    'Snow, Rain, Partially cloudy': '🌨️',
    'Overcast': '☁️',
    'Clear': '☀️',
};

// Function to fetch weather data for a given location and day
function fetchWeatherData(location, day) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + day);
    const tomorrowString = tomorrow.toISOString().slice(0, 10);

    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${tomorrowString}/${tomorrowString}?unitGroup=metric&include=days%2Ccurrent%2Chours%2Calerts&key=${newAPIKey}&contentType=json`)
        .then(response => response.json())
        .then(data => {
            const weatherData = data.days[0]; // Assuming you want the weather for the first day

            const dayName = document.getElementById(`day-name${day}`);
            const date = document.getElementById(`date${day}`);
            const conditions = document.getElementById(`conditions${day}`);
            const highTemp = document.getElementById(`high-temp${day}`);
            const lowTemp = document.getElementById(`low-temp${day}`);

            dayName.textContent = weatherData.dayOfWeek;
            date.textContent = formatDateString(weatherData.datetime);

            // Update conditions with emoji based on the mapped conditions
            conditions.textContent = conditionEmojis[weatherData.conditions] || weatherData.conditions;

            highTemp.textContent = `High: ${weatherData.tempmax}°C`;
            lowTemp.textContent = `Low: ${weatherData.tempmin}°C`;
        })
        .catch(error => console.error(`Error fetching weather data for day ${day} in ${location}:`, error));
}

// Initial load for Valletta
for (let day = 1; day <= 14; day++) {
    fetchWeatherData('Valletta', day);
}

// Function to respond to search bar
function searchLocationForecast() {
    const searchInput = document.getElementById('searchInput');
    const location = searchInput.value.trim();

    if (location) {
        for (let day = 1; day <= 14; day++) {
            fetchWeatherData(location, day);
        }
    } else {
        alert("Please enter a location in the search bar.");
    }
}

function formatDateString(isoString) {
    return new Date(isoString).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
}
