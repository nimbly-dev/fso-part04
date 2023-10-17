import PropTypes from 'prop-types'
import React from 'react'

const InputField = ({ handleOnChange, label, value }) => {
    return(
        <>
            <label htmlFor={label}>{label}</label>
            <input id={label} value={value} onChange={handleOnChange} required/>
        </>
    )
}

InputField.propTypes = {
    handleOnChange: PropTypes.func,
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}

export default InputField