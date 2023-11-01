const bcrypt = require('bcryptjs')
const supertest = require('supertest')
const User = require('../model/User')
const userHelper = require('./helper/userHelper')
const app = require('../app')
const api = supertest(app)


describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await userHelper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await userHelper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation does not succeed when username already exists', async () => {
        const newUser1 = {
            username: 'test1',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser1)

        const newUser2 = {
            username: 'test1',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        const expectedErrorMssg = 'Username already taken'
        const user2 = await api
            .post('/api/users')
            .send(newUser2)
            .expect(400)

        expect(user2.body.error).toContain(expectedErrorMssg)
    })

    test('creation does not succeed when password is less than 3', async () => {
        const newUser1 = {
            username: 'test3',
            name: 'Matti Luukkainen',
            password: '12',
        }

        const response = await api
            .post('/api/users')
            .send(newUser1)
        const expectedErrorMssg = 'Password must not be less than 3'

        expect(response.body.error).toContain(expectedErrorMssg)
    })

    test('creation does not succeed when username is less than 3', async () => {
        const newUser1 = {
            username: 'rs',
            name: 'Matti Luukkainen',
            password: '123!',
        }

        const response = await api
            .post('/api/users')
            .send(newUser1)
        const expectedErrorMssg = 'User validation failed: username: Path `username` (`rs`) is shorter than the minimum allowed length (3).'

        expect(response.body.error).toContain(expectedErrorMssg)
    })
})

