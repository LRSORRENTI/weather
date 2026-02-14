import { error } from 'console';
import { fetchWeatherApi } from 'openmeteo';

async function getDailyWeather() {
	const params = {
		latitude: 52.52,
		longitude: 13.41,
		current: ["temperature_2m", "apparent_temperature", "is_day", "precipitation", "rain", "showers", "snowfall", "wind_speed_10m", "cloud_cover"],
		hourly: ["temperature_2m", "apparent_temperature", "precipitation_probability", "precipitation", "rain", "showers", "snowfall", "wind_speed_10m", "cloud_cover"],
		daily: ["sunrise", "sunset"],
		temperature_unit: "fahrenheit",
		wind_speed_unit: "mph",
		precipitation_unit: "inch",
		timezone: "America/Chicago",
		forecast_days: 1,
		forecast_hours: 24
	};
	const url = "https://api.open-meteo.com/v1/forecast";

	try {
		const responses = await fetchWeatherApi(url, params);
		const response = responses[0];

		const range = (start: number, stop: number, step: number): number[] =>
			Array.from(
				{ length: Math.max(0, Math.ceil((stop - start) / step)) },
				(_, i) => start + i * step
			);

		const utcOffsetSeconds = response.utcOffsetSeconds();
		const timezone = response.timezone();
		const timezoneAbbreviation = response.timezoneAbbreviation();
		const latitude = response.latitude();
		const longitude = response.longitude();

		const current = response.current();
		const hourly = response.hourly();
		const daily = response.daily();

		console.log('current:', current);
		console.log('hourly:', hourly);
		console.log('daily:', daily);

		const currentTime =
			current ? new Date((Number(current.time()) + utcOffsetSeconds) * 1000) : null;

		const weatherData = {
			current: {
				time: currentTime,
				temperature2m: current?.variables ? current.variables(0)?.value() ?? null : null,
				apparentTemperature: current?.variables ? current.variables(1)?.value() ?? null : null,
				isDay: current?.variables ? current.variables(2)?.value() ?? null : null,
				precipitation: current?.variables ? current.variables(3)?.value() ?? null : null,
				rain: current?.variables ? current.variables(4)?.value() ?? null : null,
				showers: current?.variables ? current.variables(5)?.value() ?? null : null,
				snowfall: current?.variables ? current.variables(6)?.value() ?? null : null,
				windSpeed10m: current?.variables ? current.variables(7)?.value() ?? null : null,
				cloudCover: current?.variables ? current.variables(8)?.value() ?? null : null,
			},
			hourly: {
				time: hourly
					? range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
							(t) => new Date((t + utcOffsetSeconds) * 1000)
					  )
					: [],
				temperature2m: hourly?.variables ? hourly.variables(0)?.valuesArray() ?? [] : [],
				apparentTemperature: hourly?.variables ? hourly.variables(1)?.valuesArray() ?? [] : [],
				precipitationProbability: hourly?.variables ? hourly.variables(2)?.valuesArray() ?? [] : [],
				precipitation: hourly?.variables ? hourly.variables(3)?.valuesArray() ?? [] : [],
				rain: hourly?.variables ? hourly.variables(4)?.valuesArray() ?? [] : [],
				showers: hourly?.variables ? hourly.variables(5)?.valuesArray() ?? [] : [],
				snowfall: hourly?.variables ? hourly.variables(6)?.valuesArray() ?? [] : [],
				windSpeed10m: hourly?.variables ? hourly.variables(7)?.valuesArray() ?? [] : [],
				cloudCover: hourly?.variables ? hourly.variables(8)?.valuesArray()?.map(Number) ?? [] : [], // Ensure this is an array of numbers
			},
			daily: {
				time: daily
					? range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
							(t) => new Date((t + utcOffsetSeconds) * 1000)
					  )
					: [],
				sunrise: daily?.variables ? daily.variables(0)?.valuesArray() ?? [] : [],
				sunset: daily?.variables ? daily.variables(1)?.valuesArray() ?? [] : [],
			},
		};

		function formatDate(date: Date) {
			return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
		}

		function formatHour(hour: number) {
			const hourFormatted = hour % 12 || 12; // Convert 0 to 12 for 12 AM
			const amPm = hour < 12 ? 'am' : 'pm';
			return `${hourFormatted}${amPm}`;
		}

		for (let i = 0; i < weatherData.hourly.time.length; i++) {
			const date = weatherData.hourly.time[i];
			const formattedDate = formatDate(date);
			const formattedHour = formatHour(date.getHours());
			console.log(`Date: ${formattedDate}, Time: ${formattedHour}`);
			console.log(`  Current Temp: ${weatherData.hourly.temperature2m[i]?.toFixed(0)}°F`);
			console.log(`  Apparent Temp: ${weatherData.hourly.apparentTemperature[i]?.toFixed(0)}°F`);
			console.log(`  Precipitation Probability: ${weatherData.hourly.precipitationProbability[i]}%`);
			console.log(`  Precipitation: ${weatherData.hourly.precipitation[i]} inches`);
			console.log(`  Rain: ${weatherData.hourly.rain[i]} inches`);
			console.log(`  Showers: ${weatherData.hourly.showers[i]}`);
			console.log(`  Snowfall: ${weatherData.hourly.snowfall[i]} inches`);
			console.log(`  Wind Speed: ${weatherData.hourly.windSpeed10m[i]?.toFixed(0)} mph`);
			console.log(`  Cloud Cover: ${weatherData.hourly.cloudCover[i]}%`);
			console.log('-----------------------------------');
		}

		for (let i = 0; i < weatherData.daily.time.length; i++) {
			const date = weatherData.daily.time[i];
			const formattedDate = formatDate(date);

			const sunriseDate = weatherData.daily.sunrise[i] ? new Date(weatherData.daily.sunrise[i] * 1000) : null;
			const sunsetDate = weatherData.daily.sunset[i] ? new Date(weatherData.daily.sunset[i] * 1000) : null;

			console.log(`Date: ${formattedDate}`);
			if (sunriseDate) console.log(`  Sunrise: ${sunriseDate.toISOString()}`);
			if (sunsetDate) console.log(`  Sunset: ${sunsetDate.toISOString()}`);
			console.log(
				weatherData.daily.time[i]?.toISOString(),
				weatherData.daily.sunrise[i],
				weatherData.daily.sunset[i]
			);
			console.log('-----------------------------------');
		}
	} catch (err) {
		console.error('fetching data or processing error:', err);
	}
}

getDailyWeather();
