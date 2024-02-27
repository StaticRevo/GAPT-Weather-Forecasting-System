//Initialization Options
const options = {
    key: 'tIbEkiYkpvC2SyEyjtQ7nHg5dOFTvPox', // REPLACE WITH YOUR KEY !!!
    verbose: true,
    lat: 35.8992,
    lon: 14.5141,
    zoom: 7,
};

// Initialize Windy API
windyInit(options, windyAPI => {

    const { map } = windyAPI;

});

function updateWindy(lat, lon) {
    const options = {
        key: 'tIbEkiYkpvC2SyEyjtQ7nHg5dOFTvPox', // REPLACE WITH YOUR KEY !!!
        verbose: true,
        lat: lat,
        lon: lon,
        zoom: 7,
    };

    // Initialize Windy API
    windyInit(options, windyAPI => {
        // windyAPI is ready, and contains 'map', 'store',
        // 'picker' and other useful stuff

        const { map } = windyAPI;
        // .map is an instance of the Leaflet map
    });

} 

