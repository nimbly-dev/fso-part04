module.exports =  class ApiResponse {
    constructor(data){
        this.data = data
        this.timestamp = new Date()
    }
}
