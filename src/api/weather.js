// const { fetchWeatherApi } = require('openmeteo');

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

        const range = (start, stop, step) => Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

        const utcOffsetSeconds = response.utcOffsetSeconds();
        const timezone = response.timezone();
        const timezoneAbbreviation = response.timezoneAbbreviation();
        const latitude = response.latitude();
        const longitude = response.longitude();

        const current = response.current() || {};
        const hourly = response.hourly() || {};
        const daily = response.daily() || {};

        const weatherData = {
            current: {
                time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
                temperature2m: current.variables ? current.variables(0).value() : null,
                apparentTemperature: current.variables ? current.variables(1).value() : null,
                isDay: current.variables ? current.variables(2).value() : null,
                precipitation: current.variables ? current.variables(3).value() : null,
                rain: current.variables ? current.variables(4).value() : null,
                showers: current.variables ? current.variables(5).value() : null,
                snowfall: current.variables ? current.variables(6).value() : null,
                windSpeed10m: current.variables ? current.variables(7).value() : null,
                cloudCover: current.variables ? current.variables(8).value() : null
            },
            hourly: {
                time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                    (t) => new Date((t + utcOffsetSeconds) * 1000)
                ),
                temperature2m: hourly.variables ? hourly.variables(0).valuesArray() : [],
                apparentTemperature: hourly.variables ? hourly.variables(1).valuesArray() : [],
                precipitationProbability: hourly.variables ? hourly.variables(2).valuesArray() : [],
                precipitation: hourly.variables ? hourly.variables(3).valuesArray() : [],
                rain: hourly.variables ? hourly.variables(4).valuesArray() : [],
                showers: hourly.variables ? hourly.variables(5).valuesArray() : [],
                snowfall: hourly.variables ? hourly.variables(6).valuesArray() : [],
                windSpeed10m: hourly.variables ? hourly.variables(7).valuesArray() : [],
                cloudCover: hourly.variables ? hourly.variables(8).valuesArray().map(Number) : []
            },
            daily: {
                time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                    (t) => new Date((t + utcOffsetSeconds) * 1000)
                ),
                sunrise: daily.variables ? daily.variables(0).valuesArray() : [],
                sunset: daily.variables ? daily.variables(1).valuesArray() : []
            }
        };

        return weatherData;
    } catch (err) {
        console.error('fetching data or processing error:', err);
        return null;
    }
}

export default getDailyWeather;
