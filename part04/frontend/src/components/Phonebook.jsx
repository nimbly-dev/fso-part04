import React, { useState,useEffect } from 'react'
import { isNameAlreadyExists } from '../utility/PhonebookUtil'
import Form from './common/Form'
import InputField from './common/InputField'
import PersonList from './phonebook/PersonList'
import PersonSearchField from './phonebook/PersonSearchField'
import phonebookService from '../services/PhonebookService'
import Notification from './common/Notification'


const Phonebook = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [notification, setNotification] = useState({})

    useEffect(() => {
        phonebookService
            .getPersons()
            .then(initialData => {
                setPersons(initialData)
            })
    }, [])

    const handleNameInputChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberInputChange = (event) => {
        setNewNumber(event.target.value)
    }

    const handleSearchQueryChange = (event) => {
        setSearchQuery(event.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const personObj = {
            name: newName,
            number: newNumber,
        }

        if(isNameAlreadyExists(persons, personObj)){
            const updateConfirmation = window.confirm(`${newName} already exists, do you want to update it?`)
            if(updateConfirmation){
                const personWithSameName = persons.find((person) => person.name === newName)

                phonebookService
                    .updatePerson(personWithSameName.id,personObj)
                    .then(() => {
                        phonebookService
                            .getPersons()
                            .then(initialData => {
                                setPersons(initialData)
                            })
                        setNewName('')
                        setNewNumber('')
                    })
                    .catch(error => {
                        console.log(error)
                        setNotification({
                            message: `${error.response.data.error}`,
                            className: 'notification error'
                        })
                        setTimeout(() => {
                            setNotification({})
                        }, 5000)
                    })
            }
        }else{
            phonebookService
                .savePerson(personObj)
                .then(response => {
                    console.log('Returned data: {}', response)
                    phonebookService
                        .getPersons()
                        .then(initialData => {
                            setPersons(initialData)
                        })
                    setNewName('')
                    setNewNumber('')
                    setNotification({
                        message: 'Added new Person',
                        className: 'notification success'
                    })
                    setTimeout(() => {
                        setNotification({})
                    }, 5000)
                })
                .catch(err => {
                    console.log(err)
                    setNotification({
                        message: `${err.response.data.error}`,
                        className: 'notification error'
                    })
                    setTimeout(() => {
                        setNotification({})
                    }, 5000)
                })
        }
    }

    const handleDelete = (id, name) => {
        const deleteConfirmation = window.confirm(`Are you sure you want to delete ${name}?`)

        if (deleteConfirmation) {
            phonebookService
                .deletePerson(id)
                .then(() => {
                    setPersons(persons.filter(person => person.id !== id))
                })
                .catch(err => {
                    setNotification({
                        message: `Failed to delete ${name}, already been deleted to server`,
                        className: 'notification fail'
                    })
                    setTimeout(() => {
                        setNotification({})
                    }, 5000)
                    console.log(err)

                })
        }
    }

    return (
        <>
            <h2>Phonebook</h2>
            <PersonSearchField handleSearchQueryChange={handleSearchQueryChange} searchQuery={searchQuery}/>

            <Form onSubmit={handleSubmit}>
                <InputField label={'Name'} handleOnChange={handleNameInputChange} value={newName} />
                <InputField label={'Number'} handleOnChange={handleNumberInputChange} value={newNumber} />
            </Form>
            <Notification notification={notification} />
            <h2>Numbers</h2>
            <PersonList searchQuery={searchQuery} persons={persons} handleDelete={handleDelete}/>
        </>
    )
}

export default Phonebook