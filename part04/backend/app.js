//Dependency Imports Here
const express = require('express')
const middleware = require('./util/middleware') // Import the middleware module
require('express-async-errors')
const contactRouter = require('./controller/ContactController')
const blogRouter = require('./controller/BlogController')
const userRouter = require('./controller/UserController')
const loginRouter = require('./controller/LoginController')
require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status - :res[content-length] :response-time ms :body'))
app.use(middleware.getToken)
//Router Controllers Here
app.use('/api/contacts',middleware.getLoggedUser, contactRouter)
app.use('/api/blogs', middleware.getLoggedUser,blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

// handler of requests with unknown endpoint
app.use(cors())
app.use(express.static('dist'))


module.exports = app