module.exports =  class ErrorResponse {
    constructor(error){
        this.error = error
        this.timestamp = new Date()
    }
}