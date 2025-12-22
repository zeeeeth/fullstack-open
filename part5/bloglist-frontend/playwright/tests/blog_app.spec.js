const { test, expect, beforeEach, describe } = require('@playwright/test')
const { createUser, attemptLogin, createBlog } = require('./helper')

beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await createUser(request, 'testuser', 'Test User', 'password')
    await page.goto('/')
})

describe('Blog app by default', () => {
  test('shows login form', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
  })
})

describe('Blog app with one user', () => {
    test('login fails with wrong password', async ({ page }) => {
      await attemptLogin(page, 'testuser', 'wrongpassword')
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
    
    test('login succeeds with correct password', async ({ page }) => {
      await attemptLogin(page, 'testuser', 'password')
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })
})

describe('Blog app with logged in user', () => {
    beforeEach(async ({ page, request }) => {
        await attemptLogin(page, 'testuser', 'password')
        await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('can create a blog', async ({ page }) => {
        await createBlog({ page, title: 'Test Blog Title', author: 'Test Author', url: 'http://testblog.com' })
        await expect(page.getByText('a new blog "Test Blog Title" by Test Author added')).toBeVisible()
    })

    test('which creates a blog, created blog is visible in the list', async ({ page }) => {
        await createBlog({ page, title: 'Test Blog Title', author: 'Test Author', url: 'http://testblog.com' })
        await createBlog({ page, title: 'Another Blog', author: 'Another Author', url: 'http://anotherblog.com' })
        await createBlog({ page, title: 'Third Blog', author: 'Third Author', url: 'http://thirdblog.com' })
        await expect(page.locator('span', { hasText: 'Test Blog Title' })).toBeVisible()
        await expect(page.locator('span', { hasText: 'Another Blog' })).toBeVisible()
        await expect(page.locator('span', { hasText: 'Third Blog' })).toBeVisible()
    })
})