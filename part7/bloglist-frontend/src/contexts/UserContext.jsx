import { createContext, useContext, useEffect, useReducer } from 'react'
import loginService from '../services/login'
import storage from '../services/storage'

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload
    case 'CLEAR_USER':
      return null
    default:
      return state
  }
}

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, null)

  // Load user from localStorage
  useEffect(() => {
    const user = storage.loadUser()
    if (user) {
      dispatch({ type: 'SET_USER', payload: user })
    }
  }, [])

  const login = async ({ username, password }) => {
    const user = await loginService.login({ username, password })
    storage.saveUser(user)
    dispatch({ type: 'SET_USER', payload: user })
    return user
  }

  const logout = () => {
    storage.removeUser()
    dispatch({ type: 'CLEAR_USER' })
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  return useContext(UserContext)
}
