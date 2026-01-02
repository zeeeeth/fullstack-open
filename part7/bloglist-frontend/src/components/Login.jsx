import { useState } from 'react'
import { useNotification } from '../contexts/NotificationContext'
import { useUser } from '../contexts/UserContext'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { showNotification } = useNotification()
  const { login } = useUser()

  const doLogin = async (credentials) => {
    try {
      const user = await login(credentials)
      showNotification(`Welcome back, ${user.name}!`)
    } catch (error) {
      showNotification('Wrong credentials', 'error')
    }
  }

  const handleLogin = (event) => {
    event.preventDefault()
    doLogin({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={handleLogin}>
      <label>
        Username:
        <input
          type="text"
          data-testid="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          data-testid="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <input type="submit" value="Login" />
    </form>
  )
}

export default Login
