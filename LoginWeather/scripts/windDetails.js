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
            const windSpeedKmph = data.current.wind_speed_10m; // Assuming the first entry is for the current wind speed
            const windSpeedBeaufort = kmphToBeaufort(windSpeedKmph);
            console.error(windSpeedBeaufort);
            document.getElementById('windSpeedData').innerText = `Current Wind Speed:\n ${windSpeedKmph} km/h / (${windSpeedBeaufort} Beaufort)`;
            document.getElementById('windSpeedDescription').innerText = getWindSpeedDescription(windSpeedKmph);
        })
        .catch(error => {
            console.error('Error fetching wind speed details:', error);
            document.getElementById('windSpeedDescription').innerText = 'Failed to fetch wind speed data.';
        });
}

function kmphToBeaufort(speed) {
    if (speed < 1) {
        return 0;
    } else if (speed <= 5) {
        return 1;
    } else if (speed <= 11) {
        return 2;
    } else if (speed <= 19) {
        return 3;
    } else if (speed <= 28) {
        return 4;
    } else if (speed <= 38) {
        return 5;
    } else if (speed <= 49) {
        return 6;
    } else if (speed <= 61) {
        return 7;
    } else if (speed <= 74) {
        return 8;
    } else if (speed <= 88) {
        return 9;
    } else if (speed <= 102) {
        return 10;
    } else if (speed <= 117) {
        return 11;
    } else {
        return 12;
    }
}

function getWindSpeedDescription(speed) {
    if (speed < 5) {
        return '\nCalm, barely noticeable winds.';
    } else if (speed < 20) {
        return '\nLight breeze, pleasant for outdoor activities.';
    } else if (speed < 40) {
        return '\nModerate wind, noticeable and might affect certain activities.';
    } else {
        return '\nStrong wind, potential for disruption and hazardous conditions.';
    }
}
