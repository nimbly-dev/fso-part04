const mongoose = require('mongoose')
const supertest = require('supertest')
const phonebookHelper = require('./helper/phonebookHelper')
const app = require('../app')

const api = supertest(app)
const Contact = require('../model/contact')


beforeEach(async () => {
    await Contact.deleteMany({})
    let contactObj = new Contact(phonebookHelper.initialContacts[0])
    await contactObj.save()
    contactObj = new Contact(phonebookHelper.initialContacts[1])
    await contactObj.save()
})

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


test('a specific contacat is within the returned contact', async () => {
    const response = await api.get('/api/contacts')


    const numbers = response.body.map(r => r.number)
    expect(numbers).toContain(
        '09-1234557'
    )
})

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

test('a invalid contact, name length less than three', () => {
    const newContact = {
        name: 'te',
        number: '09-1234551',
    }
    const response = api.get('/api/contacts')

    api
        .post('/api/contacts')
        .send(newContact)
        .expect(400)
        .expect('Content-Type', /application\/json/)

})

afterAll(async () => {
    await mongoose.connection.close()
})