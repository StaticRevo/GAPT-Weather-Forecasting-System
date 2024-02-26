const OPEN_CAGE_API_KEY = 'd22d3e2e4fe2447b831cc75d3b5a9d60';

function getWeatherCondition(weatherCode, cityName = "") {
    // Weather condition mapping remains the same as before
    // You can customize this function further if needed
}

function updateWeather(latitude, longitude) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById('city-name').innerText = document.getElementById('searchInput').value || 'Valletta';
            document.getElementById('temperature').innerText = `${data.current.temperature_2m}°C`;
            document.getElementById('condition').innerText = getWeatherConditionTop(data.current.weather_code, document.getElementById('searchInput').value || 'Valletta');
            document.getElementById('high-low').innerText = ''; // Adjust based on the API response
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('city-name').innerText = 'City not found';
            document.getElementById('temperature').innerText = '';
            document.getElementById('condition').innerText = '';
            document.getElementById('high-low').innerText = '';
        });
}

function searchLocation() {
    const searchQuery = document.getElementById('searchInput').value;

    if (searchQuery.trim() === '') {
        alert('Please enter a valid city name.');
        return;
    }

    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${searchQuery}&key=${OPEN_CAGE_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            const firstResult = data.results[0];
            if (firstResult) {
                const { lat, lng } = firstResult.geometry;
                updateWeather(lat, lng);
            } else {
                alert('City not found. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error fetching geocoding data:', error);
            alert('An error occurred. Please try again.');
        });
}

function getWeatherConditionTop(weatherCode, cityName = "") {
    // You can customize this function further based on your needs
    switch (weatherCode) {
        case 0:
            return "Sunny";
        case 1:
            return "Mainly Sunny";
        case 2:
            return "Partly Cloudy";
        case 3:
            return "Cloudy";
        case 45:
            return "Foggy";
        case 48:
            return "Rime Fog";
        case 51:
            return "Light Drizzle";
        case 53:
            return "Drizzle";
        case 55:
            return "Heavy Drizzle";
        case 56:
            return "Light Freezing Drizzle";
        case 57:
            return "Freezing Drizzle";
        case 61:
            return "Light Rain";
        case 63:
            return "Rain";
        case 65:
            return "Heavy Rain";
        case 66:
            return "Light Freezing Rain";
        case 67:
            return "Freezing Rain";
        case 71:
            return "Light Snow";
        case 73:
            return "Snow";
        case 75:
            return "Heavy Snow";
        case 77:
            return "Snow Grains";
        case 80:
            return "Light Showers";
        case 81:
            return "Showers";
        case 82:
            return "Heavy Showers";
        case 85:
            return "Light Snow Showers";
        case 86:
            return "Snow Showers";
        case 95:
            return "Thunderstorm";
        case 96:
            return "Light Thunderstorms With Hail";
        case 99:
            return "Thunderstorm With Hail";
        default:
            return "Unknown Weather";
    }
}

// Initialize with Valletta's weather
document.addEventListener('DOMContentLoaded', function () {
    updateWeather(35.8997, 14.5148); // Default to Valletta's coordinates
});
