async function getCoordinates(location) {
    const opencageApiKey = 'd22d3e2e4fe2447b831cc75d3b5a9d60'; // Replace with your OpenCage API key
    const timezoneDbApiKey = 'A37RMT7ZS3PE'; // Replace with your TimezoneDB API key

    const opencageResponse = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${opencageApiKey}`);
    
    const { results } = opencageResponse.data;
    if (results && results.length > 0) {
        const { lat, lng } = results[0].geometry;

        // Use TimezoneDB API to get timezone information
        const timezoneResponse = await axios.get(`http://api.timezonedb.com/v2.1/get-time-zone?key=${timezoneDbApiKey}&format=json&by=position&lat=${lat}&lng=${lng}`);

        const { status, message, zoneName } = timezoneResponse.data;
        if (status === 'OK') {
            return { latitude: lat, longitude: lng, timezone: zoneName };
        } else {
            throw new Error(`TimezoneDB error: ${message}`);
        }
    } else {
        throw new Error('Unable to fetch coordinates for the location');
    }
}


async function searchLocation() {
    try {
        // Get the search input value
        const searchInput = document.getElementById('searchInput').value;

        // Fetch coordinates using OpenCage API for the search location
        const { latitude, longitude, timezone } = await getCoordinates(searchInput);
        
        updateWeather(latitude, longitude);

        updateWindy(latitude, longitude)

        // Call the getWeather function with the obtained coordinates and timezone
        getWeather(latitude, longitude, timezone)
            .then((data) => {
                // Update HTML elements with weather data and timezone
                updateWeatherElements(data, timezone);
                updateWeatherElements14(data, timezone);
            })
            .catch((error) => {
                console.error('Error fetching weather data:', error);
            });
    } catch (error) {
        console.error('Error fetching coordinates:', error);
    }
}
