import Blog from './Blog'

const byLikes = (b1, b2) => b2.likes - b1.likes

const BlogList = ({ blogs, showNotification }) => {
  return (
    <div>
      {blogs
        .slice()
        .sort(byLikes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} showNotification={showNotification} />
        ))}
    </div>
  )
}

export default BlogList
