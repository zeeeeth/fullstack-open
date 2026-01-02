import { createRef } from 'react'
import Login from './components/Login'
import BlogList from './components/BlogList'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import UserInfo from './components/UserInfo'
import { useQuery } from '@tanstack/react-query'
import blogService from './services/blogs'
import { useUser } from './contexts/UserContext'

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
    return (
      <div>
        <h2>blogs</h2>
        <Notification />
        <Login />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <UserInfo />
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <NewBlog />
      </Togglable>
      <BlogList blogs={blogs} />
    </div>
  )
}

export default App
