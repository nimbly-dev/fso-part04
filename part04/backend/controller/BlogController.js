const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../model/Blog')
const User = require('../model/User')
const ApiResponse = require('../model/ApiResponse')
const ErrorResponse = require('../model/ErrorResponse')

const tokenUtil = require('../util/user/token')

blogRouter.get('/', (request, response,next) => {
    const decodedToken = jwt.verify(tokenUtil.getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }

    Blog
        .find({})
        .then(blogs => {
            response.json(new ApiResponse(blogs))
        })
        .catch((error) => next(error))
})

blogRouter.post('/', async (request, response, next) => {
    if(request.body.title === '' || request.body.title === null){
        response.status(400).json(new ErrorResponse('Title must not be empty')).end()
    }

    else if(request.body.url === '' || request.body.url === null){
        response.status(400).json(new ErrorResponse('URL must not be empty')).end()
    }

    else{
        const blog = new Blog(request.body)
        const decodedToken = jwt.verify(tokenUtil.getTokenFrom(request), process.env.SECRET)
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token invalid' })
        }
        const user = await User.findById(decodedToken.id)
        blog
            .save()
            .then(async (result) => {
                user.blogs = user.blogs.concat(result._id)
                await user.save()
                response.status(201).json(new ApiResponse(result)).end()
            })
            .catch((error) => next(error))
    }
})

blogRouter.put('/:id', async (request, response) => {
    const { title, url, author } = request.body
    const decodedToken = jwt.verify(tokenUtil.getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }


    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        { title, url, author },
        { new: true, runValidators: false, context: 'query' }
    )

    if (!updatedBlog) {
        return response.status(404).json({ error: 'Provided id not found' }).end()
    }

    response.json(updatedBlog)

})

blogRouter.delete('/:id', (request,response,next) => {
    const id = Number(request.params.id)
    const decodedToken = jwt.verify(tokenUtil.getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }

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