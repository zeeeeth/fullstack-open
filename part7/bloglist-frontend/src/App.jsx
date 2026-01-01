import { useState, useEffect, createRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { notify } from './reducers/notificationReducer'
import {
  initializeBlogs,
  createBlog,
  likeOneBlog,
  removeBlog,
} from './reducers/blogReducer'
import loginService from './services/login'
import storage from './services/storage'
import Login from './components/Login'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const dispatch = useDispatch()
  const [user, setUser] = useState(null)
  const notification = useSelector((state) => state.notification)
  const blogs = useSelector((state) => state.blogs)

  // Refactor application to use Redux for notification state
  const showNotification = (message, type = 'success') => {
    dispatch(notify(message, type, 5000))
  }

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const user = storage.loadUser()
    if (user) {
      setUser(user)
    }
  }, [])

  const blogFormRef = createRef()

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      setUser(user)
      storage.saveUser(user)
      showNotification(`Welcome back, ${user.name}!`)
    } catch (error) {
      showNotification('Wrong credentials', 'error')
    }
  }

  const handleCreate = async (blog) => {
    const created = await dispatch(createBlog(blog, user))
    showNotification(`Blog created: ${created.title}, ${created.author}`)
    blogFormRef.current.toggleVisibility()
  }

  const handleVote = async (blog) => {
    const updated = await dispatch(likeOneBlog(blog))
    showNotification(`You liked ${updated.title} by ${updated.author}`)
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await dispatch(removeBlog(blog.id))
      showNotification(`Blog ${blog.title}, by ${blog.author} removed`)
    }
  }

  const handleLogout = () => {
    setUser(null)
    storage.removeUser()
    showNotification(`Bye, ${user.name}!`)
  }

  if (!user) {
    return (
      <div>
        <h2>blogs</h2>
        <Notification notification={notification} />
        <Login doLogin={handleLogin} />
      </div>
    )
  }

  const byLikes = (a, b) => b.likes - a.likes

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <div>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <NewBlog doCreate={handleCreate} />
      </Togglable>
      {blogs
        .slice()
        .sort(byLikes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleVote={handleVote}
            handleDelete={handleDelete}
          />
        ))}
    </div>
  )
}

export default App
