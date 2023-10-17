const blogRouter = require('express').Router()
const Blog = require('../model/Blog')
const ApiResponse = require('../model/ApiResponse')

blogRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(new ApiResponse(blogs))
        })
})

blogRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)

    blog
        .save()
        .then(result => {
            response.status(201).json(new ApiResponse(result))
        })
})

module.exports = blogRouter