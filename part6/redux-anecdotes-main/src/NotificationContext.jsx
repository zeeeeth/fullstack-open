import { createContext, useReducer } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
    switch(action.type) {
        case 'SET_NOTIFICATION':
            return action.payload
        case 'CLEAR_NOTIFICATION':
            return ''
        default:
            return state
    }
}

export const NotificationContextProvider = (props) => {
    const [notification, notificationDispatch] = useReducer(notificationReducer, '')

    return (
        <NotificationContext.Provider value={{ notification, notificationDispatch }}>
            {props.children}
        </NotificationContext.Provider>
    )
}

export const showNotification = (notificationDispatch, content, time) => {
    notificationDispatch({ type: 'SET_NOTIFICATION', payload: content })
    setTimeout(() => {
        notificationDispatch({ type: 'CLEAR_NOTIFICATION' })
    }, time)
}

export default NotificationContext