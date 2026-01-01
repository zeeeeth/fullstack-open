import { useEffect, createRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { initialiseUser } from './reducers/userReducer'
import Login from './components/Login'
import BlogList from './components/BlogList'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import UserInfo from './components/UserInfo'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const blogs = useSelector((state) => state.blogs)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(initialiseUser())
  }, [dispatch])

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
