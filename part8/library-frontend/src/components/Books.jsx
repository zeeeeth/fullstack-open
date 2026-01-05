import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, ALL_BOOKS_BY_GENRE } from '../queries'
import { useState } from 'react'

const Books = (props) => {
  if (!props.show) {
    return null
  }

  const [genreFilter, setGenreFilter] = useState(null)
  const allBooksResult = useQuery(ALL_BOOKS)
  const filteredResult = useQuery(ALL_BOOKS_BY_GENRE, {
    variables: { genre: genreFilter },
    skip: !genreFilter,
  })

  const allBooks = allBooksResult.data?.allBooks || []
  const genres = [...new Set(allBooks.flatMap((b) => b.genres))]
  const booksToShow = genreFilter
    ? filteredResult.data?.allBooks || []
    : allBooks

  if (allBooksResult.loading || (genreFilter && filteredResult.loading)) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {genres.map((g) => (
          <button key={g} onClick={() => setGenreFilter(g)}>
            {g}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Books
