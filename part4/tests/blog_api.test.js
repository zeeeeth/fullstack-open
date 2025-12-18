const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

describe('reading the blogs', () => {
    test('blogs returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('returns correct amount of blogs', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('verifies that the unique identifier property of the blog posts is named id', async () => {
        const response = await api.get('/api/blogs')
        response.body.forEach(blog => {
            assert.ok(blog.id)
            assert.strictEqual(blog._id, undefined)
        })
    })
})

describe('posting a blog', () => {

    test('increases the total number of blogs by one', async () => {
        await api
            .post('/api/blogs')
            .send(helper.validBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    })

    test('posts a blog with the correct contents', async () => {
        const response = await api
                            .post('/api/blogs')
                            .send(helper.validBlog)
                            .expect(201)
        const newBlog = response.body
        delete newBlog.id
        assert.deepStrictEqual(newBlog, helper.validBlog)
    })

    test('with likes missing defaults to the value 0', async () => {
        const response = await api
                            .post('/api/blogs')
                            .send(helper.blogWithoutLikes)
                            .expect(201)
        const newBlog = response.body
        assert.strictEqual(newBlog.likes, 0)
    })

    test('with missing title responds with status code 400', async () => {
        const response = await api
                            .post('/api/blogs')
                            .send(helper.blogWithoutTitle)
                            .expect(400)
    })

    test('with missing Url responds with status code 400', async () => {
        const response = await api
                            .post('/api/blogs')
                            .send(helper.blogWithoutUrl)
                            .expect(400)
    })
})

describe('deleting a blog', () => {
    test('succeeds with valid id', async () => {
        const initialBlogs = await helper.blogsInDb()
        const blogToDelete = initialBlogs[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)
        
        const blogsAfterDelete = await helper.blogsInDb()
        assert.strictEqual(blogsAfterDelete.length, initialBlogs.length - 1)
        assert.ok(!blogsAfterDelete.includes(blogToDelete))
    })

    test('returns 404 with invalid id', async () => {
        const id = await helper.nonExistingId()

        await api
            .delete(`/api/blogs/${id}`)
            .expect(404)
    })
})

after(async () => {
    await mongoose.connection.close()
})