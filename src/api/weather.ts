import { fetchWeatherApi } from 'openmeteo';

// Async function to handle the API call and data processing
async function fetchAndProcessWeatherData() {
    const params = {
    "latitude": 52.52,
	"longitude": 13.41,
	"hourly": ["temperature_2m", "apparent_temperature", "precipitation_probability", "precipitation", "rain", "showers", "snowfall", "snow_depth", "weather_code", "is_day"],
	"temperature_unit": "fahrenheit",
    "timezone": "America/Chicago",
    "forecast_days": 1
    };
    const url = "https://api.open-meteo.com/v1/forecast";

    // Fetching weather data
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];

    // Other operations...
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const latitude = response.latitude();
    const longitude = response.longitude();
    const hourly = response.hourly()!;

    const range = (start: number, stop: number, step: number) =>
        Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    const weatherData = {
        hourly: {
            time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                (t) => new Date((t + utcOffsetSeconds) * 1000)
            ),
            temperature2m: hourly.variables(0)!.valuesArray()!,
            apparentTemperature: hourly.variables(1)!.valuesArray()!,
            precipitationProbability: hourly.variables(2)!.valuesArray()!,
            precipitation: hourly.variables(3)!.valuesArray()!,
            rain: hourly.variables(4)!.valuesArray()!,
            showers: hourly.variables(5)!.valuesArray()!,
            snowfall: hourly.variables(6)!.valuesArray()!,
            snowDepth: hourly.variables(7)!.valuesArray()!,
            weatherCode: hourly.variables(8)!.valuesArray()!,
            isDay: hourly.variables(9)!.valuesArray()!,
        },
    };

    // Logging the weather data
    for (let i = 0; i < weatherData.hourly.time.length; i++) {
        console.log(`
            date: ${weatherData.hourly.time[i].toISOString()},
            temp 2m ${weatherData.hourly.temperature2m[i]},
            apprent temp: ${weatherData.hourly.apparentTemperature[i]},
            precipitation probability: ${weatherData.hourly.precipitationProbability[i]},
            precipitation: ${weatherData.hourly.precipitation[i]},
            rain: ${weatherData.hourly.rain[i]},
            showers: ${weatherData.hourly.showers[i]},
            snowfall: ${weatherData.hourly.snowfall[i]},
            snow depth: ${weatherData.hourly.snowDepth[i]},
            weather_code: ${weatherData.hourly.weatherCode[i]},
            day or night ${weatherData.hourly.isDay[i]}
            `
        );
    }
}

// Call the async function
fetchAndProcessWeatherData();
