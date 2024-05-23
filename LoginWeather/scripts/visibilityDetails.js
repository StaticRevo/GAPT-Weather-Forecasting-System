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
            const visibilityKm = data.current.visibility;
            const visibilityMiles = kmToMiles(visibilityKm);
            
            document.getElementById('visibilityDistance').innerText = `${visibilityKm} km / ${visibilityMiles} miles`;
            document.getElementById('visibilityDescription').innerText = getVisibilityDescription(visibilityKm);
            document.getElementById('visibilitySummary').innerText = `Today, the visibility is ${getVisibilityDescription(visibilityKm).toLowerCase()}, at ${visibilityKm} km / ${visibilityMiles} miles.`;
            document.getElementById('visibilityComparison').innerText = getVisibilityComparison(visibilityKm);
        })
        .catch(error => {
            console.error('Error fetching visibility details:', error);
        });
}

function kmToMiles(km) {
    return (km * 0.621371).toFixed(2);  // Converts kilometers to miles and rounds to 2 decimal places
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
