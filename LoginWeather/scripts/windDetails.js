document.addEventListener('DOMContentLoaded', function() {
    const searchParams = new URLSearchParams(window.location.search);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (lat && lon) {
        updateWindSpeedDetails(lat, lon);
    } else {
        document.getElementById('windSpeedDescription').innerText = 'Latitude and longitude are required to fetch wind speed data.';
    }
});

function updateWindSpeedDetails(lat, lon) {
    fetchWindSpeedData(lat, lon)
        .then(data => {
            const windSpeed = data.current.wind_speed_10m; // Assuming the first entry is for the current wind speed
            document.getElementById('windSpeedData').innerText = `Current Wind Speed: ${windSpeed} km/h`;
            document.getElementById('windSpeedDescription').innerText = getWindSpeedDescription(windSpeed);
        })
        .catch(error => {
            console.error('Error fetching wind speed details:', error);
            document.getElementById('windSpeedDescription').innerText = 'Failed to fetch wind speed data.';
        });
}

function getWindSpeedDescription(speed) {
    if (speed < 5) {
        return 'Calm, barely noticeable winds.';
    } else if (speed < 20) {
        return 'Light breeze, pleasant for outdoor activities.';
    } else if (speed < 40) {
        return 'Moderate wind, noticeable and might affect certain activities.';
    } else {
        return 'Strong wind, potential for disruption and hazardous conditions.';
    }
}
