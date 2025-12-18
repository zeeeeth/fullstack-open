const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
    
blogsRouter.get('/', (request, response) => {
    Blog.find({}).then((blogs => {
        response.json(blogs)
    }))
})

blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)
    
    if (!blog.title || !blog.url) {
    response.status(400).json({ error: 'title and url are required' })
    return
    }

    blog.save().then((result) => {
    response.status(201).json(result)
    })
})

blogsRouter.delete('/:id', async (request, response) => {
    const result = await Blog.findByIdAndDelete(request.params.id)
    if (!result) {
        return response.status(404).end()
    } else {
        return response.status(204).end()
    }
})

module.exports = blogsRouter