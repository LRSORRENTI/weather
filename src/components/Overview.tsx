import React from "react";
import "./styles/overview.css";
import { CardTitle } from "./ui/card";

type WeatherIconKey = "sunny" | "cloudy" | "partlyCloudy" | "rain" | "storm";

const weatherIcons: Record<WeatherIconKey, string> = {
  sunny: "☀️",
  cloudy: "☁️",
  partlyCloudy: "🌤️",
  rain: "🌧️",
  storm: "⛈️",
};

const getWeatherIcon = (cloudCover: number, precipitationProbability: number): string => {
  if (precipitationProbability > 50) return weatherIcons.rain;
  if (cloudCover > 80) return weatherIcons.cloudy;
  if (cloudCover > 50) return weatherIcons.partlyCloudy;
  return weatherIcons.sunny;
};

type WeatherCardProps = {
  time: string;
  temperature: number;
  cloudCover: number;
  precipitationProbability: number;
};

const WeatherCard = ({
  time,
  temperature,
  cloudCover,
  precipitationProbability,
}: WeatherCardProps) => {
  const weatherIcon = getWeatherIcon(cloudCover, precipitationProbability);

  return (
    <div className="weather-card">
      <div className="time">{time}</div>
      <div className="icon">{weatherIcon}</div>
      <div className="temperature">{temperature.toFixed(1)}°F</div>
    </div>
  );
};

type WeatherData = {
  hourly: {
    temperature2m: number[];
    cloudCover: number[];
    precipitationProbability: number[];
  };
};

type OverviewComponentProps = {
  setShowWeather?: (show: boolean) => void; // optional since you're not using it currently
  weatherData: WeatherData;
};

const OverviewComponent = ({ weatherData }: OverviewComponentProps) => {
  const timesToShow = ["6am", "10am", "2pm", "6pm", "10pm", "2am"];
  const timeIndices = [6, 10, 14, 18, 22, 2];

  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div>
      <h2 className="mx-4">Daily Weather</h2>
      <CardTitle className="flex mx-4 mb-5">
        <p className="mr-4">{new Date().toLocaleDateString()}</p>
        <p>{time}</p>
      </CardTitle>

      <div className="weather-overview">
        {timeIndices.map((index, idx) => (
          <WeatherCard
            key={idx}
            time={timesToShow[idx]}
            temperature={weatherData.hourly.temperature2m[index]}
            cloudCover={weatherData.hourly.cloudCover[index]}
            precipitationProbability={weatherData.hourly.precipitationProbability[index]}
          />
        ))}
      </div>
    </div>
  );
};

export default OverviewComponent;
