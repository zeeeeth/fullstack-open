const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
    
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    
    if (!blog.title || !blog.url)
        return response.status(400).json({ error: 'title and url are required' })

    // First user found in the database designated as creator
    const user = await User.findOne({})
    blog.user = user._id

    const savedBlog = await blog.save()

    // Add blog to user's blog array
    user.blogs = user.blogs.concat(blog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    const result = await Blog.findByIdAndDelete(request.params.id)
    if (!result) {
        return response.status(404).end()
    } else {
        return response.status(204).end()
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(400).end()
    }

    blog.title = body.title
    blog.author = body.author
    blog.url = body.url
    blog.likes = body.likes

    const updatedBlog = await blog.save()
    response.status(200).json(updatedBlog)
})

module.exports = blogsRouter