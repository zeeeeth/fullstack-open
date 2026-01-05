const { GraphQLError } = require('graphql')
const Book = require('./models/book')
const Author = require('./models/author')
const jwt = require('jsonwebtoken')
const User = require('./models/user')

const mongooseErrorToGraphQLError = (error, operation) => {
  if (error?.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((e) => e.message)
    return new GraphQLError(`${operation} failed: ${messages.join(', ')}`, {
      extensions: {
        code: 'BAD_USER_INPUT',
        invalidArgs: Object.keys(error.errors),
        mongoose: { name: error.name },
      },
    })
  }
}

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const filter = {}
      if (args.genre) {
        filter.genres = args.genre
      }
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) return []
        filter.author = author._id
      }
      return Book.find(filter).populate('author')
    },
    allAuthors: async () => {
      return Author.find({})
    },
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  Author: {
    bookCount: async (root) => {
      return Book.countDocuments({ author: root._id })
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const auth = context ? context.currentUser : null
      if (!auth) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })
      }

      try {
        const authorName = args.author.trim()
        let author = await Author.findOne({ name: authorName })
        if (!author) {
          author = await new Author({ name: authorName }).save()
        }

        const book = new Book({
          title: args.title,
          published: args.published,
          genres: args.genres,
          author: author._id,
        })

        const saved = await book.save()
        return Book.findById(saved._id).populate('author')
      } catch (error) {
        throw mongooseErrorToGraphQLError(error, 'addBook')
      }
    },
    editAuthor: async (root, args, context) => {
      const auth = context ? context.currentUser : null
      if (!auth) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })
      }

      try {
        const author = await Author.findOne({ name: args.name })
        if (!author) {
          return null
        }

        author.born = args.setBornTo
        return author.save()
      } catch (error) {
        throw mongooseErrorToGraphQLError(error, 'editAuthor')
      }
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      })
      return user.save().catch((error) => {
        throw mongooseErrorToGraphQLError(error, 'createUser')
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
}

module.exports = resolvers
