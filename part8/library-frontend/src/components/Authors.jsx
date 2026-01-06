import { useQuery } from '@apollo/client/react'
import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { ALL_AUTHORS, SET_BIRTHYEAR } from '../queries'

const Authors = ({ show, setError, token }) => {
  const authors = useQuery(ALL_AUTHORS, { skip: !show })
  const [year, setYear] = useState('')
  const [selectedName, setSelectedName] = useState('')

  const [setBirthyear] = useMutation(SET_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      setError({ message: error.message, type: 'error' })
    },
  })

  const submit = async (event) => {
    event.preventDefault()

    setBirthyear({
      variables: { name: selectedName, born: Number(year) },
      onCompleted: () => {
        setError({
          message: `${selectedName}'s birthyear updated successfully`,
          type: 'success',
        })
      },
    })

    setSelectedName('')
    setYear('')
  }

  if (!show) return null
  if (authors.loading) return <div>loading...</div>
  if (authors.error) return <div>Error: {authors.error.message}</div>
  if (!authors.data) return null

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.data.allAuthors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {token && (
        <div>
          <h2>Set birthyear</h2>
          <form onSubmit={submit}>
            <div>
              name
              <select
                value={selectedName}
                onChange={({ target }) => setSelectedName(target.value)}
              >
                <option value="" disabled>
                  -- select an author --
                </option>
                {authors.data.allAuthors.map((a) => (
                  <option key={a.id} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              born
              <input
                type="number"
                value={year}
                onChange={({ target }) => setYear(target.value)}
              />
            </div>
            <button type="submit">update author</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Authors
