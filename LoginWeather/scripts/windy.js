var api_key = 'd22d3e2e4fe2447b831cc75d3b5a9d60';
var query = 'Valletta';  // Replace with your desired address

// OpenCage Geocoding API request
var api_url = 'https://api.opencagedata.com/geocode/v1/json'
var request_url = api_url
    + '?'
    + 'key=' + api_key
    + '&q=' + encodeURIComponent(query)
    + '&pretty=1'
    + '&no_annotations=1';

var openCageRequest = new XMLHttpRequest();
openCageRequest.open('GET', request_url, true);

openCageRequest.onload = function() {
    if (openCageRequest.status === 200) {
        var data = JSON.parse(openCageRequest.responseText);
        // Extract latitude and longitude from the OpenCage response
        var lat = data.results[0].geometry.lat;
        var lon = data.results[0].geometry.lng;

        // Windy API options with the obtained lat and lon
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

    } else if (openCageRequest.status <= 500) {
        console.log("Unable to geocode! Response code: " + openCageRequest.status);
        var data = JSON.parse(openCageRequest.responseText);
        console.log('Error msg: ' + data.status.message);
    } else {
        console.log("Server error");
    }
};

openCageRequest.send();

// main.js

function searchLocationWindy() {
    var api_key = 'd22d3e2e4fe2447b831cc75d3b5a9d60';
    var query = document.getElementById('searchInput').value;

    // Rest of your existing code remains unchanged

    // OpenCage Geocoding API request
    var api_url = 'https://api.opencagedata.com/geocode/v1/json'
    var request_url = api_url
        + '?'
        + 'key=' + api_key
        + '&q=' + encodeURIComponent(query)
        + '&pretty=1'
        + '&no_annotations=1';

    var openCageRequest = new XMLHttpRequest();
    openCageRequest.open('GET', request_url, true);

    openCageRequest.onload = function() {
        if (openCageRequest.status === 200) {
            var data = JSON.parse(openCageRequest.responseText);
            // Extract latitude and longitude from the OpenCage response
            var lat = data.results[0].geometry.lat;
            var lon = data.results[0].geometry.lng;

            // Windy API options with the obtained lat and lon
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

        } else if (openCageRequest.status <= 500) {
            console.log("Unable to geocode! Response code: " + openCageRequest.status);
            var data = JSON.parse(openCageRequest.responseText);
            console.log('Error msg: ' + data.status.message);
        } else {
            console.log("Server error");
        }
    };

    openCageRequest.send();
}
