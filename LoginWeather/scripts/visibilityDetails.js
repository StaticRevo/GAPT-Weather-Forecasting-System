
document.addEventListener('DOMContentLoaded', function() {
    const searchParams = new URLSearchParams(window.location.search);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (lat && lon) {
        updateVisibilityDetails(lat, lon);
    } else {
        console.error('Latitude and longitude are required.');
    }
});

function updateVisibilityDetails(lat, lon) {
    fetchVisibilityData(lat, lon)
        .then(data => {
            const visibilityData = data.current.visibility;
            document.getElementById('visibilityDistance').innerText = `${visibilityData} km`;
            document.getElementById('visibilityDescription').innerText = getVisibilityDescription(visibilityData);
            document.getElementById('visibilitySummary').innerText = `Today, the visibility is ${getVisibilityDescription(visibilityData).toLowerCase()}, at ${visibilityData} km.`;
            document.getElementById('visibilityComparison').innerText = getVisibilityComparison(visibilityData);
        })
        .catch(error => {
            console.error('Error fetching visibility details:', error);
        });
}

function getVisibilityDescription(visibility) {
    if (visibility >= 10000) {
        return 'Perfectly clear';
    } else if (visibility >= 5000) {
        return 'Very clear';
    } else if (visibility >= 2000) {
        return 'Clear';
    } else if (visibility >= 1000) {
        return 'Partially cloudy';
    } else {
        return 'Foggy';
    }
}

function getVisibilityComparison(currentVisibility) {
    // This function can compare current visibility with a previous value if available
    // Placeholder implementation, replace with actual comparison logic if needed
    return `Visibility today is ${currentVisibility >= 10000 ? 'excellent' : 'not excellent'} compared to previous days.`;
}