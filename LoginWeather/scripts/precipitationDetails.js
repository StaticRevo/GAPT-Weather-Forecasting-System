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
            const precipitationMM = data.daily.precipitation_sum[0]; // Assuming the first entry is for the current day
            const precipitationInches = mmToInches(precipitationMM);
            document.getElementById('precipitationData').innerText = `Current Precipitation: \n${precipitationMM} mm / (${precipitationInches} inches)`;
            document.getElementById('precipitationDescription').innerText = getPrecipitationDescription(precipitationMM);
        })
        .catch(error => {
            console.error('Error fetching precipitation details:', error);
            document.getElementById('precipitationDescription').innerText = 'Failed to fetch precipitation data.';
        });
}

function mmToInches(mm) {
    // 1 millimeter = 0.0393701 inches
    return (mm * 0.0393701).toFixed(2);
}


function getPrecipitationDescription(amount) {
    if (amount === 0) {
        return '\nNo precipitation expected today.';
    } else if (amount < 3) {
        return '\nLight rain, carry an umbrella just in case.';
    } else if (amount < 10) {
        return '\nModerate rain, advisable to have waterproof gear.';
    } else {
        return '\nHeavy rainfall expected, avoid outdoor activities.';
    }
}
