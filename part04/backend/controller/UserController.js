const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../model/User')
const ErrorResponse = require('../model/ErrorResponse')

usersRouter.get('/', async (request, response) => {

    const users = await User
        .find({}).populate('blogs')

    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    // Check if the username is already in use
    const existingUser = await User.findOne({ username })

    if (existingUser) {
        return response.status(400).json(new ErrorResponse('Username already taken'))
    }

    if(password.length <= 3){
        return response.status(400).json(new ErrorResponse('Password must not be less than 3'))
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

module.exports = usersRouter