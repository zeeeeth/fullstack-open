import { gql } from '@apollo/client'

const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author {
        name
      }
      published
      id
      genres
    }
  }
`

const ALL_BOOKS_BY_GENRE = gql`
  query allBooksByGenre($genre: String!) {
    allBooks(genre: $genre) {
      title
      author {
        name
      }
      published
      id
    }
  }
`

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`

const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author {
        id
        name
      }
      published
      genres
      id
    }
  }
`

const SET_BIRTHYEAR = gql`
  mutation setBirthyear($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born) {
      name
      born
      id
    }
  }
`

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token {
        value
      }
      favoriteGenre
    }
  }
`

const ME = gql`
  query {
    me {
      username
      favoriteGenre
      id
    }
  }
`

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    author {
      name
      id
    }
    published
    genres
    id
  }
`

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }

  ${BOOK_DETAILS}
`

export {
  ALL_BOOKS,
  ALL_BOOKS_BY_GENRE,
  ALL_AUTHORS,
  CREATE_BOOK,
  SET_BIRTHYEAR,
  LOGIN,
  ME,
  BOOK_ADDED,
}
