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
            const realFeelCelsius = data.current.apparent_temperature;
            const realFeelFahrenheit = convertCelsiusToFahrenheit(realFeelCelsius);
            document.getElementById('realFeelData').innerText = `Current Real Feel:\n ${realFeelCelsius}°C / ${realFeelFahrenheit}°F\n`;
            document.getElementById('realFeelDescription').innerText = getRealFeelDescription(realFeelCelsius);
        })
        .catch(error => {
            console.error('Error fetching RealFeel details:', error);
            document.getElementById('realFeelDescription').innerText = 'Failed to fetch RealFeel data.';
        });
}

function convertCelsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

function getRealFeelDescription(temperature) {
    if (temperature < 0) {
        return '\nExtremely cold, risk of frostbite';
    } else if (temperature < 10) {
        return '\nVery cold, dress warmly';
    } else if (temperature < 20) {
        return '\nMild, pleasant with a light jacket';
    } else if (temperature < 30) {
        return '\nWarm, perfect for outdoor activities';
    } else {
        return '\nVery hot, risk of heat exhaustion';
    }
}
