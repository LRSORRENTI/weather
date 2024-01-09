"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var console_1 = require("console");
var openmeteo_1 = require("openmeteo");
function getDailyWeather() {
    return __awaiter(this, void 0, void 0, function () {
        // Function to format date to MM-DD-YYYY
        function formatDate(date) {
            return "".concat(date.getMonth() + 1, "-").concat(date.getDate(), "-").concat(date.getFullYear());
        }
        // Function to format the hour in 12-hour format with AM/PM
        function formatHour(hour) {
            var hourFormatted = hour % 12 || 12; // Convert 0 to 12 for 12 AM
            var amPm = hour < 12 ? 'am' : 'pm';
            return "".concat(hourFormatted).concat(amPm);
        }
        var params, url, responses, response, range, utcOffsetSeconds_1, timezone, timezoneAbbreviation, latitude, longitude, current, hourly, daily, weatherData, i, date, formattedDate, formattedHour, i, date, formattedDate, sunriseDate, sunsetDate, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = {
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
                    url = "https://api.open-meteo.com/v1/forecast";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, openmeteo_1.fetchWeatherApi)(url, params)];
                case 2:
                    responses = _a.sent();
                    response = responses[0];
                    range = function (start, stop, step) {
                        return Array.from({ length: (stop - start) / step }, function (_, i) { return start + i * step; });
                    };
                    utcOffsetSeconds_1 = response.utcOffsetSeconds();
                    timezone = response.timezone();
                    timezoneAbbreviation = response.timezoneAbbreviation();
                    latitude = response.latitude();
                    longitude = response.longitude();
                    current = response.current();
                    hourly = response.hourly();
                    daily = response.daily();
                    weatherData = {
                        current: {
                            time: new Date((Number(current.time()) + utcOffsetSeconds_1) * 1000),
                            temperature2m: current.variables(0).value(),
                            apparentTemperature: current.variables(1).value(),
                            isDay: current.variables(2).value(),
                            precipitation: current.variables(3).value(),
                            rain: current.variables(4).value(),
                            showers: current.variables(5).value(),
                            snowfall: current.variables(6).value(),
                            windSpeed10m: current.variables(7).value()
                        },
                        hourly: {
                            time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(function (t) { return new Date((t + utcOffsetSeconds_1) * 1000); }),
                            temperature2m: hourly.variables(0).valuesArray(),
                            apparentTemperature: hourly.variables(1).valuesArray(),
                            precipitationProbability: hourly.variables(2).valuesArray(),
                            precipitation: hourly.variables(3).valuesArray(),
                            rain: hourly.variables(4).valuesArray(),
                            showers: hourly.variables(5).valuesArray(),
                            snowfall: hourly.variables(6).valuesArray(),
                            windSpeed10m: hourly.variables(7).valuesArray()
                        },
                        daily: {
                            time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(function (t) { return new Date((t + utcOffsetSeconds_1) * 1000); }),
                            sunrise: daily.variables(0).valuesArray(),
                            sunset: daily.variables(1).valuesArray()
                        }
                    };
                    // `weatherData` now contains a simple structure with arrays for datetime and weather data
                    for (i = 0; i < weatherData.hourly.time.length; i++) {
                        date = weatherData.hourly.time[i];
                        formattedDate = formatDate(date);
                        formattedHour = formatHour(date.getHours());
                        console.log("Date: ".concat(formattedDate, ", Time: ").concat(formattedHour));
                        console.log("  Current Temp: ".concat(weatherData.hourly.temperature2m[i].toFixed(0), "\u00B0F"));
                        console.log("  Apparent Temp: ".concat(weatherData.hourly.apparentTemperature[i].toFixed(0), "\u00B0F"));
                        console.log("  Precipitation Probability: ".concat(weatherData.hourly.precipitationProbability[i], "%"));
                        console.log("  Precipitation: ".concat(weatherData.hourly.precipitation[i], " inches"));
                        console.log("  Rain: ".concat(weatherData.hourly.rain[i], " inches"));
                        console.log("  Showers: ".concat(weatherData.hourly.showers[i]));
                        console.log("  Snowfall: ".concat(weatherData.hourly.snowfall[i], " inches"));
                        console.log("  Wind Speed: ".concat(weatherData.hourly.windSpeed10m[i], " mph"));
                        console.log('-----------------------------------');
                    }
                    // Logging the daily weather data
                    for (i = 0; i < weatherData.daily.time.length; i++) {
                        date = weatherData.daily.time[i];
                        formattedDate = formatDate(date);
                        sunriseDate = new Date(weatherData.daily.sunrise[i] * 1000);
                        sunsetDate = new Date(weatherData.daily.sunset[i] * 1000);
                        console.log("Date: ".concat(formattedDate));
                        console.log("  Sunrise: ".concat(sunriseDate.toISOString()));
                        console.log("  Sunset: ".concat(sunsetDate.toISOString()));
                        console.log('-----------------------------------');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error('fetching data or processing error:', console_1.error);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
getDailyWeather();
