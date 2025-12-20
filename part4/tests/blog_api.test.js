const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')

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

    test('returns 404 with well-formed id that does not exist', async () => {
        const validButMissingId = await helper.nonExistingId()

        await api
            .delete(`/api/blogs/${validButMissingId}`)
            .expect(404)
    })

    test('returns 400 with malformatted id', async () => {
    const malformattedId = '12345'

    await api
        .delete(`/api/blogs/${malformattedId}`)
        .expect(400)
    })

})

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user =  new User(helper.initialRootUser)
        user.passwordHash = passwordHash

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        await api
            .post('/api/users')
            .send(helper.validUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(helper.validUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const result = await api
            .post('/api/users')
            .send(helper.userWithTakenUsername)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message is username is too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const result = await api
            .post('/api/users')
            .send(helper.userWithShortUsername)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('invalid user created: username must be at least 3 characters long'))
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('creation fails with proper statuscode and message is password is too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const result = await api
            .post('/api/users')
            .send(helper.userWithShortPassword)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('invalid user created: password must be at least 3 characters long'))
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })
})

after(async () => {
    await mongoose.connection.close()
})