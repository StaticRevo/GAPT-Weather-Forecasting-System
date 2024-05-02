async function getCoordinates(location) {
    const opencageApiKey = 'd22d3e2e4fe2447b831cc75d3b5a9d60';
    const nominatimBaseUrl = 'https://nominatim.openstreetmap.org/search';

    try {
        const response = await axios.get(`${nominatimBaseUrl}?q=${encodeURIComponent(location)}&format=json&addressdetails=1&limit=5`);

        if (response.data && response.data.length > 0) {
            // Extract latitude and longitude from the first result
            const { lat, lon } = response.data[0];
            return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
        } else {
            throw new Error('No matching results found');
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        window.location.href = 'http://localhost/LoginWeather/templates/genError.html';
        throw new Error('Unable to fetch coordinates for the location');
    }
}

async function handleAutosuggest() {
    const searchInput = document.getElementById('searchInput');
    const suggestionsList = document.getElementById('suggestionsList');

    const inputValue = searchInput.value.trim();

    if (inputValue.length > 2) { // At least 2 characters to trigger autosuggest
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(inputValue)}`);

            if (response.data && response.data.length > 0) {
                suggestionsList.innerHTML = '';

                // Limit suggestions to three
                const maxSuggestions = 3;
                for (let i = 0; i < Math.min(response.data.length, maxSuggestions); i++) {
                    const result = response.data[i];
                    const listItem = document.createElement('li');
                    let displayText = result.display_name;
                    // Split the display name into parts (City, country + county))
                    const parts = displayText.split(', ');
                    // If there are at least two parts, concatenate the first and last parts (city and country)
                    if (parts.length >= 2) {
                        displayText = parts[0] + ', ' + parts[parts.length - 1];
                    }
                    if (displayText.length > 35) {
                        displayText = displayText.substring(0, 33) + '...';
                    }
                    listItem.textContent = displayText;
                    listItem.addEventListener('click', () => {
                        searchInput.value = result.display_name;
                        suggestionsList.innerHTML = '';
                        searchLocation();
                    });
                    suggestionsList.appendChild(listItem);
                }
            } else {
                suggestionsList.innerHTML = '';
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            //Not going to redirect to error page, because the app shouldnt stop if something happens to autosuggest API.
        }
    } else {
        suggestionsList.innerHTML = '';
    }
}

// Event listener waits for input in search bar to trigger autosuggest
document.getElementById('searchInput').addEventListener('input', handleAutosuggest);

async function searchLocation() {
    try {
        // Get the search input value
        const searchInput = document.getElementById('searchInput').value;

        // Fetch coordinates for the search location
        const { latitude, longitude, timezone } = await getCoordinates(searchInput);
        
        // Update weather for coords
        updateWeather(latitude, longitude);

        // Update windy with coords
        updateWindy(latitude, longitude)

        // Call getWeather function with the coords and timezone
        getWeather(latitude, longitude, timezone)
            .then((data) => {
                //Update HTML elements with weather data and timezone
                updateWeatherElements(data, timezone);
                updateWeatherElements14(data, timezone);
            })
            .catch((error) => {
                console.error('Error fetching weather data:', error);
                window.location.href = 'http://localhost/LoginWeather/templates/genError.html';
            });
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        window.location.href = 'http://localhost/LoginWeather/templates/genError.html';
    }
}
