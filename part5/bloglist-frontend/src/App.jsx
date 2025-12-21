import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import LoginInformation from './components/LoginInformation'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  
  /* Load blogs on startup */
  useEffect(() => {
    const loadInitialBlogs = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        const blogs = await blogService.getAll()
        setBlogs(blogs)
      } catch (error) {
        notify(`Error fetching blogs: ${error.message}`, 'error')
        setIsError(true)
      }
      setIsLoading(false)
    }
    loadInitialBlogs()
  }, [])

  /* Check for logged in user on startup */
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  
  const notify = (message, type='info') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      notify(`login as ${user.name} successful`, 'success')
      return true
    } catch (error) {
      notify(`Unsuccessful login: ${error.message}`, 'error')
      return false
    }
  }

  if (isError)
    return (<div>Error loading blogs</div>)
  if (isLoading)
    return (<div>Loading blogs...</div>)

  return (
    <div>
      <Notification notification={notification}/>
      {!user && <LoginForm handleLogin={handleLogin}/>}
      {user && <h2>blogs</h2>}
      {user && <LoginInformation user={user}/>}
      {user && <BlogList blogs={blogs} user={user} />}
    </div>
  )
  
}

export default App