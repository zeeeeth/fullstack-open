import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import {
  ALL_AUTHORS,
  ALL_BOOKS,
  ALL_BOOKS_BY_GENRE,
  CREATE_BOOK,
} from '../queries'

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

      // 1. Update ALL_BOOKS cache
      cache.updateQuery({ query: ALL_BOOKS }, (old) => {
        if (!old) return old
        return { allBooks: old.allBooks.concat(addedBook) }
      })

      // 2. Update ALL_BOOKS_BY_GENRE caches for each genre of the added book
      addedBook.genres.forEach((g) => {
        cache.updateQuery(
          { query: ALL_BOOKS_BY_GENRE, variables: { genre: g } },
          (old) => {
            if (!old) return old
            return { allBooks: old.allBooks.concat(addedBook) }
          }
        )
      })

      // 3. Update ALL_AUTHORS cache
      cache.updateQuery({ query: ALL_AUTHORS }, (old) => {
        if (!old) return old
        const name = addedBook.author.name
        const exists = old.allAuthors.some((a) => a.name === name)

        if (exists) {
          return {
            allAuthors: old.allAuthors.map((a) =>
              a.name === name ? { ...a, bookCount: a.bookCount + 1 } : a
            ),
          }
        }

        return {
          allAuthors: old.allAuthors.concat({
            name: addedBook.author.name,
            born: null,
            bookCount: 1,
            id: addedBook.author.id,
          }),
        }
      })
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
