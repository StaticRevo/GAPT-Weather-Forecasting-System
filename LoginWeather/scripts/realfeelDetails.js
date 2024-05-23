document.addEventListener('DOMContentLoaded', function() {
    const searchParams = new URLSearchParams(window.location.search);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (lat && lon) {
        updateRealFeelDetails(lat, lon);
    } else {
        document.getElementById('realFeelDescription').innerText = 'Latitude and longitude are required to fetch RealFeel data.';
    }
});

function updateRealFeelDetails(lat, lon) {
    fetchRealFeelData(lat, lon)
        .then(data => {
            const realFeel = data.current.apparent_temperature;
            document.getElementById('realFeelData').innerText = `Current RealFeel: ${realFeel}°C`;
            document.getElementById('realFeelDescription').innerText = getRealFeelDescription(realFeel);
        })
        .catch(error => {
            console.error('Error fetching RealFeel details:', error);
            document.getElementById('realFeelDescription').innerText = 'Failed to fetch RealFeel data.';
        });
}

function getRealFeelDescription(temperature) {
    if (temperature < 0) {
        return 'Extremely cold, risk of frostbite';
    } else if (temperature < 10) {
        return 'Very cold, dress warmly';
    } else if (temperature < 20) {
        return 'Mild, pleasant with a light jacket';
    } else if (temperature < 30) {
        return 'Warm, perfect for outdoor activities';
    } else {
        return 'Very hot, risk of heat exhaustion';
    }
}
