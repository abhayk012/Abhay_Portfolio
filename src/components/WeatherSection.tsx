"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  MapPin,
  Loader2,
  CloudFog,
  CloudDrizzle,
} from "lucide-react"
import SectionHeading from "./SectionHeading"

interface WeatherData {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  forecast: Array<{
    day: string
    temperature: number
    minTemperature: number
    maxTemperature: number
    condition: string
  }>
}

const WeatherSection = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // const [locationName, setLocationName] = useState<string>("")
  const [showLightning, setShowLightning] = useState(false)
  const lightningTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const weatherContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchWeatherData = async (latitude: number, longitude: number) => {
      try {
        // First, get the location name using reverse geocoding from a free service
        const geocodeResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
        )

        if (!geocodeResponse.ok) {
          throw new Error("Failed to fetch location data")
        }

        const geocodeData = await geocodeResponse.json()
        const cityName =
          geocodeData.address.city ||
          geocodeData.address.town ||
          geocodeData.address.village ||
          geocodeData.address.county ||
          "Unknown Location"
        const countryName = geocodeData.address.country || ""
        // setLocationName(`${cityName}, ${countryName}`)

        // Then fetch the weather data from Open-Meteo (free, no API key required)
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`,
        )

        if (!weatherResponse.ok) {
          throw new Error("Failed to fetch weather data")
        }

        const data = await weatherResponse.json()

        // Map Open-Meteo weather codes to conditions
        const getConditionFromCode = (code: number): string => {
          // WMO Weather interpretation codes (WW)
          if (code === 0) return "Clear"
          if (code === 1) return "Mainly Clear"
          if (code >= 2 && code <= 3) return "Partly Cloudy"
          if (code === 45 || code === 48) return "Foggy"
          if (code >= 51 && code <= 55) return "Drizzle"
          if (code >= 56 && code <= 57) return "Freezing Drizzle"
          if (code >= 61 && code <= 65) return "Rain"
          if (code >= 66 && code <= 67) return "Freezing Rain"
          if (code >= 71 && code <= 77) return "Snow"
          if (code >= 80 && code <= 82) return "Rain Showers"
          if (code >= 85 && code <= 86) return "Snow Showers"
          if (code >= 95 && code <= 99) return "Thunderstorm"
          return "Unknown"
        }

        // Format the data
        const formattedData: WeatherData = {
          location: `${cityName}, ${countryName}`,
          temperature: Math.round(data.current.temperature_2m),
          condition: getConditionFromCode(data.current.weather_code),
          humidity: data.current.relative_humidity_2m,
          windSpeed: Math.round(data.current.wind_speed_10m),
          forecast: data.daily.time.slice(1, 5).map((time: string, index: number) => ({
            day: new Date(time).toLocaleDateString("en-US", { weekday: "short" }),
            temperature: Math.round(
              (data.daily.temperature_2m_max[index + 1] + data.daily.temperature_2m_min[index + 1]) / 2,
            ),
            minTemperature: Math.round(data.daily.temperature_2m_min[index + 1]),
            maxTemperature: Math.round(data.daily.temperature_2m_max[index + 1]),
            condition: getConditionFromCode(data.daily.weather_code[index + 1]),
          })),
        }

        setWeatherData(formattedData)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching weather data:", err)
        setError("Failed to fetch weather data. Please try again later.")
        setLoading(false)

        // For demo purposes, set mock data if API call fails
        setMockWeatherData()
      }
    }

    // Set mock data for development/preview
    const setMockWeatherData = () => {
      const mockData: WeatherData = {
        location: "New York, US",
        temperature: 22,
        condition: "Rain", // Set to Rain to show lightning effect
        humidity: 65,
        windSpeed: 12,
        forecast: [
          { day: "Mon", temperature: 24, minTemperature: 20, maxTemperature: 28, condition: "Clear" },
          { day: "Tue", temperature: 22, minTemperature: 18, maxTemperature: 26, condition: "Partly Cloudy" },
          { day: "Wed", temperature: 19, minTemperature: 15, maxTemperature: 23, condition: "Rain" },
          { day: "Thu", temperature: 21, minTemperature: 17, maxTemperature: 25, condition: "Thunderstorm" },
        ],
      }
      setWeatherData(mockData)
      // setLocationName(mockData.location)
      setLoading(false)
    }

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(position.coords.latitude, position.coords.longitude)
        },
        (err) => {
          console.error("Error getting location:", err)
          setError("Unable to get your location. Using default location.")
          setMockWeatherData()
        },
      )
    } else {
      setError("Geolocation is not supported by your browser. Using default location.")
      setMockWeatherData()
    }
  }, [])

  // Lightning effect for rain/thunderstorm conditions
  useEffect(() => {
    if (!weatherData) return

    const condition = weatherData.condition.toLowerCase()
    const hasRainOrThunder =
      condition.includes("rain") ||
      condition.includes("thunder") ||
      condition.includes("shower") ||
      condition.includes("drizzle")

    if (hasRainOrThunder) {
      // Start lightning effect
      const triggerLightning = () => {
        setShowLightning(true)

        // Hide lightning after a short duration
        setTimeout(() => {
          setShowLightning(false)
        }, 200)

        // Schedule next lightning
        const nextLightningDelay = Math.random() * (condition.includes("thunder") ? 5000 : 8000) + 2000
        lightningTimeoutRef.current = setTimeout(triggerLightning, nextLightningDelay)
      }

      // Initial lightning after a delay
      lightningTimeoutRef.current = setTimeout(triggerLightning, 2000)

      return () => {
        if (lightningTimeoutRef.current) {
          clearTimeout(lightningTimeoutRef.current)
        }
      }
    }
  }, [weatherData])

  // Function to get weather icon component
  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase()

    if (conditionLower.includes("clear")) {
      return <Sun className="w-10 h-10 text-yellow-400" />
    } else if (conditionLower.includes("partly cloudy") || conditionLower.includes("mainly clear")) {
      return <Cloud className="w-10 h-10 text-gray-400" />
    } else if (conditionLower.includes("cloudy")) {
      return <Cloud className="w-10 h-10 text-gray-500" />
    } else if (conditionLower.includes("rain") || conditionLower.includes("shower")) {
      return <CloudRain className="w-10 h-10 text-blue-400" />
    } else if (conditionLower.includes("drizzle")) {
      return <CloudDrizzle className="w-10 h-10 text-blue-300" />
    } else if (conditionLower.includes("snow")) {
      return <CloudSnow className="w-10 h-10 text-blue-200" />
    } else if (conditionLower.includes("thunder")) {
      return <CloudLightning className="w-10 h-10 text-purple-500" />
    } else if (conditionLower.includes("fog")) {
      return <CloudFog className="w-10 h-10 text-gray-300" />
    } else {
      return <Cloud className="w-10 h-10 text-gray-400" />
    }
  }

  // Function to get gradient based on temperature
  const getTemperatureGradient = (temp: number) => {
    if (temp < 0) return "from-blue-500 to-blue-300"
    if (temp < 10) return "from-blue-400 to-cyan-300"
    if (temp < 20) return "from-cyan-500 to-green-400"
    if (temp < 30) return "from-green-400 to-yellow-300"
    return "from-yellow-400 to-red-500"
  }

  // Function to check if weather has rain or thunder
  const hasRainOrThunder = (condition: string) => {
    const conditionLower = condition.toLowerCase()
    return (
      conditionLower.includes("rain") ||
      conditionLower.includes("thunder") ||
      conditionLower.includes("shower") ||
      conditionLower.includes("drizzle")
    )
  }

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-background to-muted/30">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(var(--primary)/0.1),transparent_70%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(var(--primary)/0.1),transparent_70%)]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          title="Local Weather"
          subtitle="Current weather and forecast for your location"
          align="center"
        />

        <div className="mt-12 max-w-4xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 bg-card rounded-xl shadow-lg">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-lg text-muted-foreground">Loading weather data...</p>
            </div>
          ) : error ? (
            <div className="p-8 bg-card rounded-xl shadow-lg text-center">
              <p className="text-red-500 mb-4">{error}</p>
              {weatherData && (
                <p className="text-muted-foreground">Showing weather for {weatherData.location} instead.</p>
              )}
            </div>
          ) : weatherData ? (
            <motion.div
              ref={weatherContainerRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden rounded-xl shadow-lg relative"
            >
              {/* Lightning effect overlay */}
              {weatherData && hasRainOrThunder(weatherData.condition) && (
                <div
                  className={`absolute inset-0 bg-white/80 z-20 pointer-events-none transition-opacity duration-100 ${
                    showLightning ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ mixBlendMode: "overlay" }}
                ></div>
              )}

              {/* Rainfall effect for rain conditions */}
              {weatherData && hasRainOrThunder(weatherData.condition) && (
                <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                  {[...Array(40)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-0.5 bg-blue-400/30 rounded-full animate-rainfall"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        height: `${Math.random() * 20 + 10}px`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${Math.random() * 1 + 0.5}s`,
                      }}
                    ></div>
                  ))}
                </div>
              )}

              {/* Current weather */}
              <div className={`p-8 bg-gradient-to-r ${getTemperatureGradient(weatherData.temperature)} relative`}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                      {getWeatherIcon(weatherData.condition)}
                    </div>
                    <div>
                      <h3 className="text-white text-3xl font-bold">{weatherData.temperature}°C</h3>
                      <p className="text-white/90 text-lg">{weatherData.condition}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center md:items-end">
                    <div className="flex items-center gap-2 text-white/90 mb-2">
                      <MapPin className="w-5 h-5" />
                      <span className="text-lg font-medium">{weatherData.location}</span>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1 text-white/90">
                        <Droplets className="w-4 h-4" />
                        <span>{weatherData.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-1 text-white/90">
                        <Wind className="w-4 h-4" />
                        <span>{weatherData.windSpeed} km/h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Forecast */}
              <div className="bg-card p-6 relative">
                {/* Lightning effect for forecast items with rain/thunder */}
                {weatherData.forecast.some((day) => hasRainOrThunder(day.condition)) && (
                  <div
                    className={`absolute inset-0 bg-white/80 z-20 pointer-events-none transition-opacity duration-100 ${
                      showLightning ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ mixBlendMode: "overlay" }}
                  ></div>
                )}

                <h4 className="text-lg font-medium mb-4 relative z-10">4-Day Forecast</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                  {weatherData.forecast.map((day, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`bg-background/50 p-4 rounded-lg text-center hover:bg-background transition-colors duration-300 relative ${
                        hasRainOrThunder(day.condition) ? "overflow-hidden" : ""
                      }`}
                    >
                      {/* Rainfall effect for forecast items with rain */}
                      {hasRainOrThunder(day.condition) && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                          {[...Array(15)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-0.5 bg-blue-400/30 rounded-full animate-rainfall"
                              style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                height: `${Math.random() * 10 + 5}px`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${Math.random() * 1 + 0.5}s`,
                              }}
                            ></div>
                          ))}
                        </div>
                      )}

                      <p className="font-medium mb-2 relative z-10">{day.day}</p>
                      <div className="flex justify-center mb-2 relative z-10">{getWeatherIcon(day.condition)}</div>
                      <div className="flex items-center justify-center gap-1 relative z-10">
                        <Thermometer className="w-4 h-4 text-primary" />
                        <span className="font-medium">{day.temperature}°C</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 relative z-10">{day.condition}</p>
                      <div className="flex justify-center items-center gap-2 mt-2 text-xs text-muted-foreground relative z-10">
                        <span className="text-blue-500">{day.minTemperature}°</span>
                        <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-red-400 rounded-full"></div>
                        <span className="text-red-500">{day.maxTemperature}°</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default WeatherSection

