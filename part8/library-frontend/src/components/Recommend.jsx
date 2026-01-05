import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS_BY_GENRE } from '../queries'

const Recommend = ({ show, favGenre }) => {
  if (!show) return null

  const { data } = useQuery(ALL_BOOKS_BY_GENRE, {
    variables: { genre: favGenre },
  })

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre {favGenre}</p>

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {data?.allBooks.map((b) => {
            return (
              <tr key={b.id}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend
