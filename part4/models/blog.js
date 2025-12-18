const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl, { family: 4 })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB', error.message))

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0,
        required: false
    }
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)