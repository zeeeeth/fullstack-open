import { startTrackValue } from '@testing-library/user-event/dist/cjs/document/trackValue.js'
import { useSelector } from 'react-redux'

const Notification = () => {
  const { notification } = useSelector(state => state)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }
  return notification ? <div style={style}>{notification}</div> : null
}

export default Notification
