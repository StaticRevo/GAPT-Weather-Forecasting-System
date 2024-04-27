const options = {
    key: 'tIbEkiYkpvC2SyEyjtQ7nHg5dOFTvPox',
    verbose: true,
    lat: 35.8992,
    lon: 14.5141,
    zoom: 7,
};

// Initialize Windy API
windyInit(options, windyAPI => {

    const { map } = windyAPI;

});

// Update windy with coords
function updateWindy(lat, lon) {
    const options = {
        key: 'tIbEkiYkpvC2SyEyjtQ7nHg5dOFTvPox',
        verbose: true,
        lat: lat,
        lon: lon,
        zoom: 7,
    };

    // Initialize Windy API
    windyInit(options, windyAPI => {
        const { map } = windyAPI;
    });

} 

