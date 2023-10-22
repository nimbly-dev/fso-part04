const config = require('./util/config')
const app = require('./app')
const logger = require('./util/logger')

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
})
