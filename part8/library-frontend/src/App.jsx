import { useState } from 'react'
import {
  useApolloClient,
  useQuery,
  useSubscription,
} from '@apollo/client/react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import { BOOK_ADDED } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [error, setError] = useState(null)
  const [token, setToken] = useState(null)
  const [favGenre, setFavGenre] = useState(null)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      window.alert(
        `New book added: ${data.data.bookAdded.title} by ${data.data.bookAdded.author.name}`
      )
    },
  })

  const notify = ({ message, type }) => {
    setError({ message, type })
    setTimeout(() => {
      setError(null)
    }, 5000)
  }

  const onLogout = () => {
    setError({ message: 'Logged out successfully', type: 'success' })
    setToken(null)
    setFavGenre(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <Notification message={error?.message} type={error?.type} />

      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && <button onClick={onLogout}>logout</button>}
        {token && (
          <button onClick={() => setPage('recommended')}>recommended</button>
        )}
        {!token && <button onClick={() => setPage('login')}>login</button>}
      </div>

      {!token && page === 'login' && (
        <LoginForm
          setError={notify}
          setToken={setToken}
          setPage={setPage}
          setFavGenre={setFavGenre}
        />
      )}

      <Authors show={page === 'authors'} setError={notify} token={token} />
      <Books show={page === 'books'} />

      {token ? (
        <NewBook show={page === 'add'} setError={notify} favGenre={favGenre} />
      ) : null}
      {token ? (
        <Recommend show={page === 'recommended'} favGenre={favGenre} />
      ) : null}
    </div>
  )
}

export default App
