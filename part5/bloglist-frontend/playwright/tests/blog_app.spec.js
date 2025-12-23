const { test, expect, beforeEach, describe } = require('@playwright/test')
const { createUser, attemptLogin, createBlog, logout, likeBlog } = require('./helper')

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
    beforeEach(async ({ page }) => {
        await attemptLogin(page, 'testuser', 'password')
        await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('can create a blog', async ({ page }) => {
        await createBlog({ page, title: 'Test Blog Title', author: 'Test Author', url: 'http://testblog.com' })
        await expect(page.getByText('Test Blog Title', { exact: true })).toBeVisible()
    })

    test('which creates a blog, created blog is visible in the list', async ({ page }) => {
        await createBlog({ page, title: 'Test Blog Title', author: 'Test Author', url: 'http://testblog.com' })
        await createBlog({ page, title: 'Another Blog', author: 'Another Author', url: 'http://anotherblog.com' })
        await createBlog({ page, title: 'Third Blog', author: 'Third Author', url: 'http://thirdblog.com' })
        await expect(page.locator('span', { hasText: 'Test Blog Title' })).toBeVisible()
        await expect(page.locator('span', { hasText: 'Another Blog' })).toBeVisible()
        await expect(page.locator('span', { hasText: 'Third Blog' })).toBeVisible()
    })

    test('can like a blog', async ({ page }) => {
        await createBlog({ page, title: 'Test Blog Title', author: 'Test Author', url: 'http://testblog.com' })
        await likeBlog(page, 'Test Blog Title')
        const blog = page.getByTestId('blog').filter({ hasText: 'Test Blog Title' })
        await expect(blog.getByText('likes 1')).toBeVisible()
    })

    test('can delete a blog added by self', async ({ page }) => {
        await createBlog({ page, title: 'Test Blog Title', author: 'Test Author', url: 'http://testblog.com' })
        const blog = page.getByTestId('blog').filter({ hasText: 'Test Blog Title' })
        await blog.getByRole('button', { name: 'remove' }).click()
        await expect(page.getByText('Test Blog Title', { exact: true})).not.toBeVisible()
    })

    test('cannot delete a blog added by another user', async ({ page, request }) => {
        await createBlog({ page, title: 'Test Blog Title', author: 'Test Author', url: 'http://testblog.com' })
        await logout(page)
        await createUser(request, 'otheruser', 'Other User', 'password2')
        await attemptLogin(page, 'otheruser', 'password2')
        const blog = page.getByTestId('blog').filter({ hasText: 'Test Blog Title' })
        await expect(blog.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })
})

describe('Blog app with multiple blogs', () => {

    beforeEach(async ({ page }) => {
        await attemptLogin(page, 'testuser', 'password')
        await createBlog({ page, title: 'Least Liked Blog', author: 'Author A', url: 'http://blog1.com' })
        await createBlog({ page, title: 'Medium Liked Blog', author: 'Author B', url: 'http://blog2.com' })
        await createBlog({ page, title: 'Most Liked Blog', author: 'Author C', url: 'http://blog3.com' })
        await likeBlog(page, 'Medium Liked Blog')
        await likeBlog(page, 'Most Liked Blog')
        await likeBlog(page, 'Most Liked Blog')
    })

    test('blogs are initially ordered by likes in descending order', async ({ page }) => {
        const blogs = page.getByTestId('blog')
        const firstBlog = blogs.nth(0)
        const secondBlog = blogs.nth(1)
        const thirdBlog = blogs.nth(2)
        await expect(firstBlog).toContainText('Most Liked Blog')
        await expect(secondBlog).toContainText('Medium Liked Blog')
        await expect(thirdBlog).toContainText('Least Liked Blog')
    })

    test('blogs reorder when likes are added', async ({ page }) => {
        await likeBlog(page, 'Least Liked Blog')
        await likeBlog(page, 'Least Liked Blog')
        await likeBlog(page, 'Least Liked Blog') // Now Least Liked Blog has 3 likes
        const blogs = page.getByTestId('blog')
        const firstBlog = blogs.nth(0)
        const secondBlog = blogs.nth(1)
        const thirdBlog = blogs.nth(2)
        await expect(firstBlog).toContainText('Least Liked Blog')
        await expect(secondBlog).toContainText('Most Liked Blog')
        await expect(thirdBlog).toContainText('Medium Liked Blog')
    })
})