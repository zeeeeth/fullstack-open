import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
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
      notify(`login as ${user.name} successful`, 'success')
      return true
    } catch {
      notify('wrong credentials', 'error')
      return false
    }
  }

  return (
    <div>
      <Notification notification={notification}/>
      {!user && <LoginForm handleLogin={handleLogin}/>}
      {user && <BlogList blogs={blogs} user={user} />}
    </div>
  )
  
}

export default App