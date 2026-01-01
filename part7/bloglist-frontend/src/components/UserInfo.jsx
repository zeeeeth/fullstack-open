import { useDispatch } from 'react-redux'
import { logoutUser } from '../reducers/userReducer'
import { useNotification } from '../contexts/NotificationContext'

const UserInfo = ({ user }) => {
  const dispatch = useDispatch()

  const { showNotification } = useNotification()
  const handleLogout = () => {
    dispatch(logoutUser())
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
