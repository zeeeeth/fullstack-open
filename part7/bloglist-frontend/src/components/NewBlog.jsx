import { useState } from 'react'
import { useNotification } from '../contexts/NotificationContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'

const NewBlog = ({ user }) => {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [author, setAuthor] = useState('')
  const queryClient = useQueryClient()
  const { showNotification } = useNotification()

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const newBlogMutation = useMutation({
    mutationFn: (newBlog) => blogService.create(newBlog, user),
    onSuccess: (created) => {
      // Update blogs query data in cache
      queryClient.setQueryData(['blogs'], (old = []) => old.concat(created))
      showNotification(`Blog created: ${created.title}, ${created.author}`)
    },
    onError: (error) => {
      showNotification(`Error creating blog: ${error.message}`, 'error')
    },
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    newBlogMutation.mutate({ title, url, author })
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
