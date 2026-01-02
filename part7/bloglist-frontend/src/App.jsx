import { createRef } from 'react'
import LoginPage from './components/LoginPage'
import Home from './components/Home'
import { UserView, User } from './components/UserView'
import { BlogDetails } from './components/Blog'
import UserInfo from './components/UserInfo'
import Notification from './components/Notification'
import { useQuery } from '@tanstack/react-query'
import blogService from './services/blogs'
import { useUser } from './contexts/UserContext'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from 'react-router-dom'
import { use } from 'react'

const App = () => {
  const { user } = useUser()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    select: (blogs) =>
      blogs.map((blog) => ({
        ...blog,
        user:
          typeof blog.user === 'string'
            ? { id: blog.user, username: null, name: null }
            : blog.user,
      })),
  })

  if (result.isLoading) {
    return <div>Loading blogs...</div>
  }

  if (result.isError) {
    return <div>Error loading blogs: {result.error.message}</div>
  }

  const blogs = result.data
  const blogFormRef = createRef()

  if (!user) {
    return <LoginPage />
  }

  const padding = {
    padding: 5,
  }

  return (
    <Router>
      <div>
        <Notification />
        <h2>Blog App</h2>
        <UserInfo />
        <Link style={padding} to="/">
          blogs
        </Link>
        <Link style={padding} to="/users">
          users
        </Link>
      </div>

      <Routes>
        <Route
          path="/"
          element={<Home blogFormRef={blogFormRef} blogs={blogs} />}
        />
        <Route path="/users" element={<UserView />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
      </Routes>
    </Router>
  )
}

export default App
