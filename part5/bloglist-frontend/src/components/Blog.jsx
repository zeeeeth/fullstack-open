import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, user, updateBlog }) => {
  
  const [isExpanded, setIsExpanded] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded)
  }

  const incrementLikes = () => {
    const newBlog = { ...blog, likes: (blog.likes || 0) + 1}
    updateBlog(blog.id, newBlog)
  }
  
  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleExpansion}>
          {isExpanded ? 'hide' : 'view'}
        </button>
      </div>
      <div style={{display : isExpanded ? '' : 'none'}}>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button type="button" onClick={incrementLikes}>like</button>
          {/* Like button functionality can be added here */}
        </div>
        <div>{blog.user && blog.user.name}</div>
      </div>
    </div>
  )
}

export default Blog