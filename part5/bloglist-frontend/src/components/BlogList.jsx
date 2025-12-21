import Blog from './Blog'
import Togglable from './Togglable'
import AddBlogForm from './AddBlogForm'


const BlogList = ({ blogs, user, createBlog, updateBlog }) => {
    return (
      <div>
        <Togglable buttonLabel="create new blog">
          <AddBlogForm createBlog={createBlog}/>
        </Togglable>
        {blogs.map(blog => 
          <Blog 
            key={blog.id} 
            blog={blog} 
            user={user}
            updateBlog={updateBlog}
          />
        )}
      </div>
    )
}

export default BlogList