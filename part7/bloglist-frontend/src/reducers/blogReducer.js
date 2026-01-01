import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    likeBlog(state, action) {
      const id = action.payload
      return state.map((blog) =>
        blog.id === id ? { ...blog, likes: blog.likes + 1 } : blog,
      )
    },
    deleteBlog(state, action) {
      const id = action.payload
      return state.filter((blog) => blog.id !== id)
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload
      return state.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog,
      )
    },
  },
})

export const { setBlogs, appendBlog, likeBlog, deleteBlog, updateBlog } =
  blogSlice.actions

export const initializeBlogs = () => async (dispatch) => {
  const blogs = await blogService.getAll()
  dispatch(setBlogs(blogs))
}

export const createBlog = (blog, user) => async (dispatch) => {
  const newBlog = await blogService.create(blog)
  const newBlogWithUser = {
    ...newBlog,
    user: {
      name: user.name,
      username: user.username,
      id: user.id,
    },
  }
  dispatch(appendBlog(newBlogWithUser))
  return newBlogWithUser
}

export const likeOneBlog = (blog) => async (dispatch) => {
  const updated = await blogService.update(blog.id, {
    ...blog,
    likes: blog.likes + 1,
    user: blog.user ? blog.user.id : null,
  })
  const updatedBlog = { ...updated, user: blog.user }
  dispatch(updateBlog(updatedBlog))
  return updatedBlog
}

export const removeBlog = (id) => async (dispatch) => {
  await blogService.remove(id)
  dispatch(deleteBlog(id))
}

export default blogSlice.reducer
