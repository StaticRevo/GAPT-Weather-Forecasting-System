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
            const roundedTemperature = Math.round(data.current.temperature_2m);

            document.getElementById('city-name').innerText = document.getElementById('searchInput').value || 'Valletta';

            if(preferences.temperature_unit === 'fahrenheit') {
                const roundedTemperatureFahrenheit = Math.round((roundedTemperature * 9/5) + 32);
                document.getElementById('temperature').innerText = `${roundedTemperatureFahrenheit}°F`;
            } else {
                document.getElementById('temperature').innerText = `${roundedTemperature}°C`;
            }
    
            document.getElementById('condition').innerText = getWeatherConditionTop(data.current.weather_code, document.getElementById('searchInput').value || 'Valletta');
            document.getElementById('high-low').innerText = '';

            updateRealFeel(data);
            updatePressure(data.current.surface_pressure);
            updateUVIndex(data.daily.uv_index_max[0], data.daily.uv_index_max[1]);
            updatePrecipitation(data.daily.precipitation_sum[0], data.daily.precipitation_sum[1]);
            updateWind(data.current.wind_speed_10m, data.current.wind_direction_10m);
            updateSunriseSunset(data.daily.sunrise[0], data.daily.sunset[0]);

            updateProgress(data.daily.sunrise[0], data.daily.sunset[0]);

        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('city-name').innerText = 'City not found';
            document.getElementById('temperature').innerText = '';
            document.getElementById('condition').innerText = '';
            document.getElementById('high-low').innerText = '';
        });
}

function updateSunriseSunset(sunrise, sunset) {
    // Update the Sunrise & Sunset widget using getElementById
    const sunriseTimeElement = document.getElementById('sunrise-time');
    const sunsetTimeElement = document.getElementById('sunset-time');

    // Check if sunrise and sunset data is available and valid
    if (sunrise !== undefined && sunset !== undefined) {
        const formattedSunrise = new Date(sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const formattedSunset = new Date(sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        sunriseTimeElement.innerText = `Sunrise: ${formattedSunrise}`;
        sunsetTimeElement.innerText = `Sunset: ${formattedSunset}`;
    } else {
        // Display a message if sunrise and sunset data is not available or invalid
        console.error('Sunrise or sunset data is not available or invalid.');
        sunriseTimeElement.innerText = 'Sunrise: --:--';
        sunsetTimeElement.innerText = 'Sunset: --:--';
    }
}

function updateProgress(sunriseISO, sunsetISO) {
    const now = new Date();
    let sunrise = new Date(sunriseISO);
    let sunset = new Date(sunsetISO);

    // Swap sunrise and sunset if sunrise is after sunset
    if (sunrise > sunset) {
        const temp = sunrise;
        sunrise = sunset;
        sunset = temp;
    }

    const totalDuration = sunset - sunrise;
    let elapsedDuration;

    if (now > sunset) {
        // After sunset, calculate elapsed time since sunset
        elapsedDuration = now - sunset;
    } else {
        elapsedDuration = now - sunrise;
    }

    const percentage = (elapsedDuration / totalDuration) * 100;

    const progressBar = document.getElementById('day-progress');
    const sunIcon = document.getElementById('sun-icon');

    if (now > sunset) {
        sunIcon.innerHTML = '🌜'; // Moon emoji
    } else {
        sunIcon.innerHTML = '🌞'; // Sun emoji
    }

    progressBar.style.width = `${percentage}%`;
    sunIcon.style.left = `calc(${percentage}% - 15px)`; // Adjust the icon position

    console.log(`Progress: ${percentage}%`);
}

function updatePrecipitation(past24hrs, expectedTomorrow) {
    // Access the preferred unit of precipitation from the global `preferences` object
    const unit = preferences.precipitation_unit;

    // Convert precipitation to the preferred unit if it's not in millimeters
    let displayPast24hrs = past24hrs;
    let displayExpectedTomorrow = expectedTomorrow;
    let unitLabel = 'mm';

    // Check if the preferred unit is inches, convert if necessary
    if(unit === 'inches') {
        // Conversion: 1mm = 0.0393701 inches
        displayPast24hrs = (past24hrs * 0.0393701).toFixed(2); // Convert and keep two decimal places
        displayExpectedTomorrow = (expectedTomorrow * 0.0393701).toFixed(2); // Convert and keep two decimal places
        unitLabel = 'in';
    }

    // Update the Precipitation widget using getElementById
    const precipitationAmtElement = document.getElementById('precipitation-amt');
    const precipitationTmrElement = document.getElementById('precip-tmr');

    // Update innerText to include the converted values and the correct unit label
    precipitationAmtElement.innerText = `${displayPast24hrs}${unitLabel} of`;
    precipitationTmrElement.innerText = `${displayExpectedTomorrow}${unitLabel} expected tomorrow`;
}


function updateWind(speed, direction) {
    // Access the preferred unit of wind speed from the global `preferences` object
    const unit = preferences.wind_unit;

    // Initialize variables for display
    let displaySpeed = speed; // Default is km/h
    let unitLabel = 'km/h';

    // Convert wind speed to the preferred unit if necessary
    switch (unit) {
        case 'mph':
            // Conversion: 1 km/h = 0.621371 mph
            displaySpeed = (speed * 0.621371).toFixed(1); // Convert and format to 1 decimal place
            unitLabel = 'mph';
            break;
        case 'knots':
            // Conversion: 1 km/h = 0.539957 knots
            displaySpeed = (speed * 0.539957).toFixed(1); // Convert and format to 1 decimal place
            unitLabel = 'knots';
            break;
        case 'beaufort':
            displaySpeed = kmhToBeaufort(speed); // Use Beaufort scale
            unitLabel = 'on the Beaufort scale';
            break;
        // No need for conversion if km/h is preferred or default
    }

    // Update the Wind widget using getElementById
    const windSpeedElement = document.getElementById('wind-speed');
    const windDirectionElement = document.getElementById('wind-direction');

    // Update innerText to include the converted wind speed value and the correct unit label
    windSpeedElement.innerText = `${displaySpeed} ${unitLabel}`;
    windDirectionElement.innerText = `Wind is coming from the ${getWindDirection(direction)}`;
}

// Helper function to convert km/h to Beaufort scale
function kmhToBeaufort(speed) {
    const speeds = [0, 1, 6, 12, 20, 29, 39, 50, 62, 75, 89, 103, 118];
    const index = speeds.findIndex((element) => speed < element);
    return index === -1 ? 12 : index - 1;
}


function getWindDirection(degrees) {
    // Convert degrees to cardinal direction
    const directions = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
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
    let roundedTemperature = Math.round(data.current.temperature_2m);
    let realFeelTemperature = Math.round(data.current.apparent_temperature);

    // Check if the temperature unit preference is Fahrenheit
    if(preferences.temperature_unit === 'fahrenheit') {
        // Convert Celsius to Fahrenheit
        roundedTemperature = Math.round(roundedTemperature * 9/5 + 32);
        realFeelTemperature = Math.round(realFeelTemperature * 9/5 + 32);
        document.getElementById('real-feel-temp').innerText = `${realFeelTemperature}°F`;
    } else {
        // If Celsius, use the temperature as is
        document.getElementById('real-feel-temp').innerText = `${realFeelTemperature}°C`;
    }

    // Update the text in the bottom text element based on the difference
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
