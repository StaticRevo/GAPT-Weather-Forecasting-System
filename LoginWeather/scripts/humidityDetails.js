document.addEventListener('DOMContentLoaded', function() {
    const searchParams = new URLSearchParams(window.location.search);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (lat && lon) {
        updateHumidityDetails(lat, lon);
    } else {
        document.getElementById('humidityDescription').innerText = 'Latitude and longitude are required to fetch humidity data.';
    }
});

function updateHumidityDetails(lat, lon) {
    fetchHumidityData(lat, lon)
        .then(data => {
            const humidity = data.current.relative_humidity_2m;
            document.getElementById('humidityData').innerText = `Current Humidity: ${humidity}%`;
            document.getElementById('humidityDescription').innerText = getHumidityDescription(humidity);
        })
        .catch(error => {
            console.error('Error fetching humidity details:', error);
            document.getElementById('humidityDescription').innerText = 'Failed to fetch humidity data.';
        });
}

function getHumidityDescription(humidity) {
    if (humidity < 30) {
        return 'Dry conditions, might feel a bit dry for some.';
    } else if (humidity < 50) {
        return 'Comfortably dry, ideal for most.';
    } else if (humidity < 70) {
        return 'Moderately humid, still comfortable for most.';
    } else {
        return 'High humidity, can feel sticky and uncomfortable.';
    }
}
