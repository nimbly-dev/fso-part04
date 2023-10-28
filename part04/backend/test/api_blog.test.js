const mongoose = require('mongoose')
const supertest = require('supertest')
const blogHelper = require('./helper/blogHelper')
const app = require('../app')

const api = supertest(app)
const Blog = require('../model/Blog')


beforeEach(async () => {
    console.log('cleared')
    await Blog.deleteMany({})

    const blogObj = blogHelper.initialBlogs
        .map(blog => new Blog(blog))
    const initialBlogsArray = blogObj.map(blog => blog.save())

    await Promise.all(initialBlogsArray)
    console.log('done')
},10000)


describe('get', () => {

    test('contacts are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body.data).toHaveLength(blogHelper.initialBlogs.length)
    })


    test('a specific blog is within the returned contact', async () => {
        const response = await api.get('/api/blogs')


        const author = response.body.data.map(r => r.author)
        expect(author).toContain(
            'Edsger W. Dijkstra'
        )
    })

    test('a id of the blog', async () => {
        const response = await api.get('/api/blogs')

        const blogs = response.body.data
        expect(blogs[0].id).toBeDefined()
    })

})

describe('save', () => {
    test('a valid blog can be added', async () => {
        const newBlog =     {
            title: 'New Blog',
            author: 'Theo',
            url: 'https://google.com/',
            likes: 7,
            __v: 0
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogAtEnd = await blogHelper.blogInDb()
        expect(blogAtEnd).toHaveLength(blogHelper.initialBlogs.length + 1)

        const title = blogAtEnd.map(n => n.title)
        expect(title).toContain(
            'New Blog'
        )
    })
    test('a valid blog without likes can be added', async () => {
        const newBlog =     {
            title: 'New Blog',
            author: 'Theo',
            url: 'https://google.com/',
            __v: 0
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogAtEnd = await blogHelper.blogInDb()
        expect(blogAtEnd).toHaveLength(blogHelper.initialBlogs.length + 1)

        const title = blogAtEnd.map(n => n.title)
        const likes = blogAtEnd.map(n => n.likes)
        expect(title).toContain(
            'New Blog'
        )
        expect(likes).toContain(0)
    })

    test('a invalid blog, empty url', async () => {
        const newBlog =     {
            title: 'New Blog',
            author: 'Theo',
            url: '',
            likes: 7,
            __v: 0
        }
        const expectedErrorMssg = 'URL must not be empty'
        const response = await api
            .post('/api/blogs')
            .send(newBlog)

        expect(response.status).toBe(400)
        expect(response.body.error).toContain(expectedErrorMssg)
    })

    test('a invalid blog, empty title', async () => {
        const newBlog =     {
            title: '',
            author: 'Test2',
            url: 'https://google.com/',
            likes: 7,
            __v: 0
        }
        const expectedErrorMssg = 'Title must not be empty'
        const response = await api
            .post('/api/blogs')
            .send(newBlog)

        expect(response.status).toBe(400)
        expect(response.body.error).toContain(expectedErrorMssg)
    })
})

describe('delete',() => {
    test('a blog', async () => {
        const newBlog =     {
            title: 'New Blog',
            author: 'Theo',
            url: 'https://google.com/',
            likes: 4,
            __v: 0
        }

        const blog = await api
            .post('/api/blogs')
            .send(newBlog)
        const id = blog.body.data.id


        const response = await api
            .delete(`/api/blogs/${id}`)

        expect(response.status).toBe(204)
    })
    test('a nonexisting blog', async()=>{
        const savedContactId = await blogHelper.nonExistingId()

        const response = await api
            .delete(`/api/contacts/${savedContactId}`)

        expect(response.status).toBe(404)
    })
})


afterAll(async () => {
    await mongoose.connection.close()
})