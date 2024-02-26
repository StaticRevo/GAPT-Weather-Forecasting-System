// Function to get weather data

async function getCoordinates(location) {
    const opencageApiKey = 'd22d3e2e4fe2447b831cc75d3b5a9d60'; // Replace with your OpenCage API key
    const timezoneDbApiKey = 'A37RMT7ZS3PE'; // Replace with your TimezoneDB API key

    const opencageResponse = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${opencageApiKey}`);
    
    const { results } = opencageResponse.data;
    if (results && results.length > 0) {
        const { lat, lng } = results[0].geometry;

        // Use TimezoneDB API to get timezone information
        const timezoneResponse = await axios.get(`http://api.timezonedb.com/v2.1/get-time-zone?key=${timezoneDbApiKey}&format=json&by=position&lat=${lat}&lng=${lng}`);

        const { status, message, zoneName } = timezoneResponse.data;
        if (status === 'OK') {
            return { latitude: lat, longitude: lng, timezone: zoneName };
        } else {
            throw new Error(`TimezoneDB error: ${message}`);
        }
    } else {
        throw new Error('Unable to fetch coordinates for the location');
    }
}


async function searchLocationHourly() {
    try {
        // Get the search input value
        const searchInput = document.getElementById('searchInput').value;

        // Fetch coordinates using OpenCage API for the search location
        const { latitude, longitude, timezone } = await getCoordinates(searchInput);
        
        // Call the getWeather function with the obtained coordinates and timezone
        getWeather(latitude, longitude, timezone)
            .then((data) => {
                // Update HTML elements with weather data and timezone
                updateWeatherElements(data, timezone);
            })
            .catch((error) => {
                console.error('Error fetching weather data:', error);
            });
    } catch (error) {
        console.error('Error fetching coordinates:', error);
    }
}

function getWeather(lat, lon, timezone) {
    return axios
    .get(
        "https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&temperature_unit=celsius&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime",
        {
        params: {
            latitude: lat,
            longitude: lon,
            timezone,
        },
        }
    )
    .then(({ data }) => {
        return {
        current: parseCurrentWeather(data),
        daily: parseDailyWeather(data),
        hourly: parseHourlyWeather(data),
        };
    });
}

function parseCurrentWeather({ current_weather, daily }) {
    const {
    temperature: currentTemp,
    windspeed: windSpeed,
    weathercode: iconCode,
    } = current_weather;
    const {
    temperature_2m_max: [maxTemp],
    temperature_2m_min: [minTemp],
    apparent_temperature_max: [maxFeelsLike],
    apparent_temperature_min: [minFeelsLike],
    precipitation_sum: [precip],
    } = daily;

    return {
    currentTemp: Math.round(currentTemp),
    highTemp: Math.round(maxTemp),
    lowTemp: Math.round(minTemp),
    highFeelsLike: Math.round(maxFeelsLike),
    lowFeelsLike: Math.round(minFeelsLike),
    windSpeed: Math.round(windSpeed),
    precip: Math.round(precip * 100) / 100,
    iconCode,
    };
}

function parseDailyWeather({ daily }) {
    return daily.time.map((time, index) => {
    return {
        timestamp: time * 1000,
        iconCode: daily.weathercode[index],
        maxTemp: Math.round(daily.temperature_2m_max[index]),
    };
    });
}

function parseHourlyWeather({ hourly, current_weather }) {
    return hourly.time
    .map((time, index) => {
        return {
        timestamp: time * 1000,
        iconCode: hourly.weathercode[index],
        temp: Math.round(hourly.temperature_2m[index]),
        feelsLike: Math.round(hourly.apparent_temperature[index]),
        windSpeed: Math.round(hourly.windspeed_10m[index]),
        precip: Math.round(hourly.precipitation[index] * 100) / 100,
        };
    })
    .filter(({ timestamp }) => timestamp >= current_weather.time * 1000);
}

// Function to update the HTML elements with weather data
function updateWeatherElements(data, timezone) {
    for (let hour = 1; hour <= 6; hour++) {
        const tempElement = document.getElementById(`temp${hour}`);
        const iconElement = document.getElementById(`weather-icon${hour}`);
        const timeElement = document.getElementById(`time${hour}`);

        // Update temperature to Celsius
        tempElement.textContent = `${data.hourly[hour - 1].temp}°C`;

        // Update weather icon
        iconElement.textContent = `${getWeatherCondition(data.hourly[hour - 1].iconCode)}`;

        // Update time with timezone conversion
        const timestamp = new Date(data.hourly[hour - 1].timestamp);
        const localTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: timezone });
        timeElement.textContent = localTime;
    }
}
function getWeatherCondition(weatherCode) {
switch (weatherCode) {
case 0:
return "☀️";
case 1:
return "☀️";
case 2:
return "⛅";
case 3:
return "☁️";
case 45:
return "☁️";
case 48:
return "☁️";
case 51:
return "🌧️";
case 53:
return "🌧️";
case 55:
return "🌧️";
case 56:
return "🌧️";
case 57:
return "🌧️";
case 61:
return "🌧️";
case 63:
return "🌧️";
case 65:
return "🌧️";
case 66:
return "🌧️";
case 67:
return "🌧️";
case 71:
return "🌨️";
case 73:
return "🌨️";
case 75:
return "🌨️";
case 77:
return "🌨️";
case 80:
return "🌧️";
case 81:
return "🌧️";
case 82:
return "🌧️";
case 85:
return "🌨️";
case 86:
return "🌨️";
case 95:
return "🌩️";
case 96:
return "⛈️";
case 99:
return "⛈️";
default:
return "❓";
}
}

async function fetchWeatherAndPopulate() {
    const location = 'Valletta'; // Your desired location
    try {
        // Fetch coordinates using OpenCage API
        const { latitude, longitude, timezone } = await getCoordinates(location);
        
        // Call the getWeather function with the obtained coordinates and timezone
        getWeather(latitude, longitude, timezone)
            .then((data) => {
                // Update HTML elements with weather data and timezone
                updateWeatherElements(data, timezone);
            })
            .catch((error) => {
                console.error('Error fetching weather data:', error);
            });
    } catch (error) {
        console.error('Error fetching coordinates:', error);
    }
}

// Fetch weather data when the page loads
document.addEventListener('DOMContentLoaded', fetchWeatherAndPopulate);