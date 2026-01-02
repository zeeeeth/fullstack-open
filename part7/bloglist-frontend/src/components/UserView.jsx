import axios from 'axios'
import { Table } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

const fetchUsers = async () => {
  const response = await axios.get('/api/users')
  return response.data
}

const UserView = () => {
  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

  if (isLoading) return <div className="container">Loading users...</div>
  if (isError)
    return <div className="container">Error loading users: {error.message}</div>

  return (
    <div className="container">
      <h2>Users</h2>
      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length} blogs</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

const User = () => {
  const { id } = useParams()
  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

  if (isLoading) return <div className="container">Loading users...</div>
  if (isError)
    return <div className="container">Error loading users: {error.message}</div>

  const user = users.find((u) => u.id === id)
  if (!user) return <div className="container">User not found</div>
  return (
    <div className="container">
      <h1>{user.name}</h1>
      <h3>Added blogs</h3>
      <ul>
        {user.blogs.map((b) => {
          return <li key={b.id}>{b.title}</li>
        })}
      </ul>
    </div>
  )
}

export { UserView, User }
