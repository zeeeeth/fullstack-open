import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import storage from '../services/storage'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    clearUser() {
      return null
    },
  },
})

export const { setUser, clearUser } = userSlice.actions

export const initialiseUser = () => (dispatch) => {
  const user = storage.loadUser()
  if (user) {
    dispatch(setUser(user))
  }
}

export const loginUser = (credentials) => async (dispatch) => {
  const user = await loginService.login(credentials)
  storage.saveUser(user)
  dispatch(setUser(user))
  return user
}

export const logoutUser = () => (dispatch) => {
  storage.removeUser()
  dispatch(clearUser())
}

export default userSlice.reducer
