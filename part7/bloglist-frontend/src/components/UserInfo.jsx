import { useDispatch } from 'react-redux'
import { logoutUser } from '../reducers/userReducer'

const UserInfo = ({ user, showNotification }) => {
  const dispatch = useDispatch()

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
