import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import {
  ALL_AUTHORS,
  ALL_BOOKS,
  ALL_BOOKS_BY_GENRE,
  CREATE_BOOK,
} from '../queries'
import { addBookToCache } from '../utils/apolloCache'

const NewBook = (props) => {
  if (!props.show) {
    return null
  }

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [createBook] = useMutation(CREATE_BOOK, {
    update: (cache, { data }) => {
      const addedBook = data?.addBook
      if (!addedBook) return
      addBookToCache(cache, addedBook)
    },
    onError: (error) => {
      const message =
        error?.graphQLErrors?.[0]?.message ||
        error?.networkError?.message ||
        error?.message ||
        'Unknown error'
      props.setError({ message, type: 'error' })
    },
  })

  const submit = async (event) => {
    event.preventDefault()

    createBook({
      variables: { title, author, published: Number(published), genres },
      onCompleted: () => {
        props.setError({
          message: `Book ${title} added successfully`,
          type: 'success',
        })
      },
    })
    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button type="button" onClick={addGenre}>
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
