const _ = require('lodash')
const Blog = require('../../model/Blog')

const initialBlogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0
    },
    {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0
    },
    {
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0
    },
    {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0
    }
]


const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const findMostLikedBlog = (blogs) => {
    if (blogs.length === 0) {
        return null // Return null if the array is empty
    }

    const mostLikedBlog = blogs.reduce((mostLiked, blog) => (blog.likes > mostLiked.likes ? blog : mostLiked))

    if (mostLikedBlog.likes === 0) {
        return 0 // Return 0 if the most liked blog has 0 likes
    }

    return mostLikedBlog
}
const findAuthorWithMostBlogs=(blogs) => {
    if (blogs.length === 0) {
        return null // Return null if the array is empty
    }

    const authorCounts = _.countBy(blogs, 'author')
    const authorWithMostBlogs = _.maxBy(_.keys(authorCounts), author => authorCounts[author])

    return {
        author: authorWithMostBlogs,
        blogs: authorCounts[authorWithMostBlogs]
    }
}

const nonExistingId = async () => {
    const blog = new Blog({ title: 'willremovethissoon' })
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const blogInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(contact => contact.toJSON())
}


module.exports = {
    dummy,totalLikes,findMostLikedBlog,findAuthorWithMostBlogs, nonExistingId,blogInDb, initialBlogs
}
