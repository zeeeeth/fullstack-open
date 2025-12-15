const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?q='

const getWeather = async(capital) =>{
    const url =  `${baseURL}${encodeURIComponent(capital)}&appid=${API_KEY}&units=metric`
    const res = await fetch(url)
    if (!res.ok) throw new Error("Weather fetch failed")
    return await res.json()
}

export default { getWeather }
