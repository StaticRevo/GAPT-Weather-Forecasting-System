async function saveFavouriteLocation(location) {
    try {
        // Fetch coordinates using OpenCage API for the search location
        const { latitude, longitude } = await getCoordinates(location);

        // Make AJAX call to PHP script to save favorite location
        const response = await fetch('favourites.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                latitude: latitude,
                longitude: longitude,
                location: location
            })
        });

        // Parse JSON response
        const responseData = await response.json();

        // Check if request was successful
        if (response.ok) {
            if (responseData.success) {
                // Display success message
                alert(responseData.message);
            } else {
                // Display error message
                alert(responseData.message);
            }
        } else {
            throw new Error('Failed to save location to favourites');
        }

    } catch (error) {
        console.error('Error saving location to favourites:', error);
        // Display error message
        alert('Error saving location to favourites: ' + error.message);
        throw error;
    }
}

document.getElementById('addFavouriteBtn').addEventListener('click', function() {
    // Get the location from the input field
    const location = document.getElementById('searchInput').value;

    console.log('Location:', location);
    
    // Call the function to save the favorite location
    saveFavouriteLocation(location);
});
