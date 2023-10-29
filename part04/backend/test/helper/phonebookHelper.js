const Contact = require('../../model/Contact')

const initialContacts = [
    {
        'name': 'tes123t2',
        'number': '09-1234556'
    },
    {
        'name': 'tes123t',
        'number': '09-1234557'
    }
]


const nonExistingId = async () => {
    const contact = new Contact({ name: 'willremovethissoon' })
    await contact.save()
    await contact.deleteOne()

    return contact._id.toString()
}

const contactInDb = async () => {
    const contacts = await Contact.find({})
    return contacts.map(contact => contact.toJSON())
}

module.exports = {
    initialContacts, nonExistingId, contactInDb
}