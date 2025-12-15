import { useState, useEffect } from 'react'
import weatherService from '../services/weather'

const CountryView = ({ country }) => {

  const [weather, setWeather] = useState(null)

  useEffect(() => {
    weatherService
      .getWeather(country.capital[0])
      .then(data => setWeather(data))
      .catch(err => console.error(err))
  }, [country.capital[0]])

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital {country.capital[0]}</p>
      <p>Area {country.area}</p>
      <h3>Languages</h3>
      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="200" />
      <h3>Weather in {country.capital[0]}</h3>

        {weather ? (
          <div>
            <p>Temperature: {weather.main.temp} °C</p>
            <img 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
              alt={weather.weather[0].description} 
            />
          </div>
        )  : (
          <p>Loading weather data...</p>
        )}
    </div>
  )
}

export default CountryView