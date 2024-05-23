function fetchUVData(latitude, longitude) {
    // Ensure the dates are calculated right before the API call
    const today = new Date();
    const tenDaysAgo = new Date(today.setDate(today.getDate() - 10)).toISOString().split('T')[0];
    const todayFormatted = new Date().toISOString().split('T')[0]; // Reset to today's date after modifying

    // Construct the API URL with dynamic latitude and longitude and parameters for UV index forecast
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,visibility&daily=sunrise,sunset,uv_index_max,precipitation_sum`;

    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch UV data');
            }
            return response.json();
        });
}
