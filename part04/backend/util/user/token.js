
const getTokenFrom = (request,response,next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    } else {
        request.token = null // Optional: Set to null if no token is provided
    }
    next()
}
module.exports = { getTokenFrom }