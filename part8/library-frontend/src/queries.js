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
        name
      }
      published
      genres
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
      value
    }
  }
`

export { ALL_BOOKS, ALL_AUTHORS, CREATE_BOOK, SET_BIRTHYEAR, LOGIN }
