"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  CloudLightning,
  Wind,
  Droplets,
  MapPin,
  Loader2,
  CloudFog,
  CloudDrizzle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: Array<{
    day: string;
    temperature: number;
    minTemperature: number;
    maxTemperature: number;
    condition: string;
  }>;
}

const FooterWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLightning, setShowLightning] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const lightningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const weatherContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchWeatherData = async (latitude: number, longitude: number) => {
      try {
        // Get location name using reverse geocoding
        const geocodeResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
        );

        if (!geocodeResponse.ok) {
          throw new Error("Failed to fetch location data");
        }

        const geocodeData = await geocodeResponse.json();
        const cityName =
          geocodeData.address.city ||
          geocodeData.address.town ||
          geocodeData.address.village ||
          geocodeData.address.county ||
          "Unknown Location";
        const countryName = geocodeData.address.country || "";

        // Fetch weather data with forecast
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`
        );

        if (!weatherResponse.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const data = await weatherResponse.json();

        // Map weather codes to conditions
        const getConditionFromCode = (code: number): string => {
          if (code === 0) return "Clear";
          if (code === 1) return "Mainly Clear";
          if (code >= 2 && code <= 3) return "Partly Cloudy";
          if (code === 45 || code === 48) return "Foggy";
          if (code >= 51 && code <= 55) return "Drizzle";
          if (code >= 56 && code <= 57) return "Freezing Drizzle";
          if (code >= 61 && code <= 65) return "Rain";
          if (code >= 66 && code <= 67) return "Freezing Rain";
          if (code >= 71 && code <= 77) return "Snow";
          if (code >= 80 && code <= 82) return "Rain Showers";
          if (code >= 85 && code <= 86) return "Snow Showers";
          if (code >= 95 && code <= 99) return "Thunderstorm";
          return "Unknown";
        };

        // Format the data
        const formattedData: WeatherData = {
          location: `${cityName}, ${countryName}`,
          temperature: Math.round(data.current.temperature_2m),
          condition: getConditionFromCode(data.current.weather_code),
          humidity: data.current.relative_humidity_2m,
          windSpeed: Math.round(data.current.wind_speed_10m),
          forecast: data.daily.time
            .slice(1, 5)
            .map((time: string, index: number) => ({
              day: new Date(time).toLocaleDateString("en-US", {
                weekday: "short",
              }),
              temperature: Math.round(
                (data.daily.temperature_2m_max[index + 1] +
                  data.daily.temperature_2m_min[index + 1]) /
                  2
              ),
              minTemperature: Math.round(
                data.daily.temperature_2m_min[index + 1]
              ),
              maxTemperature: Math.round(
                data.daily.temperature_2m_max[index + 1]
              ),
              condition: getConditionFromCode(
                data.daily.weather_code[index + 1]
              ),
            })),
        };

        setWeatherData(formattedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching weather data:", err);
        setError("Failed to fetch weather data");
        setLoading(false);

        // Set mock data if API call fails
        setMockWeatherData();
      }
    };

    // Set mock data for development/preview
    const setMockWeatherData = () => {
      const mockData: WeatherData = {
        location: "New York, US",
        temperature: 22,
        condition: "Rain", // Set to Rain to show animation
        humidity: 65,
        windSpeed: 12,
        forecast: [
          {
            day: "Mon",
            temperature: 24,
            minTemperature: 20,
            maxTemperature: 28,
            condition: "Clear",
          },
          {
            day: "Tue",
            temperature: 22,
            minTemperature: 18,
            maxTemperature: 26,
            condition: "Partly Cloudy",
          },
          {
            day: "Wed",
            temperature: 19,
            minTemperature: 15,
            maxTemperature: 23,
            condition: "Rain",
          },
          {
            day: "Thu",
            temperature: 21,
            minTemperature: 17,
            maxTemperature: 25,
            condition: "Thunderstorm",
          },
        ],
      };
      setWeatherData(mockData);
      setLoading(false);
    };

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.error("Error getting location:", err);
          setMockWeatherData();
        }
      );
    } else {
      setMockWeatherData();
    }
  }, []);

  // Lightning effect for rain/thunderstorm conditions
  useEffect(() => {
    if (!weatherData) return;

    const condition = weatherData.condition.toLowerCase();
    const hasThunder = condition.includes("thunder");
    const hasRain =
      condition.includes("rain") ||
      hasThunder ||
      condition.includes("shower") ||
      condition.includes("drizzle");

    if (hasRain && hasThunder) {
      // Start lightning effect
      const triggerLightning = () => {
        setShowLightning(true);

        // Hide lightning after a short duration
        setTimeout(() => {
          setShowLightning(false);
        }, 200);

        // Schedule next lightning
        const nextLightningDelay = Math.random() * 3000 + 1000; // 1-4 seconds for thunderstorms
        lightningTimeoutRef.current = setTimeout(
          triggerLightning,
          nextLightningDelay
        );
      };

      // Initial lightning after a delay
      lightningTimeoutRef.current = setTimeout(triggerLightning, 1000);

      return () => {
        if (lightningTimeoutRef.current) {
          clearTimeout(lightningTimeoutRef.current);
        }
      };
    }
  }, [weatherData]);

  // Function to get weather icon component
  const getWeatherIcon = (condition: string, size: "sm" | "md" = "md") => {
    const conditionLower = condition.toLowerCase();
    const iconSize = size === "sm" ? 4 : 5;

    if (conditionLower.includes("clear")) {
      return <Sun className={`w-${iconSize} h-${iconSize} text-yellow-400`} />;
    } else if (
      conditionLower.includes("partly cloudy") ||
      conditionLower.includes("mainly clear")
    ) {
      return <Cloud className={`w-${iconSize} h-${iconSize} text-gray-400`} />;
    } else if (conditionLower.includes("cloudy")) {
      return <Cloud className={`w-${iconSize} h-${iconSize} text-gray-500`} />;
    } else if (
      conditionLower.includes("rain") ||
      conditionLower.includes("shower")
    ) {
      return (
        <CloudRain className={`w-${iconSize} h-${iconSize} text-blue-500`} />
      );
    } else if (conditionLower.includes("drizzle")) {
      return (
        <CloudDrizzle className={`w-${iconSize} h-${iconSize} text-blue-300`} />
      );
    } else if (conditionLower.includes("snow")) {
      return (
        <CloudSnow className={`w-${iconSize} h-${iconSize} text-blue-200`} />
      );
    } else if (conditionLower.includes("thunder")) {
      return (
        <CloudLightning
          className={`w-${iconSize} h-${iconSize} text-purple-500`}
        />
      );
    } else if (conditionLower.includes("fog")) {
      return (
        <CloudFog className={`w-${iconSize} h-${iconSize} text-gray-300`} />
      );
    } else {
      return <Cloud className={`w-${iconSize} h-${iconSize} text-gray-400`} />;
    }
  };

  // Function to check weather condition type
  const getWeatherType = (condition: string) => {
    const conditionLower = condition.toLowerCase();

    if (conditionLower.includes("clear") || conditionLower.includes("sun")) {
      return "sunny";
    } else if (
      conditionLower.includes("rain") ||
      conditionLower.includes("shower") ||
      conditionLower.includes("drizzle")
    ) {
      return "rainy";
    } else if (conditionLower.includes("thunder")) {
      return "thunder";
    } else if (conditionLower.includes("snow")) {
      return "snowy";
    } else if (conditionLower.includes("fog")) {
      return "foggy";
    } else if (conditionLower.includes("cloud")) {
      return "cloudy";
    }

    return "default";
  };

  // Function to get background based on weather
  const getWeatherBackground = (condition: string) => {
    const weatherType = getWeatherType(condition);

    switch (weatherType) {
      case "sunny":
        return "bg-gradient-to-r from-yellow-400/20 to-orange-300/20";
      case "rainy":
        return "bg-gradient-to-r from-blue-500/20 to-blue-400/20";
      case "thunder":
        return "bg-gradient-to-r from-purple-600/20 to-blue-500/20";
      case "snowy":
        return "bg-gradient-to-r from-blue-100/30 to-blue-200/30";
      case "foggy":
        return "bg-gradient-to-r from-gray-200/20 to-gray-400/20";
      case "cloudy":
        return "bg-gradient-to-r from-gray-300/20 to-gray-500/20";
      default:
        return "bg-gradient-to-r from-blue-100/20 to-blue-200/20";
    }
  };

  // Function to get temperature gradient
  const getTemperatureGradient = (temp: number) => {
    if (temp < 0) return "from-blue-500/20 to-blue-300/20";
    if (temp < 10) return "from-blue-400/20 to-cyan-300/20";
    if (temp < 20) return "from-cyan-500/20 to-green-400/20";
    if (temp < 30) return "from-green-400/20 to-yellow-300/20";
    return "from-yellow-400/20 to-red-500/20";
  };

  return (
    <div
      ref={weatherContainerRef}
      className="relative overflow-hidden rounded-lg"
    >
      {loading ? (
        <div className="flex items-center justify-center p-2 h-12">
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
        </div>
      ) : error ? (
        <div className="text-xs text-muted-foreground p-2">{error}</div>
      ) : weatherData ? (
        <div
          className={`relative ${getWeatherBackground(weatherData.condition)}`}
        >
          {/* Weather animations based on condition */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Rain animation */}
            {getWeatherType(weatherData.condition) === "rainy" && (
              <>
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-0.5 bg-blue-400/30 rounded-full animate-footer-rainfall"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      height: `${Math.random() * 10 + 5}px`,
                      animationDelay: `${Math.random() * 5}s`,
                      animationDuration: `${Math.random() * 1 + 0.5}s`,
                    }}
                  ></div>
                ))}
              </>
            )}

            {/* Snow animation */}
            {getWeatherType(weatherData.condition) === "snowy" && (
              <>
                {[...Array(15)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute bg-white rounded-full animate-footer-snowfall"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      width: `${Math.random() * 4 + 2}px`,
                      height: `${Math.random() * 4 + 2}px`,
                      animationDelay: `${Math.random() * 5}s`,
                      animationDuration: `${Math.random() * 3 + 2}s`,
                    }}
                  ></div>
                ))}
              </>
            )}

            {/* Cloud animation for cloudy weather */}
            {getWeatherType(weatherData.condition) === "cloudy" && (
              <>
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute bg-white/20 rounded-full animate-footer-cloud"
                    style={{
                      left: `${Math.random() * 80}%`,
                      top: `${Math.random() * 60 + 20}%`,
                      width: `${Math.random() * 30 + 20}px`,
                      height: `${Math.random() * 20 + 10}px`,
                      animationDelay: `${Math.random() * 10}s`,
                      animationDuration: `${Math.random() * 20 + 30}s`,
                    }}
                  ></div>
                ))}
              </>
            )}

            {/* Sun rays for sunny weather */}
            {getWeatherType(weatherData.condition) === "sunny" && (
              <div className="absolute top-0 right-0 w-12 h-12 bg-yellow-300/30 rounded-full blur-md animate-footer-sun"></div>
            )}

            {/* Fog for foggy weather */}
            {getWeatherType(weatherData.condition) === "foggy" && (
              <>
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute bg-gray-200/40 rounded-full blur-md animate-footer-fog"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      width: `${Math.random() * 40 + 20}px`,
                      height: `${Math.random() * 10 + 5}px`,
                      animationDelay: `${Math.random() * 5}s`,
                      animationDuration: `${Math.random() * 10 + 10}s`,
                    }}
                  ></div>
                ))}
              </>
            )}
          </div>

          {/* Lightning effect overlay */}
          {getWeatherType(weatherData.condition) === "thunder" && (
            <div
              className={`absolute inset-0 bg-white/80 z-20 pointer-events-none transition-opacity duration-100 ${
                showLightning ? "opacity-100" : "opacity-0"
              }`}
              style={{ mixBlendMode: "overlay" }}
            ></div>
          )}

          {/* Current weather */}
          <div className="px-4 py-3 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-background/40 p-1 rounded-full backdrop-blur-sm">
                  {getWeatherIcon(weatherData.condition)}
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium">
                      {weatherData.temperature}°C
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      • {weatherData.condition}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{weatherData.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Droplets className="w-3 h-3 mr-1" />
                  <span>{weatherData.humidity}%</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Wind className="w-3 h-3 mr-1" />
                  <span>{weatherData.windSpeed} km/h</span>
                </div>
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="ml-1 p-1 rounded-full hover:bg-background/50 transition-colors"
                >
                  {expanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Forecast (expandable) */}
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="px-4 pb-3 relative z-10"
            >
              <div className="pt-2 border-t border-border/30">
                <h4 className="text-xs font-medium mb-2">4-Day Forecast</h4>
                <div className="grid grid-cols-4 gap-2">
                  {weatherData.forecast.map((day, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-lg text-center ${getTemperatureGradient(
                        day.temperature
                      )} relative overflow-hidden`}
                    >
                      {/* Weather animations for forecast items */}
                      {getWeatherType(day.condition) === "rainy" && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                          {[...Array(10)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-0.5 bg-blue-400/30 rounded-full animate-footer-rainfall"
                              style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                height: `${Math.random() * 5 + 3}px`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${
                                  Math.random() * 1 + 0.5
                                }s`,
                              }}
                            ></div>
                          ))}
                        </div>
                      )}

                      {getWeatherType(day.condition) === "snowy" && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                          {[...Array(8)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute bg-white rounded-full animate-footer-snowfall"
                              style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                width: `${Math.random() * 3 + 1}px`,
                                height: `${Math.random() * 3 + 1}px`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${Math.random() * 3 + 2}s`,
                              }}
                            ></div>
                          ))}
                        </div>
                      )}

                      <p className="text-xs font-medium mb-1 relative z-10">
                        {day.day}
                      </p>
                      <div className="flex justify-center mb-1 relative z-10">
                        {getWeatherIcon(day.condition, "sm")}
                      </div>
                      <p className="text-xs relative z-10">
                        {day.temperature}°C
                      </p>
                      <div className="flex justify-center items-center gap-1 mt-1 text-[10px] text-muted-foreground relative z-10">
                        <span className="text-blue-500">
                          {day.minTemperature}°
                        </span>
                        <div className="w-4 h-0.5 bg-gradient-to-r from-blue-400 to-red-400 rounded-full"></div>
                        <span className="text-red-500">
                          {day.maxTemperature}°
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default FooterWeather;
