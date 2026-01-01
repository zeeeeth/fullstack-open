import { useNotification } from '../contexts/NotificationContext'

const Notification = () => {
  const { notification } = useNotification()
  if (!notification) return null
  const { message, type } = notification
  if (!message || message.trim() === '') return null

  if (!notification) {
    return null
  }

  const style = {
    backgroundColor: 'lightgrey',
    margin: '10px',
    padding: '10px',
    border: '2px solid',
    borderColor: type === 'success' ? 'green' : 'red',
    borderRadius: '5px',
  }

  return <div style={style}>{message}</div>
}

export default Notification
