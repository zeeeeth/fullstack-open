import { createSlice } from '@reduxjs/toolkit'

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
  },
})

export const { setBlogs, appendBlog, likeBlog, deleteBlog } = blogSlice.actions
export default blogSlice.reducer
