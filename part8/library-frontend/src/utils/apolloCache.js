import { ALL_BOOKS, ALL_BOOKS_BY_GENRE, ALL_AUTHORS } from '../queries'

export const addBookToCache = (cache, bookToAdd) => {
  const existing = cache.readQuery({ query: ALL_BOOKS })
  const alreadyThere = existing?.allBooks?.some((b) => b.id === bookToAdd.id)
  if (alreadyThere) return
  // 1. Update ALL_BOOKS cache
  cache.updateQuery({ query: ALL_BOOKS }, (old) => {
    if (!old) return old
    return { allBooks: old.allBooks.concat(bookToAdd) }
  })

  // 2. Update ALL_BOOKS_BY_GENRE caches for each genre of the added book
  bookToAdd.genres.forEach((g) => {
    cache.updateQuery(
      { query: ALL_BOOKS_BY_GENRE, variables: { genre: g } },
      (old) => {
        if (!old) return old
        return { allBooks: old.allBooks.concat(bookToAdd) }
      }
    )
  })

  // 3. Update ALL_AUTHORS cache
  cache.updateQuery({ query: ALL_AUTHORS }, (old) => {
    if (!old) return old
    const name = bookToAdd.author.name
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
        name: bookToAdd.author.name,
        born: null,
        bookCount: 1,
        id: bookToAdd.author.id,
      }),
    }
  })
}
