import '../index.css'

const Notification = ({ message, type }) => {
  if (!message) {
    return null
  }

  return (
    <div
      className={
        type === 'error' ? 'notification_error' : 'notification_success'
      }
    >
      {message}
    </div>
  )
}

export default Notification
