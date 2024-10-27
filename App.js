import React, { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = "56e18775de9d606a0170e417289dff94";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  const getWeatherData = async (city) => {
    try {
      const currentWeatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      setWeather(currentWeatherResponse.data);
      setForecast(
        forecastResponse.data.list
          .filter((item) => item.dt_txt.includes("12:00:00"))
          .slice(0, 4)
      );
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeather(null);
      setForecast([]);
    }
  };

  const handleSearch = () => {
    if (city) {
      getWeatherData(city);
    }
  };

  useEffect(() => {
    getWeatherData("Lahore");
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      getWeatherData(city);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-[url('/public/clouds.jpg')] text-gray-800 p-4">
    <div className="bg-white bg-opacity-20 p-6 rounded-2xl shadow-lg flex flex-col items-center max-w-md w-full">
      <div className="flex w-full mb-3">
        <input
          type="text"
          placeholder="Enter a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-3 rounded-l-full w-full border border-gray-500 text-center text-lg"
          onKeyDown={handleKeyDown} 
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white py-1 px-4 rounded-r-full text-sm font-medium hover:bg-blue-600 w-32" 
        >
          Search
        </button>
      </div>
    </div>
  
    {weather && (
      <div className="bg-white bg-opacity-30 p-6 mt-6 rounded-3xl shadow-lg max-w-2xl w-full text-center mx-auto h-120"> 
        <p className="text-xl font-semibold mb-2">Today</p>
        <h2 className="text-3xl font-bold mb-2">
          🌤️ {weather.name} {/* Weather emoji next to city name */}
        </h2>
        <p className="text-lg">Temperature: {Math.round(weather.main.temp)}°C</p>
        <p className="text-gray-600 capitalize mb-4">{weather.weather[0].description}</p>
        <div className="flex justify-between gap-5 mt-16">
          {forecast.map((day, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-70 p-3 rounded-xl flex flex-col items-center w-1/4"
            >
              <p className="text-sm font-semibold">
                {new Date(day.dt_txt).toLocaleDateString("en-US", {
                  weekday: "long",
                })}
              </p>
              <img
                src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt={day.weather[0].description}
                className="w-10 h-10 mt-2"
              />
              <p className="text-lg font-semibold">{Math.round(day.main.temp)}°C</p>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
  )  
}

export default App;
