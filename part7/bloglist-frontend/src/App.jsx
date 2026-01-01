import { useState, useEffect, createRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { notify } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { initialiseUser, loginUser, logoutUser } from './reducers/userReducer'
import loginService from './services/login'
import storage from './services/storage'
import Login from './components/Login'
import BlogList from './components/BlogList'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

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

  const handleLogin = async (credentials) => {
    try {
      const user = await dispatch(loginUser(credentials))
      showNotification(`Welcome back, ${user.name}!`)
    } catch (error) {
      showNotification('Wrong credentials', 'error')
    }
  }

  const handleLogout = () => {
    dispatch(logoutUser())
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

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <div>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <NewBlog dispatch={dispatch} user={user} />
      </Togglable>
      <BlogList blogs={blogs} dispatch={dispatch} />
    </div>
  )
}

export default App
