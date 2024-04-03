// Function to get weather data

function getWeather(lat, lon, timezone) {
    const temperatureUnit = preferences.temperature_unit === 'F' ? 'fahrenheit' : 'celsius';
    return axios.get(
        `https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&temperature_unit=${temperatureUnit}&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime&forecast_days=14`,
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

function updateWeatherElements(data, timezone) {
    // Loop through each hour up to 6 hours
    for (let hour = 1; hour <= 6; hour++) {
        const tempElement = document.getElementById(`temp${hour}`);
        const iconElement = document.getElementById(`weather-icon${hour}`);
        const timeElement = document.getElementById(`time${hour}`);
        
        // Extract the temperature for the current hour
        const temperature = data.hourly[hour - 1].temp;

        // Check if the user's preference is for Fahrenheit
        if (preferences.temperature_unit === 'fahrenheit') {
            // Convert temperature to Fahrenheit and update the text with °F
            const roundedTemperatureFahrenheit = Math.round((temperature * 9/5) + 32);
            tempElement.innerText = `${roundedTemperatureFahrenheit}°F`;
        } else {
            // If not, display in Celsius as default
            tempElement.innerText = `${temperature}°C`;
        }

        // Update weather icon based on the weather code
        iconElement.textContent = getWeatherCondition(data.hourly[hour - 1].iconCode);

        // Update time with timezone conversion
        const timestamp = new Date(data.hourly[hour - 1].timestamp);
        const localTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: timezone });
        timeElement.textContent = localTime;
    }
}


function updateWeatherElements14(data, timezone) {
    for (let day = 0; day < 14; day++) {
        const dayNameElement = document.getElementById(`day-name${day + 1}`);
        const dateElement = document.getElementById(`date${day + 1}`);
        const conditionsElement = document.getElementById(`conditions${day + 1}`);
        const highTempElement = document.getElementById(`high-temp${day + 1}`);
        const lowTempElement = document.getElementById(`low-temp${day + 1}`);

        // Update day name and date
        const timestamp = new Date(data.daily[day].timestamp);
        const localDay = timestamp.toLocaleDateString('en-US', { weekday: 'long', timeZone: timezone });
        const localDate = timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: timezone });
        dayNameElement.textContent = localDay;
        dateElement.textContent = localDate;

        // Update conditions
        conditionsElement.textContent = getWeatherCondition(data.daily[day].iconCode);

        // Determine the unit label and possibly convert temperatures
        const unitLabel = preferences.temperature_unit === 'fahrenheit' ? '°F' : '°C';
        const highTemp = preferences.temperature_unit === 'fahrenheit' ? Math.round((data.daily[day].maxTemp * 9/5) + 32) : Math.round(data.daily[day].maxTemp);
        const lowTemp = preferences.temperature_unit === 'fahrenheit' ? Math.round((data.current.lowTemp * 9/5) + 32) : Math.round(data.current.lowTemp);

        // Update high and low temperatures with the correct unit
        highTempElement.textContent = `High: ${highTemp}${unitLabel}`;
        lowTempElement.textContent = `Low: ${lowTemp !== undefined ? lowTemp : 'N/A'}${unitLabel}`;
    }
}


function getWeatherCondition(weatherCode) {
    const weatherMap = {
      "0,1": "☀️",
      "2,3,45,48": "☁️",
      "51,53,55,56,57,61,63,65,66,67,80,81,82": "🌧️",
      "71,73,75,77,85,86": "🌨️",
      "95,96,99": "⛈️",
    };
  
    for (const key in weatherMap) {
      const codes = key.split(",").map(Number);
      if (codes.includes(weatherCode)) {
        return weatherMap[key];
      }
    }
  
    return "❓";
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
                updateWeatherElements14(data, timezone);
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
