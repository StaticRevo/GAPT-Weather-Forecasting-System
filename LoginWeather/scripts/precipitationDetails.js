document.addEventListener('DOMContentLoaded', function() {
    const searchParams = new URLSearchParams(window.location.search);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (lat && lon) {
        updatePrecipitationDetails(lat, lon);
    } else {
        document.getElementById('precipitationDescription').innerText = 'Latitude and longitude are required to fetch precipitation data.';
    }
});

function updatePrecipitationDetails(lat, lon) {
    fetchPrecipitationData(lat, lon)
        .then(data => {
            const precipitation = data.daily.precipitation_sum[0]; // Assuming the first entry is for the current day
            document.getElementById('precipitationData').innerText = `Current Precipitation: ${precipitation} mm`;
            document.getElementById('precipitationDescription').innerText = getPrecipitationDescription(precipitation);
        })
        .catch(error => {
            console.error('Error fetching precipitation details:', error);
            document.getElementById('precipitationDescription').innerText = 'Failed to fetch precipitation data.';
        });
}

function getPrecipitationDescription(amount) {
    if (amount === 0) {
        return 'No precipitation expected today.';
    } else if (amount < 3) {
        return 'Light rain, carry an umbrella just in case.';
    } else if (amount < 10) {
        return 'Moderate rain, advisable to have waterproof gear.';
    } else {
        return 'Heavy rainfall expected, avoid outdoor activities.';
    }
}
