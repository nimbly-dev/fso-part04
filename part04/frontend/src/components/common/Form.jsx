import PropTypes from 'prop-types'
import React from 'react'

const Form = ({ onSubmit,children }) => {

    return(
        <>
            <form onSubmit={onSubmit} name="phoneBookForm">
                {
                    children
                }
                <div>
                    <button type="submit">Add</button>
                </div>
            </form>
        </>
    )
}

Form.propTypes = {
    onSubmit: PropTypes.func.isRequired, // 'onSubmit' should be a function
    children: PropTypes.node.isRequired, // 'children' can be any valid React node
}

export default Form