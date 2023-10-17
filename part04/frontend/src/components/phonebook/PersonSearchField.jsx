import React from 'react'
import PropTypes from 'prop-types'

const PersonSearchField = ({ searchQuery, handleSearchQueryChange }) => {
    return(
        <>
            Filter name by: <input value={searchQuery} onChange={handleSearchQueryChange}/>
        </>
    )
}

PersonSearchField.propTypes = {
    searchQuery: PropTypes.string,
    handleSearchQueryChange: PropTypes.func
}

export default PersonSearchField