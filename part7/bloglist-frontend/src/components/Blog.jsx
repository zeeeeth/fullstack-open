import { useState } from 'react'
import PropTypes from 'prop-types'
import storage from '../services/storage'
import { useNotification } from '../contexts/NotificationContext'
import blogService from '../services/blogs'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)

  const nameOfUser = blog.user ? blog.user.name : 'anonymous'

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  const { showNotification } = useNotification()
  const queryClient = useQueryClient()

  const canRemove = blog.user ? blog.user.username === storage.me() : true

  console.log(blog.user, storage.me(), canRemove)

  const blogLikeMutation = useMutation({
    mutationFn: (blog) =>
      blogService.update(blog.id, {
        ...blog,
        likes: blog.likes + 1,
        user: blog.user ? blog.user.id : null,
      }),
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(['blogs'], (oldBlogs) =>
        oldBlogs.map((blog) =>
          blog.id === updatedBlog.id
            ? { ...updatedBlog, user: blog.user }
            : blog,
        ),
      )
    },
    onError: (error) => {
      showNotification(`Error liking blog: ${error.message}`, 'error')
    },
  })

  const handleVote = async (blog) => {
    await blogLikeMutation.mutateAsync(blog)
    showNotification(`You liked ${blog.title} by ${blog.author}`)
  }

  const blogDeleteMutation = useMutation({
    mutationFn: (id) => blogService.remove(id),
    onSuccess: () => {
      queryClient.setQueryData(['blogs'], (oldBlogs = []) =>
        oldBlogs.filter((b) => b.id !== blog.id),
      )
    },
    onError: (error) => {
      showNotification(`Error deleting blog: ${error.message}`, 'error')
    },
  })

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogDeleteMutation.mutateAsync(blog.id)
      showNotification(`Blog ${blog.title}, by ${blog.author} removed`)
    }
  }

  return (
    <div style={style} className="blog">
      {blog.title} by {blog.author}
      <button style={{ marginLeft: 3 }} onClick={() => setVisible(!visible)}>
        {visible ? 'hide' : 'view'}
      </button>
      {visible && (
        <div>
          <div>
            <a href={blog.url}>{blog.url}</a>
          </div>
          <div>
            likes {blog.likes}
            <button style={{ marginLeft: 3 }} onClick={() => handleVote(blog)}>
              like
            </button>
          </div>
          <div>{nameOfUser}</div>
          {canRemove && (
            <button onClick={() => handleDelete(blog)}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.object,
  }).isRequired,
}

export default Blog
