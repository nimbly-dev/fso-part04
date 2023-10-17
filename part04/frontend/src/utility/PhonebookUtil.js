export const isInputFieldsEmpty = (...inputValues) => {
    return inputValues.some(value => !value)
}

export const isNameAlreadyExists = (persons, personObj) => {
    if(persons.some(person => person.name === personObj.name)){
        return true
    }
    return false
}

export const isNumberAlreadyExists = (persons, personObj) => {
    if(persons.some(person => person.number === personObj.number)){
        return true
    }
    return false
}

export const autoIncrementId = (persons) => {
    return (Math.max(...persons.map(person => person.id), 0)) + 1
}

export const filterPersonsByName = (persons, stringQuery) => {
    return persons.filter(person => person.name.toLowerCase().includes(stringQuery.toLowerCase()))
}