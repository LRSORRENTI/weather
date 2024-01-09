'use client'

import React, { useState, useEffect } from 'react';
import { fetchWeatherApi } from 'openmeteo';

function TestWeather() {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
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
                const responses = await fetchWeatherApi(url, params);

                // Assuming fetchWeatherApi is a function that correctly handles the API request
                const response = responses[0];
                console.log("API Response:", response);

                // Process and store the response in a format suitable for your component
                const processedData = processWeatherData(response);
                setWeatherData(processedData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    
    // Render your processed weather data here
    return (
        <div>
            <h1>Weather Data</h1>
            <div>
                <h2>Current Weather</h2>
                {weatherData && weatherData.current && (
                    <div>
                        <p>Time: {new Date(weatherData.current.time).toLocaleTimeString()}</p>
                        <p>Temperature: {weatherData.current.temperature2m.toFixed(0)}°F</p>
                        {/* Include other current weather details as needed */}
                    </div>
                )}
            </div>
            <div>
    <h2>Hourly Forecast</h2>
    {weatherData && weatherData.hourly && weatherData.hourly.temperature2m.map((temp, index) => (
        <div key={index}>
            <p>Time: {weatherData.hourly.formattedTime[index].formattedHour}</p>
            <p>Temperature: {Number.isFinite(temp) ? temp.toFixed(2) : 'N/A'}°F</p>
            {/* Include other hourly details as needed */}
        </div>
    ))}
</div>
            <div>
                <h2>Daily Forecast</h2>
                {weatherData && weatherData.daily && weatherData.daily.time.map((time, index) => (
                    <div key={index}>
                        <p>Date: {new Date(time).toLocaleDateString()}</p>
                        <p>Sunrise: {weatherData.daily.sunrise && weatherData.daily.sunrise[index] ? new Date(weatherData.daily.sunrise[index] * 1000).toLocaleTimeString() : 'N/A'}</p>
                        <p>Sunset: {weatherData.daily.sunset && weatherData.daily.sunset[index] ? new Date(weatherData.daily.sunset[index] * 1000).toLocaleTimeString() : 'N/A'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
    
}

// Helper function to process the response
function processWeatherData(response) {
    try {
        // Helper function to form time ranges
        const range = (start, stop, step) =>
            Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

        // Attributes for timezone and location
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const timezone = response.timezone();
        const timezoneAbbreviation = response.timezoneAbbreviation();
        const latitude = response.latitude();
        const longitude = response.longitude();

        const current = response.current();
        const hourly = response.hourly();
        const daily = response.daily();

        // Process the data
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
        // Format date and hour
        function formatDate(date: any) {
            return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
        }
        
        function formatHour(hour: number): string {
            const hourFormatted = hour % 12 || 12; // Convert 0 to 12 for 12 AM
            const amPm = hour < 12 ? 'am' : 'pm';
            return `${hourFormatted}${amPm}`;
        }
        

        // Add formatted date and time to the weather data
        // For hourly data
        weatherData.hourly.formattedTime = weatherData.hourly.time.map(date => {
            return {
                formattedDate: formatDate(date),
                formattedHour: formatHour(date.getHours())
            };
        });

        // For daily data
        weatherData.daily.formattedTime = weatherData.daily.time.map(date => {
            return formatDate(date);
        });
        console.log("Processed Weather Data:", weatherData);

        return weatherData;

    } catch (err) {
        console.error('Error processing weather data:', err);
        // Optionally handle the error in a way that's appropriate for your component
    }
}

export default TestWeather;
