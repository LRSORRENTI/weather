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
var openmeteo_1 = require("openmeteo");
// Async function to handle the API call and data processing
function fetchAndProcessWeatherData() {
    return __awaiter(this, void 0, void 0, function () {
        var params, url, responses, response, utcOffsetSeconds, timezone, timezoneAbbreviation, latitude, longitude, hourly, range, weatherData, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = {
                        "latitude": 52.52,
                        "longitude": 13.41,
                        "hourly": ["temperature_2m", "apparent_temperature", "precipitation_probability", "precipitation", "rain", "showers", "snowfall", "snow_depth", "weather_code", "is_day"],
                        "temperature_unit": "fahrenheit",
                        "timezone": "America/Chicago",
                        "forecast_days": 1
                    };
                    url = "https://api.open-meteo.com/v1/forecast";
                    return [4 /*yield*/, (0, openmeteo_1.fetchWeatherApi)(url, params)];
                case 1:
                    responses = _a.sent();
                    response = responses[0];
                    utcOffsetSeconds = response.utcOffsetSeconds();
                    timezone = response.timezone();
                    timezoneAbbreviation = response.timezoneAbbreviation();
                    latitude = response.latitude();
                    longitude = response.longitude();
                    hourly = response.hourly();
                    range = function (start, stop, step) {
                        return Array.from({ length: (stop - start) / step }, function (_, i) { return start + i * step; });
                    };
                    weatherData = {
                        hourly: {
                            time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(function (t) { return new Date((t + utcOffsetSeconds) * 1000); }),
                            temperature2m: hourly.variables(0).valuesArray(),
                            apparentTemperature: hourly.variables(1).valuesArray(),
                            precipitationProbability: hourly.variables(2).valuesArray(),
                            precipitation: hourly.variables(3).valuesArray(),
                            rain: hourly.variables(4).valuesArray(),
                            showers: hourly.variables(5).valuesArray(),
                            snowfall: hourly.variables(6).valuesArray(),
                            snowDepth: hourly.variables(7).valuesArray(),
                            weatherCode: hourly.variables(8).valuesArray(),
                            isDay: hourly.variables(9).valuesArray()
                        }
                    };
                    // Logging the weather data
                    for (i = 0; i < weatherData.hourly.time.length; i++) {
                        console.log("\n            date: ".concat(weatherData.hourly.time[i].toISOString(), ",\n            temp 2m ").concat(weatherData.hourly.temperature2m[i], ",\n            apprent temp: ").concat(weatherData.hourly.apparentTemperature[i], ",\n            precipitation probability: ").concat(weatherData.hourly.precipitationProbability[i], ",\n            precipitation: ").concat(weatherData.hourly.precipitation[i], ",\n            rain: ").concat(weatherData.hourly.rain[i], ",\n            showers: ").concat(weatherData.hourly.showers[i], ",\n            snowfall: ").concat(weatherData.hourly.snowfall[i], ",\n            snow depth: ").concat(weatherData.hourly.snowDepth[i], ",\n            weather_code: ").concat(weatherData.hourly.weatherCode[i], ",\n            day or night ").concat(weatherData.hourly.isDay[i], "\n            "));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// Call the async function
fetchAndProcessWeatherData();
