import { useState, useEffect } from "react"
import countriesService from "./services/countries"
import Search from "./components/Search"
import CountryList from "./components/CountryList"

const App = () => {

  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')
  
  useEffect(() => {
    countriesService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  const handleShow = (countryName) => {
    setQuery(countryName)
  }

  return (
    <div>
      <Search query={query} handleQueryChange={(event) => setQuery(event.target.value)} />
      <CountryList query={query} countries={countries} onShow={handleShow} />
    </div>
  )
}

export default App