document.addEventListener('DOMContentLoaded', function() {
    const searchParams = new URLSearchParams(window.location.search);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (lat && lon) {
        updateUVDetails(lat, lon);
    } else {
        document.getElementById('uvSummary').innerText = 'Latitude and longitude are required to fetch UV index data.';
    }
});

function updateUVDetails(lat, lon) {
    fetchUVData(lat, lon)
        .then(data => {
            const uvIndex = data.daily.uv_index_max[0]; // Assuming the first entry is for the current day
            const uvDescription = getUVDescription(uvIndex);

            document.getElementById('uvData').innerText = `Current UV Index: ${uvIndex}`;
            document.getElementById('uvDescription').innerText = uvDescription;
        })
        .catch(error => {
            console.error('Error fetching UV index details:', error);
            document.getElementById('uvSummary').innerText = 'Failed to fetch UV data.';
        });
}

function getUVDescription(uvIndex) {
    if (uvIndex < 3) {
        return 'Low';
    } else if (uvIndex < 6) {
        return 'Moderate';
    } else if (uvIndex < 8) {
        return 'High';
    } else if (uvIndex < 11) {
        return 'Very High';
    } else {
        return 'Extreme';
    }
}
