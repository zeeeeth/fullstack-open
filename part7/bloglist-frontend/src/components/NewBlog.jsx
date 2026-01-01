import { useState } from 'react'
import { notify } from '../reducers/notificationReducer'
import { createBlog } from '../reducers/blogReducer'

const NewBlog = ({ dispatch, user }) => {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [author, setAuthor] = useState('')

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const showNotification = (message, type = 'success') => {
    dispatch(notify(message, type, 5000))
  }

  const handleCreate = async (blog) => {
    const created = await dispatch(createBlog(blog, user))
    showNotification(`Blog created: ${created.title}, ${created.author}`)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    handleCreate({ title, url, author })
    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create a New Blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            data-testid="title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          <label>URL:</label>
          <input
            type="text"
            data-testid="url"
            value={url}
            onChange={handleUrlChange}
          />
        </div>
        <div>
          <label>Author:</label>
          <input
            type="text"
            data-testid="author"
            value={author}
            onChange={handleAuthorChange}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default NewBlog
