const mongoose = require('mongoose')
const supertest = require('supertest')
const blogHelper = require('./helper/blogHelper')
const jwt = require('jsonwebtoken')
const app = require('../app')

const api = supertest(app)
const Blog = require('../model/Blog')
const User = require('../model/User')

global.authToken = null // Initialize the global variable
global.testUserId = null
beforeAll(async() => {
    console.log('Creating test account')
    await User.deleteMany({})

    //Create a test user
    const userObj = { username: 'api_blog_test_user', name: 'testName', password: 'test' }
    const response = await api.post('/api/users')
        .send(userObj)

    //Login the test users
    const loginUser = { username: response.body.username, password: 'test' }
    const loginResponse = await api.post('/api/login')
        .send(loginUser)

    global.authToken = loginResponse.body.token
    global.testUserId = (jwt.verify(loginResponse.body.token, process.env.SECRET)).id
},15000)

beforeEach(async () => {
    console.log('cleared')
    await Blog.deleteMany({})
    const testUser =  await User.findById(global.testUserId)
    const { id } = testUser
    const blogObj = blogHelper.initialBlogs
        .map(blog => ({
            ...blog,
            'user': id,
        }))
    Blog.insertMany(blogObj)
    console.log('done')
},15000)

beforeEach(async () => {
    console.log('cleared')
    await Blog.deleteMany({})
    const testUser =  await User.findById(global.testUserId)
    const { id } = testUser
    const blogObj = blogHelper.initialBlogs
        .map(blog => ({
            ...blog,
            'user': id,
        }))
    Blog.insertMany(blogObj)
    console.log('done')
},15000)

describe('get', () => {

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .set('Authorization', `Bearer ${global.authToken}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs').set('Authorization', `Bearer ${global.authToken}`)

        expect(response.body.data).toHaveLength(blogHelper.initialBlogs.length)
    })


    test('a specific blog is within the returned contact', async () => {
        const response = await api.get('/api/blogs').set('Authorization', `Bearer ${global.authToken}`)


        const author = response.body.data.map(r => r.author)
        expect(author).toContain(
            'Edsger W. Dijkstra'
        )
    })

    test('a id of the blog', async () => {
        const response = await api.get('/api/blogs').set('Authorization', `Bearer ${global.authToken}`)

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
            .set('Authorization', `Bearer ${global.authToken}`)
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
            .set('Authorization', `Bearer ${global.authToken}`)
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
            .set('Authorization', `Bearer ${global.authToken}`)
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
            .set('Authorization', `Bearer ${global.authToken}`)
            .send(newBlog)

        expect(response.status).toBe(400)
        expect(response.body.error).toContain(expectedErrorMssg)
    })
})

describe('update', () => {
    test('a blog', async () => {
        const newBlog =     {
            title: 'New Blog',
            author: 'Theo',
            url: 'https://google.com/',
            likes: 4,
            __v: 0
        }

        const blogToBeUpdated = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${global.authToken}`)
            .send(newBlog)
        const blogId = blogToBeUpdated.body.data.id
        const newBlogTitle = 'new Blog 2'
        const newBlogAuthor = 'Theo2'
        const newBlogUrl = 'https://youtube.com'

        const updateBlog = {
            title: newBlogTitle,
            author: newBlogAuthor,
            url: newBlogUrl,
        }

        const updatedContact = await api
            .put(`/api/blogs/${blogId}`)
            .set('Authorization', `Bearer ${global.authToken}`)
            .send(updateBlog)

        expect(updatedContact.status).toBe(200)
        expect(updatedContact.body.title).toContain(newBlogTitle)
    })

    test('a nonexisting contact', async () => {

        const newBlog =     {
            title: 'New Blog',
            author: 'Theo',
            url: 'https://google.com/',
            likes: 4,
            __v: 0
        }

        const response = await api
            .put('/api/contacts/652aa64a387430472b7dc50c')
            .set('Authorization', `Bearer ${global.authToken}`)
            .send(newBlog)

        const expectedErrorMssg = 'Provided id not found'

        expect(response.status).toBe(404)
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
            .set('Authorization', `Bearer ${global.authToken}`)
            .send(newBlog)
        const id = blog.body.data.id


        const response = await api
            .delete(`/api/blogs/${id}`)
            .set('Authorization', `Bearer ${global.authToken}`)

        expect(response.status).toBe(204)
    })
    test('a nonexisting blog', async() => {
        const savedContactId = await blogHelper.nonExistingId()

        const response = await api
            .delete(`/api/contacts/${savedContactId}`)
            .set('Authorization', `Bearer ${global.authToken}`)

        expect(response.status).toBe(404)
    })
    test('a blog where a user has no access', async() => {
        //Create the user with no access
        const userObj2 = { username: 'api_blog_test_user_2', name: 'testName', password: 'test' }
        const response2 = await api.post('/api/users')
            .send(userObj2)

        //Get its token
        const loginUser = { username: response2.body.username, password: 'test' }
        const loginResponse = await api.post('/api/login')
            .send(loginUser)
        const token = loginResponse.body.token

        //Save the blog:
        const newBlog =     {
            title: 'New Blog',
            author: 'Theo',
            url: 'https://google.com/',
            likes: 4,
            __v: 0
        }

        const blog = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${global.authToken}`)
            .send(newBlog)
        const id = blog.body.data.id

        //Delete it using a different token
        const response = await api
            .delete(`/api/blogs/${id}`)
            .set('Authorization', `Bearer ${token}`)
        const expectedErrorMssg = 'Unauthorized'

        expect(response.status).toBe(401)
        expect(response.body.error).toContain(expectedErrorMssg)
    })
})


afterAll(async () => {
    await mongoose.connection.close()
})