const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../model/Blog')
const User = require('../model/User')
const ApiResponse = require('../model/ApiResponse')
const ErrorResponse = require('../model/ErrorResponse')

blogRouter.get('/', async (request, response,next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }

    await Blog
        .find({}).populate('user', { username: 1, name: 1 })
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

        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token invalid' })
        }
        const user = await User.findById(decodedToken.id)

        const blog = await new Blog({
            title: request.body.title,
            author: request.body.author,
            url: request.body.url,
            likes: request.body.likes,
            user: user._id, // Assign the user's ID to the 'user' field
        }).populate('user', { username: 1, name: 1 })

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
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
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

blogRouter.delete('/:id', async (request,response,next) => {
    const id = request.params.id
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }

    if (id === null) {
        return response.status(404).json({
            error: 'Id param must not be empty',
        })
    }

    const blog = await Blog.findById(id).catch((error) => next(error))

    if(!blog || blog === null){
        return response.status(404).json({
            error: 'Blog not found',
        })
    }

    if(blog.user.toString() === request.loggedUser.id.toString()){
        await Blog.deleteOne({ _id: id }).catch((error) => next(error))
        response.status(204).json(new ApiResponse('Deleted')).end()
    }else{
        return response.status(401).json({
            error: 'Unauthorized',
        })
    }
})

module.exports = blogRouter