import { createContext, useContext, useReducer, useRef } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload
    case 'CLEAR_NOTIFICATION':
      return { message: null, type: null }
    default:
      return state
  }
}

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, null)
  const timeoutRef = useRef(null)

  const showNotification = (message, type = 'success', timeout = 5000) => {
    dispatch({
      type: 'SET_NOTIFICATION',
      payload: { message, type },
    })

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' })
      timeoutRef.current = null
    }, timeout)
  }

  const clearNotification = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    dispatch({ type: 'CLEAR_NOTIFICATION' })
  }

  return (
    <NotificationContext.Provider
      value={{ notification, showNotification, clearNotification }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  return useContext(NotificationContext)
}
