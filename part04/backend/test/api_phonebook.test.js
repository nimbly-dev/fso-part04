const mongoose = require('mongoose')
const supertest = require('supertest')
const phonebookHelper = require('./helper/phonebookHelper')
const app = require('../app')

const api = supertest(app)
const Contact = require('../model/Contact')


beforeEach(async () => {
    console.log('cleared')
    await Contact.deleteMany({})

    const contactsObj = phonebookHelper.initialContacts
        .map(contact => new Contact(contact))
    const initialContactsArray = contactsObj.map(contact => contact.save())

    await Promise.all(initialContactsArray)
    console.log('done')
})


describe('get', () => {

    test('contacts are returned as json', async () => {
        await api
            .get('/api/contacts')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all contacts are returned', async () => {
        const response = await api.get('/api/contacts')

        expect(response.body).toHaveLength(phonebookHelper.initialContacts.length)
    })


    test('a specific contact is within the returned contact', async () => {
        const response = await api.get('/api/contacts')


        const numbers = response.body.map(r => r.number)
        expect(numbers).toContain(
            '09-1234557'
        )
    })
})

describe('save', () => {
    test('a valid contact can be added', async () => {
        const newContact = {
            name: 'test5555',
            number: '09-1234551',
        }

        await api
            .post('/api/contacts')
            .send(newContact)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const contactAtEnd = await phonebookHelper.contactInDb()
        expect(contactAtEnd).toHaveLength(phonebookHelper.initialContacts.length + 1)

        const contacts = contactAtEnd.map(n => n.number)
        expect(contacts).toContain(
            '09-1234551'
        )
    })

    test('a invalid contact, throws error name length less than three', async () => {
        const newContact = {
            name: 'te',
            number: '09-1234551',
        }
        const expectedErrorMssg = 'Contact validation failed: name: Path `name` (`te`) is shorter than the minimum allowed length (3).'

        const response = await api
            .post('/api/contacts')
            .send(newContact)

        expect(response.status).toBe(400)
        expect(response.body.error).toContain(expectedErrorMssg)
    })

    test('a invalid contact, throws error number is invalid', async () => {
        const newContact = {
            name: 'test',
            number: '09-1234551111111',
        }
        const expectedErrorMssg = 'Invalid phone number format.'

        const response = await api
            .post('/api/contacts')
            .send(newContact)

        expect(response.status).toBe(400)
        expect(response.body.error).toContain(expectedErrorMssg)
    })

    test('a invalid contact, throws error number is invalid', async () => {
        const newContact = {
            name: 'test1',
            number: '09-1234551',
        }

        //Save contact
        await api
            .post('/api/contacts')
            .send(newContact)

        const duplicateContact = {
            name: 'test1',
            number: '09-1234551',
        }

        const expectedErrorMssg = 'An existing contact with the name test1 was found.'

        const response = await api
            .post('/api/contacts')
            .send(duplicateContact)

        expect(response.status).toBe(400)
        expect(response.body.error).toContain(expectedErrorMssg)
    })

    test('a invalid contact, throws error name is required', async () => {
        const newContact = {
            name: '',
            number: '09-1234551',
        }

        //Save contact
        await api
            .post('/api/contacts')
            .send(newContact)

        const expectedErrorMssg = 'Contact validation failed: name: Path `name` is required.'

        const response = await api
            .post('/api/contacts')
            .send(newContact)

        expect(response.status).toBe(400)
        expect(response.body.error).toContain(expectedErrorMssg)
    })
})

describe('update',() => {
    test('a existing contact', async () => {
        const newContact = {
            name: 'test5555',
            number: '09-1234551',
        }

        const contactTobeUpdated = await api
            .post('/api/contacts')
            .send(newContact)
        const contactId = contactTobeUpdated.body.id
        const newContactName = 'test5554'
        const newNumber = '09-1234556'

        const updateContact = {
            name: newContactName,
            number: newNumber,
        }

        const updatedContact = await api
            .put(`/api/contacts/${contactId}`)
            .send(updateContact)

        expect(updatedContact.status).toBe(200)
        expect(updatedContact.body.name).toContain(newContactName)
    })
    test('a nonexisting contact', async () => {

        const updateContact = {
            name: 'nonexist',
            number: '09-1234556',
        }

        const response = await api
            .put('/api/contacts/652aa64a387430472b7dc50c')
            .send(updateContact)

        const expectedErrorMssg = 'Provided id not found'

        expect(response.status).toBe(404)
        expect(response.body.error).toContain(expectedErrorMssg)
    })
})

describe('delete', () => {
    test('a existing contact', async () => {
        const newContact = {
            name: 'test5555',
            number: '09-1234551',
        }

        const savedContact = await api
            .post('/api/contacts')
            .send(newContact)

        const savedContactId = savedContact.body.id

        const response = await api
            .delete(`/api/contacts/${savedContactId}`)

        expect(response.status).toBe(204)
    })
    test('a nonexisting contact', async() => {
        const savedContactId = await phonebookHelper.nonExistingId()

        const response = await api
            .delete(`/api/contacts/${savedContactId}`)

        expect(response.status).toBe(404)
    })
})


afterAll(async () => {
    await mongoose.connection.close()
})