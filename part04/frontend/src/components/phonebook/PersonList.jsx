import PropTypes from 'prop-types'
import React from 'react'
import { filterPersonsByName } from '../../utility/PhonebookUtil'

const PersonList = ({ searchQuery, persons, handleDelete }) => {
    return(
        <>
            <ul>
                {
                    searchQuery === '' ? persons.map(person => {
                        return(
                            <li key={person.id}>
                                {person.name} : {person.number}
                                <button type='button' onClick={() => handleDelete(person.id, person.name)}>Delete</button>
                            </li>
                        )
                    }) : filterPersonsByName(persons,searchQuery).map(person => {
                        return(
                            <li key={person.id}>
                                {person.name} : {person.number} <button type='button' onClick={() => handleDelete(person.id, person.name)}>Delete</button>
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}

PersonList.propTypes = {
    searchQuery: PropTypes.string,
    persons: PropTypes.array,
    handleDelete: PropTypes.func
}
export default PersonList