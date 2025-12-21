import Blog from './Blog'

const BlogList = ({ blogs, user }) => {
    return (
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
}

export default BlogList