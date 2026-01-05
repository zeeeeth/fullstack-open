const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')

let authors = [
  {
    name: 'Robert Martin',
    id: 'afa51ab0-344d-11e9-a414-719c6709cf3e',
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: 'afa5b6f0-344d-11e9-a414-719c6709cf3e',
    born: 1963,
  },
  {
    name: 'Fyodor Dostoevsky',
    id: 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
    born: 1821,
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
    id: 'afa5b6f2-344d-11e9-a414-719c6709cf3e',
  },
  {
    name: 'Sandi Metz', // birthyear not known
    id: 'afa5b6f3-344d-11e9-a414-719c6709cf3e',
  },
]

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: 'afa5b6f4-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: 'afa5b6f5-344d-11e9-a414-719c6709cf3e',
    genres: ['agile', 'patterns', 'design'],
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: 'afa5de00-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: 'afa5de01-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'patterns'],
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: 'afa5de02-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'design'],
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de03-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'crime'],
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de04-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'revolution'],
  },
]

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      if (!args.author && !args.genre) return books
      if (!args.genre) return books.filter((b) => b.author === args.author)
      if (!args.author)
        return books.filter((b) => b.genres.includes(args.genre))
      return books.filter(
        (b) => b.author === args.author && b.genres.includes(args.genre)
      )
    },
    allAuthors: () =>
      authors.map((author) => {
        const bookCount = books.filter((b) => b.author === author.name).length
        return {
          ...author,
          bookCount,
        }
      }),
  },
  Mutation: {
    addBook: (root, args) => {
      {
        /* Validate arguments: non-empty title, author, published year, and genres */
      }
      const title = (args.title ?? '').trim()
      const author = (args.author ?? '').trim()
      const published = args.published
      const genres = Array.isArray(args.genres)
        ? args.genres.map((g) => String(g).trim()).filter(Boolean)
        : []

      if (!title) {
        throw new GraphQLError('Your book has no title?', {
          code: 'BAD_USER_INPUT',
          extensions: { invalidArgs: args.title },
        })
      }
      if (!author) {
        throw new GraphQLError(
          'Did a ghost write this book? Think seriously.',
          {
            code: 'BAD_USER_INPUT',
            extensions: { invalidArgs: args.author },
          }
        )
      }
      if (!Number.isInteger(published) || published <= 0) {
        throw new GraphQLError(
          'Either a caveman published this book or you made a typo.',
          {
            code: 'BAD_USER_INPUT',
            extensions: { invalidArgs: args.published },
          }
        )
      }
      if (genres.length === 0) {
        throw new GraphQLError(
          "You're so special that no genre can describe this?",
          {
            code: 'BAD_USER_INPUT',
            extensions: { invalidArgs: args.genres },
          }
        )
      }

      const newBook = { ...args, id: uuid() }
      books = books.concat(newBook)
      if (!authors.find((a) => a.name === args.author)) {
        const newAuthor = { name: args.author, id: uuid() }
        authors = authors.concat(newAuthor)
      }
      return newBook
    },
    editAuthor: (root, args) => {
      const author = authors.find((a) => a.name === args.name)
      if (!author) {
        throw new GraphQLError('Author not found', {
          code: 'BAD_USER_INPUT',
          extensions: { invalidArgs: args.name },
        })
      }
      if (!Number.isInteger(args.setBornTo) || args.setBornTo <= 0) {
        throw new GraphQLError('Year must be a positive integer', {
          code: 'BAD_USER_INPUT',
          extensions: { invalidArgs: args.setBornTo },
        })
      }
      const updatedAuthor = { ...author, born: args.setBornTo }
      authors = authors.map((a) =>
        a.name === updatedAuthor.name ? updatedAuthor : a
      )
      return updatedAuthor
    },
  },
}

module.exports = resolvers
