const OPEN_CAGE_API_KEY = 'd22d3e2e4fe2447b831cc75d3b5a9d60';

function getWeatherCondition(weatherCode, cityName = "") {
    // Weather condition mapping remains the same as before
    // You can customize this function further if needed
}

function updateWeather(latitude, longitude) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&daily=sunrise,sunset,uv_index_max,precipitation_sum`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const roundedTemperature = Math.round(data.current.temperature_2m); //Rounds the temperature to the nearest int
            
            document.getElementById('city-name').innerText = document.getElementById('searchInput').value || 'Valletta';
            document.getElementById('temperature').innerText = `${roundedTemperature}°C`;
            document.getElementById('condition').innerText = getWeatherConditionTop(data.current.weather_code, document.getElementById('searchInput').value || 'Valletta');
            document.getElementById('high-low').innerText = ''; // Adjust based on the API response
            
            updateRealFeel(data);
            updatePressure(data.current.surface_pressure);
            updateUVIndex(data.daily.uv_index_max[0], data.daily.uv_index_max[1]);
            updatePrecipitation(data.daily.precipitation_sum[0], data.daily.precipitation_sum[1]);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('city-name').innerText = 'City not found';
            document.getElementById('temperature').innerText = '';
            document.getElementById('condition').innerText = '';
            document.getElementById('high-low').innerText = '';
        });
}

function updatePrecipitation(past24hrs, expectedTomorrow) {
    // Update the Precipitation widget using getElementById
    const precipitationAmtElement = document.getElementById('precipitation-amt');
    const precipitationTmrElement = document.getElementById('precip-tmr');

    precipitationAmtElement.innerText = `${past24hrs}mm of`;
    precipitationTmrElement.innerText = `${expectedTomorrow}mm expected tomorrow`;
}


function updatePressure(surfacePressure) {
    // Update the Pressure widget using getElementById
    document.getElementById('pressure-amt').innerText = `${surfacePressure}hPa`;
}

function updateUVIndex(uvIndex, uvIndexTomorrow) {
    // Update the UV Index widget using getElementById
    document.getElementById('uv-index').innerText = `${uvIndex} of 10`;
    
    const uvTextElement = document.getElementById('uv-text');
    let uvText = '';

    if (uvIndex >= 0 && uvIndex < 3) {
        uvText = 'Low';
    } else if (uvIndex >= 3 && uvIndex < 6) {
        uvText = 'Medium';
    } else if (uvIndex >= 6 && uvIndex < 8) {
        uvText = 'High';
    } else if (uvIndex >= 8 && uvIndex <= 10) {
        uvText = 'Very High';
    } else {
        uvText = 'Extreme';
    }

    uvTextElement.innerText = uvText;

    
    // Update the UV Index expectation for tomorrow using getElementById
    document.getElementById('uv-tomorrow').innerText = `${uvIndexTomorrow} of 10 expected tomorrow`;
}

function updateRealFeel(data) {
    const roundedTemperature = Math.round(data.current.temperature_2m);
    const realFeelTemperature = Math.round(data.current.apparent_temperature);

    // Update the Real Feel widget using getElementById
    document.getElementById('real-feel-temp').innerText = `${realFeelTemperature}°C`;

    // Update the text in the bottom text element
    const temperatureDifference = realFeelTemperature - roundedTemperature;
    const realFeelTextElement = document.getElementById('real-feel-text');

    if (temperatureDifference > 0) {
        realFeelTextElement.innerText = `Feels warmer than actual temperature`;
    } else if (temperatureDifference < 0) {
        realFeelTextElement.innerText = `Feels colder than actual temperature`;
    } else {
        realFeelTextElement.innerText = `Feels same as actual temperature`;
    }
}

function getWeatherConditionTop(weatherCode, cityName = "") {
    // You can customize this function further based on your needs
    switch (weatherCode) {
        case 0:
            return "Sunny";
        case 1:
            return "Mainly Sunny";
        case 2:
            return "Partly Cloudy";
        case 3:
            return "Cloudy";
        case 45:
            return "Foggy";
        case 48:
            return "Rime Fog";
        case 51:
            return "Light Drizzle";
        case 53:
            return "Drizzle";
        case 55:
            return "Heavy Drizzle";
        case 56:
            return "Light Freezing Drizzle";
        case 57:
            return "Freezing Drizzle";
        case 61:
            return "Light Rain";
        case 63:
            return "Rain";
        case 65:
            return "Heavy Rain";
        case 66:
            return "Light Freezing Rain";
        case 67:
            return "Freezing Rain";
        case 71:
            return "Light Snow";
        case 73:
            return "Snow";
        case 75:
            return "Heavy Snow";
        case 77:
            return "Snow Grains";
        case 80:
            return "Light Showers";
        case 81:
            return "Showers";
        case 82:
            return "Heavy Showers";
        case 85:
            return "Light Snow Showers";
        case 86:
            return "Snow Showers";
        case 95:
            return "Thunderstorm";
        case 96:
            return "Light Thunderstorms With Hail";
        case 99:
            return "Thunderstorm With Hail";
        default:
            return "Unknown Weather";
    }
}

// Initialize with Valletta's weather
document.addEventListener('DOMContentLoaded', function () {
    updateWeather(35.8997, 14.5148); // Default to Valletta's coordinates
});
