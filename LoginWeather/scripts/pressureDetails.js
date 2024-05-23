document.addEventListener('DOMContentLoaded', function() {
    const searchParams = new URLSearchParams(window.location.search);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (lat && lon) {
        updatePressureDetails(lat, lon);
    }
});

function updatePressureDetails(lat, lon) {
    fetchPressureData(lat, lon)
        .then(data => {
            const pressureData = data.current.surface_pressure;
            const previousPressure = pressureData - 5; // Assuming previous pressure data
            document.getElementById('pressureData').innerText = `${pressureData} hPa`;
            document.getElementById('pressureDescription').innerText = comparePressure(pressureData, previousPressure);
        })
        .catch(error => {
            console.error('Error fetching pressure details:', error);
        });
}

function comparePressure(current, previous) {
    if (current > previous) {
        return `Pressure has increased by ${current - previous} hPa compared to the last measurement.`;
    } else if (current < previous) {
        return `Pressure has decreased by ${previous - current} hPa compared to the last measurement.`;
    } else {
        return 'Pressure is stable with no changes from the last measurement.';
    }
}
