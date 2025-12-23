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
}


const attemptLogin = async (page, username, password) => {
    await page.getByLabel('username').fill(username)
    await page.getByLabel('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const logout = async (page) => {
    await page.getByRole('button', { name: 'logout' }).click()
}

export { createUser, attemptLogin, createBlog, logout }