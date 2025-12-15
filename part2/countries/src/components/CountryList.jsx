import CountryView from "./CountryView"

const CountryList = ({ query, countries, onShow }) => {
  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(query.toLowerCase().trim())
  )

  if (filteredCountries.length === 1) {
    const c = filteredCountries[0]
    return (
      <CountryView country={c} />
    )
  } else {
    const shownCountries = filteredCountries.slice(0, 10)
    return (
      <ul>
        {shownCountries.map(country => (
          <li key={country.name.common}>
            {country.name.common}{" "}
            <button type="button" onClick={() => onShow(country.name.common)}>
              Show
            </button>
          </li>
        ))}
      </ul>
    )
  }
}

export default CountryList