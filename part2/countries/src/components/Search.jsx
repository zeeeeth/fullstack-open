const Search = ({ query, handleQueryChange }) => {
  return (
    <div>
      find countries <input value={query} onChange={handleQueryChange} />
    </div>
  )
}

export default Search