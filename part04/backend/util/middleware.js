const logger = require('./logger')
const User = require('../model/User')
const jwt = require('jsonwebtoken')

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
    else if (error.name ===  'JsonWebTokenError') {
        return response.status(401).json({ error: error.message })
    }
    else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            error: 'token expired'
        })
    }

    next(error)
}

const getToken = (request,response,next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    } else {
        request.token = null
    }
    next()
}

/**Use this middleware before getToken()*/
const getLoggedUser = async (request,response,next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(decodedToken){
        request.loggedUser = await User.findById(decodedToken.id)
    }

    next()
}

module.exports =  {
    getLoggedUser,
    getToken,
    errorHandler,
    unknownEndpoint,
}