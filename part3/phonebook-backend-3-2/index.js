require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (request) => {
  return request.method === 'POST' ? JSON.stringify(request.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
      response.json(result)
  })
})

// app.get('/api/persons/:id', (request, response) => {
//   const id = request.params.id
//   const note = persons.find((note) => note.id === id)

//   if (note) {
//     response.json(note)
//   } else {
//     response.status(404).end()
//   }
// })

// const generateId = () => {
//   const maxId =
//     persons.length > 0 ? Math.max(...persons.map((n) => Number(n.id))) : 0
//   return String(maxId + 1)
// }

// app.post('/api/persons', (request, response) => {
//   const body = request.body

//   if (!body.name || !body.number) {
//     return response.status(400).json({
//       error: 'name or number missing',
//     })
//   }

//   const note = {
//     name: body.name,
//     number: body.number,
//     id: generateId(),
//   }

//   persons = persons.concat(note)

//   response.json(note)
// })

// app.delete('/api/persons/:id', (request, response) => {
//   const id = request.params.id
//   persons = persons.filter((note) => note.id !== id)

//   response.status(204).end()
// })

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' })
// }

// app.use(unknownEndpoint)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
