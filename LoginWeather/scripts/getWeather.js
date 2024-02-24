// Replace 'YOUR_API_KEY' with your actual API key
const apiKey = 'K7AN4VPX6ZTLUL4ET72UFN5DB';

// Function to fetch and update weather data
function updateWeather(city) {
    const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Update HTML content with fetched data
            document.getElementById('city-name').innerText = city;
            document.getElementById('temperature').innerText = `${data.currentConditions.temp}°C`;
            document.getElementById('condition').innerText = data.currentConditions.conditions;
            document.getElementById('high-low').innerText = `High: ${data.days[0].tempmax}°C, Low: ${data.days[0].tempmin}°C`;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('city-name').innerText = 'City not found';
            document.getElementById('temperature').innerText = '';
            document.getElementById('condition').innerText = '';
            document.getElementById('high-low').innerText = '';
        });
}

// Initial load with Valletta's weather
document.addEventListener('DOMContentLoaded', function () {
    updateWeather('Valletta');
});

// Function to handle search
function searchLocation() {
    // Get the user's search query
    const searchQuery = document.getElementById('searchInput').value;

    // Update with Valletta's weather if the search query is empty
    if (searchQuery.trim() === '') {
        updateWeather('Valletta');
    } else {
        // Otherwise, update with the user's search query
        updateWeather(searchQuery);
    }
}

