import { error } from 'console';
import { fetchWeatherApi } from 'openmeteo';
	
async function getDailyWeather() {

const params = {
	"latitude": 52.52,
	"longitude": 13.41,
	"current": ["temperature_2m", "apparent_temperature", "is_day", "precipitation", "rain", "showers", "snowfall", "wind_speed_10m"],
	"hourly": ["temperature_2m", "apparent_temperature", "precipitation_probability", "precipitation", "rain", "showers", "snowfall", "wind_speed_10m"],
	"daily": ["sunrise", "sunset"],
	"temperature_unit": "fahrenheit",
	"wind_speed_unit": "mph",
	"precipitation_unit": "inch",
	"timezone": "America/Chicago",
	"forecast_days": 1,
	"forecast_hours": 24
};
const url = "https://api.open-meteo.com/v1/forecast";

try {
    const responses = await fetchWeatherApi(url, params);
// Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];
// Helper function to form time ranges
const range = (start: number, stop: number, step: number) =>
	Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);



// Attributes for timezone and location
const utcOffsetSeconds = response.utcOffsetSeconds();
const timezone = response.timezone();
const timezoneAbbreviation = response.timezoneAbbreviation();
const latitude = response.latitude();
const longitude = response.longitude();

const current = response.current()!;
const hourly = response.hourly()!;
const daily = response.daily()!;

// Note: The order of weather variables in the URL query and the indices below need to match!
const weatherData = {
	current: {
		time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
		temperature2m: current.variables(0)!.value(),
		apparentTemperature: current.variables(1)!.value(),
		isDay: current.variables(2)!.value(),
		precipitation: current.variables(3)!.value(),
		rain: current.variables(4)!.value(),
		showers: current.variables(5)!.value(),
		snowfall: current.variables(6)!.value(),
		windSpeed10m: current.variables(7)!.value(),
	},
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
		windSpeed10m: hourly.variables(7)!.valuesArray()!,
	},
	daily: {
		time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
			(t) => new Date((t + utcOffsetSeconds) * 1000)
		),
		sunrise: daily.variables(0)!.valuesArray()!,
		sunset: daily.variables(1)!.valuesArray()!,
	},

};


// Function to format date to MM-DD-YYYY
function formatDate(date: any) {
    return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
}

// Function to format the hour in 12-hour format with AM/PM
function formatHour(hour: number): string {
    const hourFormatted = hour % 12 || 12; // Convert 0 to 12 for 12 AM
    const amPm = hour < 12 ? 'am' : 'pm';
    return `${hourFormatted}${amPm}`;
}

// `weatherData` now contains a simple structure with arrays for datetime and weather data
for (let i = 0; i < weatherData.hourly.time.length; i++) {
    const date = weatherData.hourly.time[i];
    const formattedDate = formatDate(date);
    const formattedHour = formatHour(date.getHours());
    console.log(`Date: ${formattedDate}, Time: ${formattedHour}`);
    console.log(`  Current Temp: ${weatherData.hourly.temperature2m[i].toFixed(0)}°F`);
    console.log(`  Apparent Temp: ${weatherData.hourly.apparentTemperature[i].toFixed(0)}°F`);
    console.log(`  Precipitation Probability: ${weatherData.hourly.precipitationProbability[i]}%`);
    console.log(`  Precipitation: ${weatherData.hourly.precipitation[i]} inches`);
    console.log(`  Rain: ${weatherData.hourly.rain[i]} inches`);
    console.log(`  Showers: ${weatherData.hourly.showers[i]}`);
    console.log(`  Snowfall: ${weatherData.hourly.snowfall[i]} inches`);
    console.log(`  Wind Speed: ${weatherData.hourly.windSpeed10m[i]} mph`);
    console.log(`  Sunrise: ${weatherData.daily.sunrise} sunset: ${weatherData.daily.sunset}`)
	console.log('-----------------------------------');
}
// Logging the daily weather data
for (let i = 0; i < weatherData.daily.time.length; i++) {
    const date = weatherData.daily.time[i];
    const formattedDate = formatDate(date);

    // Assuming sunrise and sunset are Unix timestamps
    const sunriseDate = new Date(weatherData.daily.sunrise[i] * 1000);
    const sunsetDate = new Date(weatherData.daily.sunset[i] * 1000);

    console.log(`Date: ${formattedDate}`);
    console.log(`  Sunrise: ${sunriseDate.toISOString()}`);
    console.log(`  Sunset: ${sunsetDate.toISOString()}`);
    console.log(
		weatherData.daily.time[i].toISOString(),
		weatherData.daily.sunrise[i],
		weatherData.daily.sunset[i]
	);
	console.log('-----------------------------------');
    }
} catch (err) {
    console.error('fetching data or processing error:', error)
    }
}

getDailyWeather();