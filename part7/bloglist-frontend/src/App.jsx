import { useEffect, createRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { notify } from './reducers/notificationReducer'
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
  const notification = useSelector((state) => state.notification)
  const blogs = useSelector((state) => state.blogs)

  const showNotification = (message, type = 'success') => {
    dispatch(notify(message, type, 5000))
  }

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
        <Notification notification={notification} />
        <Login showNotification={showNotification} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <UserInfo user={user} showNotification={showNotification} />
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <NewBlog user={user} showNotification={showNotification} />
      </Togglable>
      <BlogList blogs={blogs} showNotification={showNotification} />
    </div>
  )
}

export default App
