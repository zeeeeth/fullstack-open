import { useEffect, createRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { initialiseUser } from './reducers/userReducer'
import Login from './components/Login'
import BlogList from './components/BlogList'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import UserInfo from './components/UserInfo'
import { useQuery } from '@tanstack/react-query'
import blogService from './services/blogs'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

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

  useEffect(() => {
    dispatch(initialiseUser())
  }, [dispatch])

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
      <UserInfo user={user} />
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <NewBlog user={user} />
      </Togglable>
      <BlogList blogs={blogs} />
    </div>
  )
}

export default App
