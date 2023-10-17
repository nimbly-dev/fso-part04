const contactRouter = require('express').Router()
const Contact = require('../model/contact')
const ApiResponse = require('../model/ApiResponse')
const logger = require('../util/logger')

contactRouter.get('/', (request, response) => {
    Contact.find({}).then((contacts) => {
        response.json(contacts)
    })
})

contactRouter.get('/info', (request, response,next) => {
    Contact.countDocuments({})
        .then((result) => {
            response.json(new ApiResponse(result))
        })
        .catch((error) => next(error))
})

contactRouter.get('/:id', (request, response, next) => {
    Contact.findByIdAndRemove(request.params.id)
        .then((result) => {
            if (!result) {
                response.status(404).json(new ApiResponse('Contact not found'))
            } else {
                response.status(204).end()
            }
        })
        .catch((error) => next(error))
})

contactRouter.post('/', async (request, response, next) => {
    console.log(request)
    const body = request.body

    try {
        await Contact.findOne({ name: body.name }, { runValidators: true }).exec()
            .then((existingContact) => {
                if (existingContact) {
                    // An existing contact with the same name was found
                    return response.status(400).json(new ApiResponse(`An existing contact with the name ${body.name} was found.`))
                } else {
                    // Create and save the new contact
                    const newContact = new Contact({ name: body.name, number: body.number })
                    newContact.save()
                        .then((savedContact) => {
                            response.json(savedContact)
                        })
                        .catch((saveErr) => {
                            next(saveErr)
                        })
                }
            })
            .catch((error) => next(error))
    } catch (err) {
        logger.error(err)
    }
})

contactRouter.put('/:id', (request, response, next) => {
    const { name, number } = request.body

    Contact.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' },
    )
        .then((updatedContact) => {
            response.json(updatedContact)
        })
        .catch((error) => next(error))
})

contactRouter.delete('/:id', (request, response, next) => {
    const id = Number(request.params.id)

    if (id === null) {
        return response.status(404).json({
            error: 'Id param must not be empty',
        })
    }

    Contact.findByIdAndRemove(request.params.id)
        .then((result) => {
            if (!result) {
                response.status(404).end()
            } else {
                response.status(204).json(new ApiResponse('Deleted')).end()
            }
        })
        .catch((error) => next(error))
})


module.exports = contactRouter