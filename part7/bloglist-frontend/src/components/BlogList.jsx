import Blog from './Blog'

const byLikes = (b1, b2) => b2.likes - b1.likes

const BlogList = ({ blogs, dispatch }) => {
  return (
    <div>
      {blogs
        .slice()
        .sort(byLikes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} dispatch={dispatch} />
        ))}
    </div>
  )
}

export default BlogList
