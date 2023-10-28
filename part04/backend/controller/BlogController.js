const blogRouter = require('express').Router()
const Blog = require('../model/Blog')
const ApiResponse = require('../model/ApiResponse')
const ErrorResponse = require('../model/ErrorResponse')

blogRouter.get('/', (request, response,next) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(new ApiResponse(blogs))
        })
        .catch((error) => next(error))
})

blogRouter.post('/', (request, response) => {
    if(request.body.title === '' || request.body.title === null){
        response.status(400).json(new ErrorResponse('Title must not be empty')).end()
    }

    else if(request.body.url === '' || request.body.url === null){
        response.status(400).json(new ErrorResponse('URL must not be empty')).end()
    }

    else{
        const blog = new Blog(request.body)
        blog
            .save()
            .then(result => {
                response.status(201).json(new ApiResponse(result)).end()
            })
    }
})

module.exports = blogRouter