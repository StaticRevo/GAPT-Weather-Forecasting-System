function fetchPressureData(latitude, longitude) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=surface_pressure&hourly=surface_pressure`; // Adjusted to also fetch hourly data if available

    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                console.error('Failed to fetch: ', response.statusText); // Log the error reason
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data.current || data.current.surface_pressure === undefined) {
                throw new Error('Pressure data is missing in the response');
            }
            return data;
        })
        .catch(error => {
            console.error('Failed to fetch pressure data:', error);
            throw error; // Re-throw to handle in the caller
        });
}

document.addEventListener('DOMContentLoaded', function() {
    fetchPressureData(latitude, longitude)
        .then(data => updatePressureDisplay(data))
        .catch(error => {
            const currentPressureElement = document.getElementById('current-pressure');
            if (currentPressureElement) {
                currentPressureElement.innerText = 'Error fetching pressure details: ' + error.message;
            }
        });
});
