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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var openmeteo_1 = require("openmeteo");
function getDailyWeather() {
    return __awaiter(this, void 0, void 0, function () {
        function formatDate(date) {
            return "".concat(date.getMonth() + 1, "-").concat(date.getDate(), "-").concat(date.getFullYear());
        }
        function formatHour(hour) {
            var hourFormatted = hour % 12 || 12; // Convert 0 to 12 for 12 AM
            var amPm = hour < 12 ? 'am' : 'pm';
            return "".concat(hourFormatted).concat(amPm);
        }
        var params, url, responses, response, range, utcOffsetSeconds_1, timezone, timezoneAbbreviation, latitude, longitude, current, hourly, daily, currentTime, weatherData, i, date, formattedDate, formattedHour, i, date, formattedDate, sunriseDate, sunsetDate, err_1;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20;
        return __generator(this, function (_21) {
            switch (_21.label) {
                case 0:
                    params = {
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
                    url = "https://api.open-meteo.com/v1/forecast";
                    _21.label = 1;
                case 1:
                    _21.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, openmeteo_1.fetchWeatherApi)(url, params)];
                case 2:
                    responses = _21.sent();
                    response = responses[0];
                    range = function (start, stop, step) {
                        return Array.from({ length: Math.max(0, Math.ceil((stop - start) / step)) }, function (_, i) { return start + i * step; });
                    };
                    utcOffsetSeconds_1 = response.utcOffsetSeconds();
                    timezone = response.timezone();
                    timezoneAbbreviation = response.timezoneAbbreviation();
                    latitude = response.latitude();
                    longitude = response.longitude();
                    current = response.current();
                    hourly = response.hourly();
                    daily = response.daily();
                    console.log('current:', current);
                    console.log('hourly:', hourly);
                    console.log('daily:', daily);
                    currentTime = current ? new Date((Number(current.time()) + utcOffsetSeconds_1) * 1000) : null;
                    weatherData = {
                        current: {
                            time: currentTime,
                            temperature2m: (current === null || current === void 0 ? void 0 : current.variables) ? (_b = (_a = current.variables(0)) === null || _a === void 0 ? void 0 : _a.value()) !== null && _b !== void 0 ? _b : null : null,
                            apparentTemperature: (current === null || current === void 0 ? void 0 : current.variables) ? (_d = (_c = current.variables(1)) === null || _c === void 0 ? void 0 : _c.value()) !== null && _d !== void 0 ? _d : null : null,
                            isDay: (current === null || current === void 0 ? void 0 : current.variables) ? (_f = (_e = current.variables(2)) === null || _e === void 0 ? void 0 : _e.value()) !== null && _f !== void 0 ? _f : null : null,
                            precipitation: (current === null || current === void 0 ? void 0 : current.variables) ? (_h = (_g = current.variables(3)) === null || _g === void 0 ? void 0 : _g.value()) !== null && _h !== void 0 ? _h : null : null,
                            rain: (current === null || current === void 0 ? void 0 : current.variables) ? (_k = (_j = current.variables(4)) === null || _j === void 0 ? void 0 : _j.value()) !== null && _k !== void 0 ? _k : null : null,
                            showers: (current === null || current === void 0 ? void 0 : current.variables) ? (_m = (_l = current.variables(5)) === null || _l === void 0 ? void 0 : _l.value()) !== null && _m !== void 0 ? _m : null : null,
                            snowfall: (current === null || current === void 0 ? void 0 : current.variables) ? (_p = (_o = current.variables(6)) === null || _o === void 0 ? void 0 : _o.value()) !== null && _p !== void 0 ? _p : null : null,
                            windSpeed10m: (current === null || current === void 0 ? void 0 : current.variables) ? (_r = (_q = current.variables(7)) === null || _q === void 0 ? void 0 : _q.value()) !== null && _r !== void 0 ? _r : null : null,
                            cloudCover: (current === null || current === void 0 ? void 0 : current.variables) ? (_t = (_s = current.variables(8)) === null || _s === void 0 ? void 0 : _s.value()) !== null && _t !== void 0 ? _t : null : null,
                        },
                        hourly: {
                            time: hourly
                                ? range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(function (t) { return new Date((t + utcOffsetSeconds_1) * 1000); })
                                : [],
                            temperature2m: (hourly === null || hourly === void 0 ? void 0 : hourly.variables) ? (_v = (_u = hourly.variables(0)) === null || _u === void 0 ? void 0 : _u.valuesArray()) !== null && _v !== void 0 ? _v : [] : [],
                            apparentTemperature: (hourly === null || hourly === void 0 ? void 0 : hourly.variables) ? (_x = (_w = hourly.variables(1)) === null || _w === void 0 ? void 0 : _w.valuesArray()) !== null && _x !== void 0 ? _x : [] : [],
                            precipitationProbability: (hourly === null || hourly === void 0 ? void 0 : hourly.variables) ? (_z = (_y = hourly.variables(2)) === null || _y === void 0 ? void 0 : _y.valuesArray()) !== null && _z !== void 0 ? _z : [] : [],
                            precipitation: (hourly === null || hourly === void 0 ? void 0 : hourly.variables) ? (_1 = (_0 = hourly.variables(3)) === null || _0 === void 0 ? void 0 : _0.valuesArray()) !== null && _1 !== void 0 ? _1 : [] : [],
                            rain: (hourly === null || hourly === void 0 ? void 0 : hourly.variables) ? (_3 = (_2 = hourly.variables(4)) === null || _2 === void 0 ? void 0 : _2.valuesArray()) !== null && _3 !== void 0 ? _3 : [] : [],
                            showers: (hourly === null || hourly === void 0 ? void 0 : hourly.variables) ? (_5 = (_4 = hourly.variables(5)) === null || _4 === void 0 ? void 0 : _4.valuesArray()) !== null && _5 !== void 0 ? _5 : [] : [],
                            snowfall: (hourly === null || hourly === void 0 ? void 0 : hourly.variables) ? (_7 = (_6 = hourly.variables(6)) === null || _6 === void 0 ? void 0 : _6.valuesArray()) !== null && _7 !== void 0 ? _7 : [] : [],
                            windSpeed10m: (hourly === null || hourly === void 0 ? void 0 : hourly.variables) ? (_9 = (_8 = hourly.variables(7)) === null || _8 === void 0 ? void 0 : _8.valuesArray()) !== null && _9 !== void 0 ? _9 : [] : [],
                            cloudCover: (hourly === null || hourly === void 0 ? void 0 : hourly.variables) ? (_12 = (_11 = (_10 = hourly.variables(8)) === null || _10 === void 0 ? void 0 : _10.valuesArray()) === null || _11 === void 0 ? void 0 : _11.map(Number)) !== null && _12 !== void 0 ? _12 : [] : [], // Ensure this is an array of numbers
                        },
                        daily: {
                            time: daily
                                ? range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(function (t) { return new Date((t + utcOffsetSeconds_1) * 1000); })
                                : [],
                            sunrise: (daily === null || daily === void 0 ? void 0 : daily.variables) ? (_14 = (_13 = daily.variables(0)) === null || _13 === void 0 ? void 0 : _13.valuesArray()) !== null && _14 !== void 0 ? _14 : [] : [],
                            sunset: (daily === null || daily === void 0 ? void 0 : daily.variables) ? (_16 = (_15 = daily.variables(1)) === null || _15 === void 0 ? void 0 : _15.valuesArray()) !== null && _16 !== void 0 ? _16 : [] : [],
                        },
                    };
                    for (i = 0; i < weatherData.hourly.time.length; i++) {
                        date = weatherData.hourly.time[i];
                        formattedDate = formatDate(date);
                        formattedHour = formatHour(date.getHours());
                        console.log("Date: ".concat(formattedDate, ", Time: ").concat(formattedHour));
                        console.log("  Current Temp: ".concat((_17 = weatherData.hourly.temperature2m[i]) === null || _17 === void 0 ? void 0 : _17.toFixed(0), "\u00B0F"));
                        console.log("  Apparent Temp: ".concat((_18 = weatherData.hourly.apparentTemperature[i]) === null || _18 === void 0 ? void 0 : _18.toFixed(0), "\u00B0F"));
                        console.log("  Precipitation Probability: ".concat(weatherData.hourly.precipitationProbability[i], "%"));
                        console.log("  Precipitation: ".concat(weatherData.hourly.precipitation[i], " inches"));
                        console.log("  Rain: ".concat(weatherData.hourly.rain[i], " inches"));
                        console.log("  Showers: ".concat(weatherData.hourly.showers[i]));
                        console.log("  Snowfall: ".concat(weatherData.hourly.snowfall[i], " inches"));
                        console.log("  Wind Speed: ".concat((_19 = weatherData.hourly.windSpeed10m[i]) === null || _19 === void 0 ? void 0 : _19.toFixed(0), " mph"));
                        console.log("  Cloud Cover: ".concat(weatherData.hourly.cloudCover[i], "%"));
                        console.log('-----------------------------------');
                    }
                    for (i = 0; i < weatherData.daily.time.length; i++) {
                        date = weatherData.daily.time[i];
                        formattedDate = formatDate(date);
                        sunriseDate = weatherData.daily.sunrise[i] ? new Date(weatherData.daily.sunrise[i] * 1000) : null;
                        sunsetDate = weatherData.daily.sunset[i] ? new Date(weatherData.daily.sunset[i] * 1000) : null;
                        console.log("Date: ".concat(formattedDate));
                        if (sunriseDate)
                            console.log("  Sunrise: ".concat(sunriseDate.toISOString()));
                        if (sunsetDate)
                            console.log("  Sunset: ".concat(sunsetDate.toISOString()));
                        console.log((_20 = weatherData.daily.time[i]) === null || _20 === void 0 ? void 0 : _20.toISOString(), weatherData.daily.sunrise[i], weatherData.daily.sunset[i]);
                        console.log('-----------------------------------');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _21.sent();
                    console.error('fetching data or processing error:', err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
getDailyWeather();
