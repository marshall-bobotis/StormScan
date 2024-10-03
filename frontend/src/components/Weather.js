import React, { useState, useEffect } from 'react';
import '../css/Weather.css';
import { FaSearch, FaStar } from 'react-icons/fa';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState('metric');
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      const fetchFavorites = async () => {
        try {
          const response = await fetch(`/api/favorites/${user.userId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch favorites');
          }
          const data = await response.json();
          setFavorites(data.data.favorites);
          localStorage.setItem('favorites', JSON.stringify(data.data.favorites));
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      };
      fetchFavorites();
    }
  }, [user]);

  const fetchWeather = async (cityName) => {
    if (!cityName) {
      setError('Please enter a city name.');
      setWeather(null);
      return;
    }

    setLoading(true);

    try {
      const currentWeatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityName
        )}&appid=${apiKey}&units=${units}`
      );

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          cityName
        )}&appid=${apiKey}&units=${units}`
      );

      if (!currentWeatherResponse.ok || !forecastResponse.ok) {
        if (currentWeatherResponse.status === 404 || forecastResponse.status === 404) {
          throw new Error('City not found');
        } else {
          throw new Error('Failed to fetch weather data');
        }
      }

      const currentWeatherData = await currentWeatherResponse.json();
      const forecastData = await forecastResponse.json();

      setWeather({
        current: currentWeatherData,
        forecast: forecastData.list.slice(0, 5) // next 5 forecasts
      });
      setError('');
    } catch (err) {
      setError(err.message);
      setWeather(null);
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather('Montreal');
  }, [units]);

  const handleSearch = async (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  const hasStorm = () => {
    if (!weather || !weather.current.weather) return false;
    return weather.current.weather.some((condition) =>
      condition.main.toLowerCase().includes('thunderstorm')
    );
  };

  const handleFavorite = async () => {
    if (user && weather) {
      try {
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.userId, cityName: weather.current.name }),
        });

        if (!response.ok) {
          throw new Error('Failed to add favorite');
        }

        const newFavorites = [...favorites, weather.current.name];
        setFavorites(newFavorites);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
      } catch (error) {
        console.error('Error adding favorite:', error);
      }
    }
  };

  return (
    <div className='weather-container'>
      <div className='weather-header'>
        <h1 className='weather-title'>StormScan</h1>
        <form className='weather-form' onSubmit={handleSearch}>
          <input
            type='text'
            placeholder='Enter city name'
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className='weather-input'
          />
          <button type='submit' className='weather-button'>
            <FaSearch />
          </button>
          <button
            type='button'
            className='unit-toggle'
            onClick={() => setUnits(units === 'metric' ? 'imperial' : 'metric')}
          >
            {units === 'metric' ? '°F' : '°C'}
          </button>
        </form>
      </div>

      <div className='favorites-bar'>
        {user ? (
          favorites.map((fav, index) => (
            <button key={index} onClick={() => fetchWeather(fav)} className='favorite-item'>
              {fav}
            </button>
          ))
        ) : (
          <p>Log in to favorite locations</p>
        )}
      </div>

      {loading && <p className='weather-loading'>Loading...</p>}
      {error && <p className='weather-error'>{error}</p>}
      {weather && (
        <div className='weather-info'>
          <div className='weather-main'>
            <h2>
              {weather.current.name}, {weather.current.sys.country}
              {user && (
                <button onClick={handleFavorite} className='favorite-button'>
                  <FaStar color={isFavorite ? 'gold' : 'gray'} />
                </button>
              )}
            </h2>
            <img
              src={`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`}
              alt={weather.current.weather[0].description}
              className='weather-icon'
            />
            <p className='weather-description'>{weather.current.weather[0].description}</p>
            <p className='weather-temp'>
              {Math.round(weather.current.main.temp)}°{units === 'metric' ? 'C' : 'F'}
            </p>
          </div>
          <div className='weather-details'>
            <p>Humidity: {weather.current.main.humidity}%</p>
            <p>Wind: {Math.round(weather.current.wind.speed)} m/s</p>
            <p className={hasStorm() ? 'storm-yes' : 'storm-no'}>
              Storm: {hasStorm() ? 'Yes' : 'No'}
            </p>
          </div>
          <div className='weather-forecast'>
            <h3>Today's Forecast</h3>
            <div className='forecast-items'>
              {weather.forecast.map((item, index) => (
                <div key={index} className='forecast-item'>
                  <p>{new Date(item.dt * 1000).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                    alt={item.weather[0].description}
                  />
                  <p>{Math.round(item.main.temp)}°{units === 'metric' ? 'C' : 'F'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;