'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { fetchWeatherApi } from 'openmeteo';
import { Cloud, CloudDrizzle, CloudFog, CloudRain, CloudSnow, CloudSun, MoonStar, RefreshCw, SunMedium, Wind, Droplets } from 'lucide-react';

type HourlyEntry = {
  time: Date;
  temperature: number;
  precipitationProbability: number;
  weatherCode: number;
  windSpeed: number;
};

type DailyEntry = {
  time: Date;
  weatherCode: number;
  maxTemp: number;
  minTemp: number;
  sunrise: string | any;
  sunset: string | any;
  precipitationProbability: number;
};

type WeatherData = {
  current: {
    time: Date;
    temperature: number;
    apparentTemperature: number;
    isDay: number;
    precipitation: number;
    windSpeed: number;
    humidity: number;
    cloudCover: number;
    weatherCode: number;
    pressure: number;
  };
  hourly: HourlyEntry[];
  daily: DailyEntry[];
  meta: {
    timezone: string | any;
    timezoneAbbreviation: string | any;
    latitude: number;
    longitude: number;
  };
};

function toArray(values?: Float32Array | null) {
  return values ? Array.from(values) : [];
}

function resolveWeatherIcon(code: number, isDay = true) {
  if ([0].includes(code)) return isDay ? SunMedium : MoonStar;
  if ([1, 2].includes(code)) return CloudSun;
  if ([3].includes(code)) return Cloud;
  if ([45, 48].includes(code)) return CloudFog;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return CloudSnow;
  if ([51, 53, 55, 56, 57, 80, 81, 82].includes(code)) return CloudDrizzle;
  if ([61, 63, 65, 66, 67].includes(code)) return CloudRain;
  return Cloud;
}

function resolveWeatherLabel(code: number) {
  if (code === 0) return 'Clear sky';
  if ([1, 2].includes(code)) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if ([45, 48].includes(code)) return 'Foggy';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snow';
  if ([51, 53, 55, 56, 57, 80, 81, 82].includes(code)) return 'Showers';
  if ([61, 63, 65, 66, 67].includes(code)) return 'Rain';
  if ([95, 96, 99].includes(code)) return 'Thunderstorm';
  return 'Variable';
}

async function getWeather(): Promise<WeatherData | null> {
  const params = {
    latitude: 43.0389,
    longitude: -87.9065,
    current: [
      'temperature_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'wind_speed_10m',
      'relative_humidity_2m',
      'cloud_cover',
      'weather_code',
      'surface_pressure',
    ],
    hourly: [
      'temperature_2m',
      'precipitation_probability',
      'weather_code',
      'wind_speed_10m',
    ],
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'precipitation_probability_max',
    ],
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    precipitation_unit: 'inch',
    timezone: 'America/Chicago',
    forecast_days: 7,
    forecast_hours: 24,
  };

  try {
    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];

    const range = (start: number, stop: number, step: number) =>
      Array.from({ length: Math.max(0, (stop - start) / step) }, (_, i) => start + i * step);

    const utcOffsetSeconds = response.utcOffsetSeconds();
    const current = response.current();
    const hourly = response.hourly();
    const daily = response.daily();

    if (!current || !hourly || !daily) {
      return null;
    }

    const hourlyTimes = range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
      (t) => new Date((t + utcOffsetSeconds) * 1000),
    );
    const dailyTimes = range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
      (t) => new Date((t + utcOffsetSeconds) * 1000),
    );

    const hourlyTemps = toArray(hourly.variables(0)?.valuesArray());
    const hourlyPrecip = toArray(hourly.variables(1)?.valuesArray());
    const hourlyCodes = toArray(hourly.variables(2)?.valuesArray());
    const hourlyWind = toArray(hourly.variables(3)?.valuesArray());

    const dailyCodes = toArray(daily.variables(0)?.valuesArray());
    const dailyMax = toArray(daily.variables(1)?.valuesArray());
    const dailyMin = toArray(daily.variables(2)?.valuesArray());
    const dailyPrecip = toArray(daily.variables(5)?.valuesArray());

    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        query.set(key, value.join(','));
      } else {
        query.set(key, String(value));
      }
    });

    const jsonResponse = await fetch(`${url}?${query.toString()}`);
    const jsonData = await jsonResponse.json();
    const sunriseIso: string[] = jsonData?.daily?.sunrise ?? [];
    const sunsetIso: string[] = jsonData?.daily?.sunset ?? [];

    console.log('raw sunrise:', sunriseIso?.[0], 'raw sunset:', sunsetIso?.[0]);

    const hourlyEntries = hourlyTimes.slice(0, 24).map((time, index) => ({
      time,
      temperature: hourlyTemps[index] ?? 0,
      precipitationProbability: hourlyPrecip[index] ?? 0,
      weatherCode: hourlyCodes[index] ?? 0,
      windSpeed: hourlyWind[index] ?? 0,
    }));

    const dailyEntries = dailyTimes.map((time, index) => ({
      time,
      weatherCode: dailyCodes[index] ?? 0,
      maxTemp: dailyMax[index] ?? 0,
      minTemp: dailyMin[index] ?? 0,
      sunrise: sunriseIso[index] ?? null,
      sunset: sunsetIso[index] ?? null,
      precipitationProbability: dailyPrecip[index] ?? 0,
    }));

    return {
      current: {
        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
        temperature: current.variables(0)?.value() ?? 0,
        apparentTemperature: current.variables(1)?.value() ?? 0,
        isDay: current.variables(2)?.value() ?? 1,
        precipitation: current.variables(3)?.value() ?? 0,
        windSpeed: current.variables(4)?.value() ?? 0,
        humidity: current.variables(5)?.value() ?? 0,
        cloudCover: current.variables(6)?.value() ?? 0,
        weatherCode: current.variables(7)?.value() ?? 0,
        pressure: current.variables(8)?.value() ?? 0,
      },
      hourly: hourlyEntries,
      daily: dailyEntries,
      meta: {
        timezone: response.timezone(),
        timezoneAbbreviation: response.timezoneAbbreviation(),
        latitude: response.latitude(),
        longitude: response.longitude(),
      },
    };
  } catch (error) {
    console.error('Unable to fetch weather data:', error);
    return null;
  }
}

