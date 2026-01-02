import { useNotification } from '../contexts/NotificationContext'
import { useUser } from '../contexts/UserContext'

const UserInfo = () => {
  const { showNotification } = useNotification()
  const { user, logout } = useUser()
  const handleLogout = () => {
    logout()
    showNotification(`Bye, ${user.name}!`)
  }

  return (
    <div>
      {user.name} logged in
      <button onClick={handleLogout}>logout</button>
    </div>
  )
}

export default UserInfo
