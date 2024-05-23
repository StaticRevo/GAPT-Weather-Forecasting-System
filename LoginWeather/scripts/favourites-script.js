const apiKey = 'K7AN4VPX6ZTLUL4ET72UFN5DB';
const apiEndpoint = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

// Helper function to update the weather details in the DOM
function updateWeatherDetails(city, data) {
    const temperatureUnit = preferences.temperature_unit === 'F' ? 'fahrenheit' : 'celsius';
    const tempElement = document.getElementById(`${city.toLowerCase()}-temp`);
    const timeElement = document.getElementById(`${city.toLowerCase()}-time`);
    const conditionElement = document.getElementById(`${city.toLowerCase()}-condition`);

    // Display temperature with a larger font
    if (tempElement && data.currentConditions) {
        tempElement.innerText = `${data.currentConditions.temp}Â°C`;
    }

    // Display weather condition
    if (conditionElement && data.currentConditions) {
        conditionElement.innerText = data.currentConditions.conditions;
    }

    // Display time
    if (timeElement && data.timezone) {
        timeElement.innerText = `Time: ${data.timezone.currentTime}`;
    }
}

// Function to remove a location
function removeLocation(locationId) {
    const locationElement = document.getElementById(locationId);
    if (locationElement) {
        locationElement.remove();
    }
}

// Initial cities to display
const cities = ['Valletta', 'Paris', 'Tokyo', 'London'];

cities.forEach(city => {
    fetch(`${apiEndpoint}/${city}?unitGroup=metric&key=${apiKey}&contentType=json`)
        .then(response => response.json())
        .then(data => {
            updateWeatherDetails(city, data);
        })
        .catch(error => console.error('Error fetching weather data:', error));
});

// Function to remove a location
function removeLocation(city) {
    const locationElement = document.getElementById(city.toLowerCase());
    if (locationElement) {
        locationElement.remove();
    }
}