function formatTime(value: Date) {
  return value.toLocaleTimeString([], { hour: 'numeric' });
}

function formatClock(value: Date) {
  return value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDay(value: Date) {
  return value.toLocaleDateString([], { weekday: 'short' });
}

function fmtHHMM(iso?: string | null) {
  if (!iso) {
    return '--:--';
  }
  const timeSection = iso.split('T')[1] ?? '';
  const [hh, mm] = timeSection.split(':').map(Number);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) {
    return '--:--';
  }
  const hour12 = ((hh + 11) % 12) + 1;
  const ampm = hh >= 12 ? 'PM' : 'AM';
  return `${hour12}:${String(mm).padStart(2, '0')} ${ampm}`;
}

function MetricTile({
  label,
  value,
  unit,
  icon,
  delay,
}: {
  label: string;
  value: string | number;
  unit: string;
  icon: ReactNode;
  delay: number;
}) {
  return (
    <article className="weather-glass metric-card reveal-tile" style={{ animationDelay: `${delay}ms` }}>
      <div className="metric-header">
        <span>{label}</span>
        {icon}
      </div>
      <p className="metric-value">
        {value}
        <span>{unit}</span>
      </p>
    </article>
  );
}

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getWeather();
    if (!result) {
      setError('Weather service unavailable right now. Please retry.');
    }
    setWeatherData(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const currentCondition = useMemo(() => {
    if (!weatherData) return null;
    const Icon = resolveWeatherIcon(weatherData.current.weatherCode, weatherData.current.isDay === 1);
    return { Icon, label: resolveWeatherLabel(weatherData.current.weatherCode) };
  }, [weatherData]);

  if (loading) {
    return (
      <main className="weather-shell">
        <section className="weather-glass weather-glass-primary hero-skeleton" />
        <section className="dashboard-main">
          <div className="dashboard-left">
            <section className="weather-grid">
              {Array.from({ length: 2 }).map((_, index) => (
                <article key={index} className="weather-glass weather-glass-secondary metric-skeleton" />
              ))}
            </section>
            <section className="weather-glass weather-glass-secondary rail-skeleton" />
            <section className="weather-glass weather-glass-secondary rail-skeleton" />
          </div>
          <aside className="dashboard-right">
            <section className="weather-glass weather-glass-secondary rail-skeleton" />
            <section className="weather-glass weather-glass-primary rail-skeleton" />
          </aside>
        </section>
        <section className="weather-glass weather-glass-primary rail-skeleton" />
      </main>
    );
  }

  if (error || !weatherData || !currentCondition) {
    return (
      <main className="weather-shell">
        <section className="weather-glass weather-glass-primary error-panel">
          <h2>Weather dashboard offline</h2>
          <p>{error ?? 'Unexpected response from weather service.'}</p>
          <button onClick={refreshData} className="refresh-button">
            Try again
          </button>
        </section>
      </main>
    );
  }

  const { Icon } = currentCondition;
  const today = weatherData.daily[0];
  const sunriseText = fmtHHMM(today?.sunrise);
  const sunsetText = fmtHHMM(today?.sunset);

  return (
    <main className="weather-shell">
      <section className="weather-glass weather-glass-primary hero-panel hero-media reveal-hero">
        <div className="hero-copy">
          <p className="eyebrow">MILWAUKEE, WISCONSIN</p>
          <h1>{currentCondition.label}</h1>
          <p className="updated-at">
            Updated {formatClock(weatherData.current.time)} {weatherData.meta.timezoneAbbreviation}
          </p>
          <div className="hero-temp">
            <span>{Math.round(weatherData.current.temperature)}</span>
            <small>F</small>
          </div>
          <p className="feels-like">Feels like {Math.round(weatherData.current.apparentTemperature)} F</p>
        </div>
        <div className="hero-icon-wrap">
          <Icon size={108} strokeWidth={1.2} />
          <button onClick={refreshData} className="refresh-button" aria-label="Refresh weather data">
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </section>

      <section className="dashboard-main">
        <div className="dashboard-left">
          <section className="weather-grid">
            <MetricTile
              label="Wind"
              value={Math.round(weatherData.current.windSpeed)}
              unit="mph"
              icon={<Wind size={16} />}
              delay={90}
            />
            <MetricTile
              label="Humidity"
              value={Math.round(weatherData.current.humidity)}
              unit="%"
              icon={<Droplets size={16} />}
              delay={130}
            />
          </section>

          <section className="weather-glass weather-glass-secondary reveal-tile" style={{ animationDelay: '180ms' }}>
            <div className="section-head">
              <h2>Next 24 Hours</h2>
              <p>Temperature, rain chance, and wind</p>
            </div>
            <div className="hourly-scroll-wrap">
              <div className="hourly-rail">
                {weatherData.hourly.map((entry) => {
                  const HourIcon = resolveWeatherIcon(entry.weatherCode, entry.time.getHours() >= 6 && entry.time.getHours() < 19);
                  return (
                    <article key={entry.time.toISOString()} className="hour-card" tabIndex={0}>
                      <p>{formatTime(entry.time)}</p>
                      <HourIcon size={20} strokeWidth={1.7} />
                      <strong>{Math.round(entry.temperature)}F</strong>
                      <small>{Math.round(entry.precipitationProbability)}% rain</small>
                      <small>{Math.round(entry.windSpeed)} mph wind</small>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="weather-glass weather-glass-secondary reveal-tile" style={{ animationDelay: '220ms' }}>
            <div className="section-head">
              <h2>7-Day Forecast</h2>
              <p>Week at a glance for Milwaukee</p>
            </div>
            <div className="daily-list">
              {weatherData.daily.map((entry) => {
                const DailyIcon = resolveWeatherIcon(entry.weatherCode);
                return (
                  <article key={entry.time.toISOString()} className="day-row" tabIndex={0}>
                    <div className="day-core">
                      <p>{formatDay(entry.time)}</p>
                      <DailyIcon size={18} strokeWidth={1.8} />
                      <span>{resolveWeatherLabel(entry.weatherCode)}</span>
                    </div>
                    <div className="day-temps">
                      <strong>{Math.round(entry.maxTemp)}F</strong>
                      <small>{Math.round(entry.minTemp)}F</small>
                    </div>
                    <p className="day-precip">{Math.round(entry.precipitationProbability)}% precip</p>
                  </article>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="dashboard-right">
          <section className="weather-glass weather-glass-secondary reveal-tile" style={{ animationDelay: '170ms' }}>
            <div className="section-head">
              <h2>5-Day Forecast</h2>
              <p>Short-range outlook</p>
            </div>
            <div className="five-day-list">
              {weatherData.daily.slice(0, 5).map((entry) => {
                const ForecastIcon = resolveWeatherIcon(entry.weatherCode);
                return (
                  <article key={entry.time.toISOString()} className="five-day-row">
                    <div className="five-day-left">
                      <p>{formatDay(entry.time)}</p>
                      <ForecastIcon size={16} strokeWidth={1.9} />
                      <span>{resolveWeatherLabel(entry.weatherCode)}</span>
                    </div>
                    <p className="five-day-temps">
                      {Math.round(entry.maxTemp)}F/{Math.round(entry.minTemp)}F
                    </p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="weather-glass weather-glass-primary radar-card reveal-tile" style={{ animationDelay: '210ms' }}>
            <div className="section-head">
              <h2>Weather Radar</h2>
              <p>Regional snapshot</p>
            </div>
            <div className="radar-image-wrap" />
            <div className="radar-controls">
              <button type="button" className="radar-pill">
                Satellite View
              </button>
              <button type="button" className="radar-pill">
                Radar
              </button>
            </div>
          </section>
        </aside>
      </section>

      <section className="weather-glass weather-glass-primary sunrise-card reveal-tile" style={{ animationDelay: '260ms' }}>
        <div className="sunrise-overlay">
          <div className="sunrise-copy">
            <h2>Sunrise &amp; Sunset</h2>
            <p>Milwaukee daylight window</p>
          </div>
          <div className="sunrise-times">
            <div>
              <span>Sunrise</span>
              <strong>{sunriseText}</strong>
            </div>
            <div>
              <span>Sunset</span>
              <strong>{sunsetText}</strong>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
