import { expect } from '@playwright/test'

const createUser = async (request, username, name, password) => {
    await request.post('/api/users', {
    data: {
        username,
        name,
        password
    }
  })
}

const createBlog = async ({ page, title, author, url }) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByLabel('title:').fill(title)
  await page.getByLabel('author:').fill(author)
  await page.getByLabel('url:').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByText(title, { exact: true }).waitFor()
}

const attemptLogin = async (page, username, password) => {
    await page.getByLabel('username').fill(username)
    await page.getByLabel('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const logout = async (page) => {
    await page.getByRole('button', { name: 'logout' }).click()
}

const likeBlog = async (page, blogTitle) => {
  const blog = page.getByTestId('blog').filter({ hasText: blogTitle })

  // Only click view if details not already visible
  const viewButton = blog.getByRole('button', { name: 'view' })
  if (await viewButton.isVisible().catch(() => false)) {
    await viewButton.click()
  }

  const likeBtn = blog.getByRole('button', { name: 'like' })
  await expect(likeBtn).toBeVisible()
  const likesBox = likeBtn.locator('..')
  const beforeText = await likesBox.textContent()
  const before = Number(beforeText.match(/likes\s+(\d+)/i)[1])

  await likeBtn.click()
  await expect(likesBox).toContainText(`likes ${before + 1}`)
}



export { createUser, attemptLogin, createBlog, logout, likeBlog }