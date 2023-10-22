//Dependency Imports Here
const express = require('express')
const logger = require('./util/logger')
const contactRouter = require('./controller/ContactController')
const blogRouter = require('./controller/BlogListController')
require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status - :res[content-length] :response-time ms :body'))

//Router Controllers Here
app.use('/api/contacts', contactRouter)
app.use('/api/blogs', blogRouter)


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }

    next(error)
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)
app.use(cors())
app.use(express.static('dist'))
app.use(errorHandler)


module.exports = app