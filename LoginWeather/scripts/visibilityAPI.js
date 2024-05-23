async function fetchVisibilityData(latitude, longitude) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=visibility&hourly=visibility`;
    
    const response = await fetch(apiUrl) // Return the fetch promise
        ;
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
}


function updateVisibilityDisplay(data) {
    const currentVisibility = data.current.visibility;
    const futureVisibility = data.hourly.visibility.map(hour => `${new Date(hour.time).toLocaleTimeString()}: ${hour.value} km`);

    // Update current visibility on the webpage
    const currentVisibilityElement = document.getElementById('current-visibility');
    if (currentVisibilityElement) {
        currentVisibilityElement.innerText = `Current visibility: ${currentVisibility} km`;
    }

    // Update future visibility forecast on the webpage
    const futureVisibilityElement = document.getElementById('future-visibility');
    if (futureVisibilityElement) {
        futureVisibilityElement.innerHTML = futureVisibility.join('<br/>');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const searchParams = new URLSearchParams(window.location.search);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    fetchVisibilityData(lat, lon)
        .then(data => updateVisibilityDisplay(data))
        .catch(error => console.error('Error fetching visibility data:', error));
});
