const OPEN_CAGE_API_KEY = 'd22d3e2e4fe2447b831cc75d3b5a9d60';

function updateWeather(latitude, longitude) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,visibility&daily=sunrise,sunset,uv_index_max,precipitation_sum`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const roundedTemperature = Math.round(data.current.temperature_2m);
            const weatherCondition = getWeatherConditionTop(data.current.weather_code);
            const generalCategory = categorizeWeatherCondition(weatherCondition).toLowerCase();

            document.getElementById('city-name').innerText = document.getElementById('searchInput').value || 'Valletta';

            // Check preferences and convert temperature if necessary
            if(preferences.temperature_unit === 'fahrenheit') {
                const roundedTemperatureFahrenheit = Math.round((roundedTemperature * 9/5) + 32);
                document.getElementById('temperature').innerText = `${roundedTemperatureFahrenheit}°F`;
            } else {
                document.getElementById('temperature').innerText = `${roundedTemperature}°C`;
            }
    
            document.getElementById('condition').innerText = getWeatherConditionTop(data.current.weather_code, document.getElementById('searchInput').value || 'Valletta');
            document.getElementById('high-low').innerText = '';

            // Call all widget update methods
            updateRealFeel(data);
            updatePressure(data.current.surface_pressure);
            updateUVIndex(data.daily.uv_index_max[0], data.daily.uv_index_max[1]);
            updatePrecipitation(data.daily.precipitation_sum[0], data.daily.precipitation_sum[1]);
            updateWind(data.current.wind_speed_10m, data.current.wind_direction_10m);
            updateSunriseSunset(data.daily.sunrise[0], data.daily.sunset[0]);
            updateHumidity(data.current.relative_humidity_2m, roundedTemperature);
            updateProgress(data.daily.sunrise[0], data.daily.sunset[0]);
            updateVisibility(data.current.visibility);

            // Dynamic Background
            const videoBackground = document.getElementById('video-background');
            const videoSource = videoBackground.getAttribute(`data-${generalCategory}`);
            if (videoSource) {
                videoBackground.src = videoSource;
            }

        })
        .catch(error => {
            //Error Handling for main temperature info
            console.error('Error fetching weather data:', error);
            document.getElementById('city-name').innerText = 'City not found';
            document.getElementById('temperature').innerText = '';
            document.getElementById('condition').innerText = '';
            document.getElementById('high-low').innerText = '';
        });
}

function updateVisibility(visibility) {
    // Update visibility widgets
    const visibilityElement = document.getElementById('visibility-value');
    const visibilityText = document.getElementById('visibility-description');

    // Set Visibility comment
    if (visibility >= 10000) {
        visibilityText.innerText = 'Perfectly Clear View';
    } else if (visibility >= 5000) {
        visibilityText.innerText = 'Very Clear View';
    } else if (visibility >= 2000) {
        visibilityText.innerText = 'Clear View';
    } else if (visibility >= 1000) {
        visibilityText.innerText = 'Partially Cloudy';
    } else {
        return "Unknown"; 
        visibilityText.innerText = 'Foggy';
    }

    // Check preferences and convert if necessary
    if(preferences.distance_unit === 'miles'){
        const visibilityMiles = visibility / 1609.34;
        visibilityElement.innerText = `${visibilityMiles.toFixed(2)} miles`; 
    }
    else{
        visibilityElement.innerText = `${visibility/1000} km`;
    }
}

function updateHumidity(humidity, roundedTemperature) {
    // Update the Humidity widget
    const humidityElement = document.getElementById('humidity-value');

    // Update humidity value
    humidityElement.innerText = `${humidity}%`;

    // Calculate and update the dew point
    const dewPoint = calculateDewPoint(humidity, roundedTemperature);
    const dewPointElement = document.getElementById('dew-value');

    if (preferences.temperature_unit === 'fahrenheit') {
        const dewPointFahrenheit = Math.round((dewPoint * 9 / 5) + 32); // Convert to Fahrenheit
        dewPointElement.innerText = `The dew point is ${dewPointFahrenheit}°F`;
    } else {
        dewPointElement.innerText = `The dew point is ${dewPoint}°C`; // Default to Celsius
    }
    
    
}

function calculateDewPoint(humidity, temperature) {
    // Formula for calculating dew point
    const dewPoint = temperature - (14.55 + 0.114 * temperature) * (1 - (0.01 * humidity)) - ((2.5 + 0.007 * temperature) * (1 - (0.01 * humidity))) ** 3 - (15.9 + 0.117 * temperature) * ((1 - (0.01 * humidity)) ** 14);
    return dewPoint.toFixed(1); // Round to one decimal place
}

function updateSunriseSunset(sunrise, sunset) {
    // Update the Sunrise & Sunset widget
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
    // Updates sun path progress bar
    const now = new Date();
    let sunrise = new Date(sunriseISO);
    let sunset = new Date(sunsetISO);

    // Swap sunrise and sunset if sunrise is after sunset (currently night)
    if (sunrise > sunset) {
        const temp = sunrise;
        sunrise = sunset;
        sunset = temp;
    }

    const totalDuration = sunset - sunrise;
    let elapsedDuration;

    if (now > sunset) {
        //calculate elapsed time since sunset
        elapsedDuration = now - sunset;
    } else {
        elapsedDuration = now - sunrise;
    }

    const percentage = (elapsedDuration / totalDuration) * 100;

    const progressBar = document.getElementById('day-progress');
    const sunIcon = document.getElementById('sun-icon');

    //Set emoji for progress bar
    if (now > sunset) {
        sunIcon.innerHTML = '🌜';
    } else {
        sunIcon.innerHTML = '🌞';
    }

    //adjust bar size
    progressBar.style.width = `${percentage}%`;
    sunIcon.style.left = `calc(${percentage}% - 15px)`; // Adjust the icon position

    console.log(`Progress: ${percentage}%`);
}

function updatePrecipitation(past24hrs, expectedTomorrow) {
    // Access the preferred unit of precipitation from the prefs
    const unit = preferences.precipitation_unit;

    // Convert precipitation to the preferred unit
    let displayPast24hrs = past24hrs;
    let displayExpectedTomorrow = expectedTomorrow;
    let unitLabel = 'mm';

    // Check if the preferred unit is inches and convert
    if(unit === 'inches') {
        // Conversion: 1mm = 0.0393701 inches
        displayPast24hrs = (past24hrs * 0.0393701).toFixed(2); // Convert and keep two decimal places
        displayExpectedTomorrow = (expectedTomorrow * 0.0393701).toFixed(2); // Convert and keep two decimal places
        unitLabel = 'in';
    }

    // Update the Precipitation widget
    const precipitationAmtElement = document.getElementById('precipitation-amt');
    const precipitationTmrElement = document.getElementById('precip-tmr');

    // include the converted values and the correct unit label
    precipitationAmtElement.innerText = `${displayPast24hrs}${unitLabel} of`;
    precipitationTmrElement.innerText = `${displayExpectedTomorrow}${unitLabel} expected tomorrow`;
}


function updateWind(speed, direction) {
    // Access the preferred unit of wind speed from prefs
    const unit = preferences.wind_unit;

    let displaySpeed = speed; 
    let unitLabel = 'km/h'; // Default is km/h

    // Convert wind speed to the preferred unit if necessary
    switch (unit) {
        case 'mph':
            // Conversion: 1 km/h = 0.621371 mph
            displaySpeed = (speed * 0.621371).toFixed(1); // Convert to 1 decimal place
            unitLabel = 'mph';
            break;
        case 'knots':
            // Conversion: 1 km/h = 0.539957 knots
            displaySpeed = (speed * 0.539957).toFixed(1); // Convert to 1 decimal place
            unitLabel = 'knots';
            break;
        case 'beaufort':
            displaySpeed = kmhToBeaufort(speed); // Use Beaufort scale
            unitLabel = 'on the Beaufort scale';
            break;
        // No need for conversion if km/h is preferred or default
    }

    // Update the Wind widget
    const windSpeedElement = document.getElementById('wind-speed');
    const windDirectionElement = document.getElementById('wind-direction');

    // include the converted wind speed value and the correct unit label
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
    // Update the Pressure widget
    document.getElementById('pressure-amt')     .innerText = `${surfacePressure}hPa`;
}

function updateUVIndex(uvIndex, uvIndexTomorrow) {
    // Update the UV Index widget
    document.getElementById('uv-index').innerText = `${uvIndex} of 10`;
    
    const uvTextElement = document.getElementById('uv-text');
    let uvText = '';

    // Set UV comment text
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

    
    // Update the UV Index expectation for tomorrow
    document.getElementById('uv-tomorrow').innerText = `${uvIndexTomorrow} of 10 expected tomorrow`;
}

function updateRealFeel(data) {
    // Update real feel widget
    let roundedTemperature = Math.round(data.current.temperature_2m);
    let realFeelTemperature = Math.round(data.current.apparent_temperature);

    // Check if the temperature unit preference is Fahrenheit
    if(preferences.temperature_unit === 'fahrenheit') {
        // Convert Celsius to Fahrenheit
        roundedTemperature = Math.round(roundedTemperature * 9/5 + 32);
        realFeelTemperature = Math.round(realFeelTemperature * 9/5 + 32);
        document.getElementById('real-feel-temp').innerText = `${realFeelTemperature}°F`;
    } else {
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
    // Translate weather code to condition based on international code
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

function categorizeWeatherCondition(detailedDescription) {
    // Categorize weather code (make long codes short)
    if (["Light Drizzle", "Drizzle", "Heavy Drizzle", "Light Freezing Drizzle", "Freezing Drizzle", "Light Rain", "Rain", "Heavy Rain", "Light Freezing Rain", "Freezing Rain", "Light Showers", "Showers", "Heavy Showers", "Thunderstorm", "Light Thunderstorms With Hail", "Thunderstorm With Hail"].includes(detailedDescription)) {
        return "Rain";
    } else if (["Light Snow", "Snow", "Heavy Snow", "Snow Grains", "Light Snow Showers", "Snow Showers"].includes(detailedDescription)) {
        return "Snow";
    } else if (["Foggy", "Rime Fog"].includes(detailedDescription)) {
        return "Foggy";
    } else if (["Partly Cloudy", "Cloudy"].includes(detailedDescription)) {
        return "Cloudy";
    } else if (["Sunny", "Mainly Sunny"].includes(detailedDescription)) {
        return "Sunny";
    } else {
        return "Unknown"; 
    }
}

// Initialize with Valletta's weather
document.addEventListener('DOMContentLoaded', function () {
    updateWeather(35.8997, 14.5148); //Placeholder Location, people who log in will be greeted with Valletta weather
});
