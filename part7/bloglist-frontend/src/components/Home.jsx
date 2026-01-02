import Togglable from './Togglable'
import NewBlog from './NewBlog'
import BlogList from './BlogList'

const Home = ({ blogFormRef, blogs }) => {
  return (
    <div className="container">
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <NewBlog />
      </Togglable>
      <BlogList blogs={blogs} />
    </div>
  )
}

export default Home
