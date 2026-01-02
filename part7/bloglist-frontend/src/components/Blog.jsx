import PropTypes from 'prop-types'
import storage from '../services/storage'
import { useNotification } from '../contexts/NotificationContext'
import blogService from '../services/blogs'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useParams, useNavigate } from 'react-router-dom'

const Blog = ({ blog }) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={style} className="container">
      <Link to={`/blogs/${blog.id}`}>
        {blog.title} by {blog.author}
      </Link>
    </div>
  )
}

const BlogDetails = () => {
  const { id } = useParams()
  const { showNotification } = useNotification()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const blog = useQueryClient()
    .getQueryData(['blogs'])
    .find((b) => b.id === id)

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
      navigate('/')
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
    <div>
      <h2>
        {blog.title}, {blog.author}
      </h2>
      <div>{blog.url}</div>
      <div>
        likes {blog.likes}
        <button style={{ marginLeft: 3 }} onClick={() => handleVote(blog)}>
          like
        </button>
      </div>
      <div>added by {blog.user ? blog.user.name : 'anonymous'}</div>
      {canRemove && <button onClick={() => handleDelete(blog)}>remove</button>}
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

export { Blog, BlogDetails }
