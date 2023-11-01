const mongoose = require('mongoose')
const config = require('../util/config')

const url = config.MONGODB_URI

mongoose.connect(url)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    }
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

blogSchema.pre('remove', function (next) {
    const User = require('../model/User') // Adjust the import path as needed

    // Find the user associated with this blog
    User.findById(this.user, (err, user) => {
        if (err) {
            return next(err)
        }

        // Remove the blog's reference from the user's blogs array
        user.blogs = user.blogs.filter((blogId) => blogId.toString() !== this._id.toString())

        // Save the updated user
        user.save((err) => {
            if (err) {
                return next(err)
            }
            next()
        })
    })
})

module.exports = mongoose.model('Blog', blogSchema)
