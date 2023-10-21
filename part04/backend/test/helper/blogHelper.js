const _ = require('lodash')


const dummy = () => {
    // You can create an array of sample blogs here
    // const sampleBlogs = [
    //     {
    //         title: 'Sample Blog 1',
    //         author: 'Author 1',
    //         url: 'https://example.com/blog1',
    //         likes: 10,
    //     },
    //     {
    //         title: 'Sample Blog 2',
    //         author: 'Author 2',
    //         url: 'https://example.com/blog2',
    //         likes: 5,
    //     },
    // // Add more sample blogs as needed
    // ]

    // // If 'blogs' argument is provided, you can concatenate the sample blogs with it
    // if (Array.isArray(blogs)) {
    //     return [...sampleBlogs, ...blogs]
    // }

    // Otherwise, return just the sample blogs\
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

module.exports = {
    dummy,totalLikes,findMostLikedBlog,findAuthorWithMostBlogs
}
