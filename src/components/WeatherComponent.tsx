'use client'

import React, { useState, useEffect } from 'react';
import { fetchWeatherApi } from 'openmeteo';
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Label } from '@radix-ui/react-dropdown-menu';
  import { Input } from './ui/input';
  import './styles/hourly.css'


function WeatherComponent() {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = {
                    "latitude": 43.0389,
                    "longitude": -87.9065,
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
    let time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Render your processed weather data here
    return (
        <div>
            <div className="main-card-wrap flex justify-center">
            <Card className="w-[350px] mb-10" style={{border: "2px solid skyblue"}} >
      <CardHeader className='flex justify-center'>
        <div>
            {weatherData.current.isDay === 1 ? <SunIcon/> : <MoonIcon/>}
        </div>
        <CardTitle className='flex justify-between'> <p> {new Date().toLocaleDateString()}</p><p>{time}</p></CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <div className='flex justify-center text-2xl'>Current Temperature</div>
                <div className='flex justify-center text-4xl' style={{color: "skyblue"}}>{weatherData.current.temperature2m.toFixed(1) + "°F"}</div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
      </CardFooter>
    </Card>
    </div>
            <div className='flex justify-center'>
            <div className='flex justify-center flex-col'>
           <h2 style={{textAlign: "center"}}>Hourly</h2>
           <div style={{maxWidth: "700px"}} className="hourly-temp-wrap sm:flex flex-row flex-wrap justify-evenly col-span-3">
           <p>
           12 AM:
           {" " + weatherData.hourly.temperature2m[0].toFixed(1) + "°F"}
           </p>
           <p>
            1 AM:
           {" " + weatherData.hourly.temperature2m[1].toFixed(1) + "°F"}
           </p>
           <p>
            2 AM:
           {" " + weatherData.hourly.temperature2m[2].toFixed(1) + "°F"}
           </p>
           <p>
            3 AM:
           {" " + weatherData.hourly.temperature2m[3].toFixed(1) + "°F"}
           </p>
           <p>
            4 AM:
           {" " + weatherData.hourly.temperature2m[4].toFixed(1) + "°F"}
           </p>
           <p>
            5 AM:
           {" " + weatherData.hourly.temperature2m[5].toFixed(1) + "°F"}
           </p>
           <p>
           6 AM:
           {" " + weatherData.hourly.temperature2m[6].toFixed(1) + "°F"}
           </p>
           <p>
            7 AM:
           {" " + weatherData.hourly.temperature2m[7].toFixed(1) + "°F"}
           </p>
           <p>
            8 AM:
           {" " + weatherData.hourly.temperature2m[8].toFixed(1) + "°F"}
           </p>
           <p>
            9 AM:
           {" " + weatherData.hourly.temperature2m[9].toFixed(1) + "°F"}
           </p>
           <p>
            10 AM:
           {" " + weatherData.hourly.temperature2m[10].toFixed(1) + "°F"}
           </p>
           <p>
            11 AM:
           {" " + weatherData.hourly.temperature2m[11].toFixed(1) + "°F"}
           </p>
           <p>
           12 PM:
           {" " + weatherData.hourly.temperature2m[12].toFixed(1) + "°F"}
           </p>
           <p>
            1 PM:
           {" " + weatherData.hourly.temperature2m[13].toFixed(1) + "°F"}
           </p>
           <p>
            2 PM:
           {" " + weatherData.hourly.temperature2m[14].toFixed(1) + "°F"}
           </p>
           <p>
            3 PM:
           {" " + weatherData.hourly.temperature2m[15].toFixed(1) + "°F"}
           </p>
           <p>
            4 PM:
           {" " + weatherData.hourly.temperature2m[16].toFixed(1) + "°F"}
           </p>
           <p>
            5 PM:
           {" " + weatherData.hourly.temperature2m[17].toFixed(1) + "°F"}
           </p>
           <p>
           6 PM:
           {" " + weatherData.hourly.temperature2m[18].toFixed(1) + "°F"}
           </p>
           <p>
            7 PM:
           {" " + weatherData.hourly.temperature2m[19].toFixed(1) + "°F"}
           </p>
           <p>
            8 PM:
           {" " + weatherData.hourly.temperature2m[20].toFixed(1) + "°F"}
           </p>
           <p>
            9 PM:
           {" " + weatherData.hourly.temperature2m[21].toFixed(1) + "°F"}
           </p>
           <p>
            10 PM:
           {" " + weatherData.hourly.temperature2m[22].toFixed(1) + "°F"}
           </p>
           <p>
            11 PM:
           {" " + weatherData.hourly.temperature2m[23].toFixed(1) + "°F"}
           </p>
           </div>
           </div>
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

export default WeatherComponent;
