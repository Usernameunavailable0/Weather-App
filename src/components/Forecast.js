import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";
import ParticleBackground from 'react-particle-backgrounds'

function Forecast({ weather }) {
  const { data } = weather;
  const [forecastData, setForecastData] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true); // Track temperature unit

  useEffect(() => {
    const fetchForecastData = async () => {
      const apiKey = 'b03a640e5ef6980o4da35b';
      const url = `https://api.shecodes.io/weather/v1/forecast?query=${data.city}&key=${apiKey}&units=metric`;

      try {
        const response = await axios.get(url);
        setForecastData(response.data.daily);
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      }
    };

    fetchForecastData();
  }, [data.city]);

  const formatDay = (dateString) => {
    const options = { weekday: "short" };
    const date = new Date(dateString * 1000);
    return date.toLocaleDateString("en-US", options);
  };

  const getCurrentDate = () => {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const currentDate = new Date().toLocaleDateString("en-US", options);
    return currentDate;
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius((prevState) => !prevState);
  };

  const convertToFahrenheit = (temperature) => {
    return Math.round((temperature * 9) / 5 + 32);
  };

  const renderTemperature = (temperature) => {
    return isCelsius
      ? Math.round(temperature)
      : convertToFahrenheit(temperature);
  };
  const settings = {
    canvas: {
      canvasFillSpace: true,
      width: 200,
      height: 300,
      useBouncyWalls: true
    },
    particle: {
      particleCount: 30,
      color: '#0084ff',
      minSize: 2,
      maxSize: 15
    },
    velocity: {
      directionAngle: 0,
      directionAngleVariance: 360,
      minSpeed: 1,
      maxSpeed: 3
    },
    opacity: {
      minOpacity: 0,
      maxOpacity: 0.5,
      opacityTransitionTime: 9000
    }
  }

  return (
    <div>
      <div className="city-name">
        <h2>
          {data.city}, <span>{data.country}</span>
        </h2>
      </div>
      <div className="date">
        <span>{getCurrentDate()}</span>
      </div>
      <div className="temp">
        {data.condition.icon_url && (
          <img
            src={data.condition.icon_url}
            alt={data.condition.description}
            className="temp-icon"
          />
        )}
        {renderTemperature(data.temperature.current)}
        <sup className="temp-deg" onClick={toggleTemperatureUnit}>
          {isCelsius ? "°C" : "°F"} | {isCelsius ? "°F" : "°C"}
        </sup>
      </div>
      <p className="weather-des">{data.condition.description}</p>
      <div className="weather-info">
        <div className="col">
          <ReactAnimatedWeather icon="WIND" size="40" />
          <div>
            <p className="wind">{data.wind.speed} m/s</p>
            <p>Wind speed</p>
          </div>
        </div>
        <div className="col">
          <ReactAnimatedWeather icon="RAIN" size="40" />
          <div>
            <p className="humidity">{data.temperature.humidity}%</p>
            <p>Humidity</p>
          </div>
        </div>
      </div>
      <div className="forecast">
        <h3>5-Day Forecast:</h3>
        <div className="forecast-container">
          {forecastData &&
            forecastData.slice(0, 5).map((day) => (
              <div className="day" key={day.time}>
                <p className="day-name">{formatDay(day.time)}</p>
                {day.condition.icon_url && (
                  <img
                    className="day-icon"
                    src={day.condition.icon_url}
                    alt={day.condition.description}
                  />
                )}
                <p className="day-temperature">
                  {Math.round(day.temperature.minimum)}° /{" "}
                  <span>{Math.round(day.temperature.maximum)}°</span>
                </p>
              </div>
            ))}
        </div>
      </div>
      <ParticleBackground settings={settings} />
    </div>
  );
}

export default Forecast;
