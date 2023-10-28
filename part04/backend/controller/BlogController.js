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

blogRouter.delete('/:id', (request,response,next) => {
    const id = Number(request.params.id)

    if (id === null) {
        return response.status(404).json({
            error: 'Id param must not be empty',
        })
    }

    Blog.findByIdAndRemove(request.params.id)
        .then((result) => {
            if (!result) {
                response.status(404).end()
            } else {
                response.status(204).json(new ApiResponse('Deleted')).end()
            }
        })
        .catch((error) => next(error))
})

module.exports = blogRouter