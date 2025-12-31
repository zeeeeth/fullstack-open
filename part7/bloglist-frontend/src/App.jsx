import { useState, useEffect, createRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { notify } from './reducers/notificationReducer'
import {
  setBlogs,
  appendBlog,
  likeBlog,
  deleteBlog,
} from './reducers/blogReducer'
import blogService from './services/blogs'
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
    blogService.getAll().then((blogs) => dispatch(setBlogs(blogs)))
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
    const newBlog = await blogService.create(blog)
    const newBlogWithUser = {
      ...newBlog,
      user: { name: user.name, username: user.username, id: newBlog.user },
    }
    dispatch(appendBlog(newBlogWithUser))
    showNotification(`Blog created: ${newBlog.title}, ${newBlog.author}`)
    blogFormRef.current.toggleVisibility()
  }

  const handleVote = async (blog) => {
    console.log('updating', blog)
    const updated = await blogService.update(blog.id, {
      ...blog,
      user: blog.user ? blog.user.id : null,
      likes: blog.likes + 1,
    })
    showNotification(`You liked ${blog.title} by ${blog.author}`)
    dispatch(likeBlog(blog.id))
  }

  const handleLogout = () => {
    setUser(null)
    storage.removeUser()
    showNotification(`Bye, ${user.name}!`)
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id)
      dispatch(deleteBlog(blog.id))
      showNotification(`Blog ${blog.title}, by ${blog.author} removed`)
    }
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
