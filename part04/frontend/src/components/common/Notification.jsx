import React from 'react'
import PropTypes from 'prop-types'

const Notification = ({ notification }) => {

    if (notification.message === null || notification.message === '') {
        return <></>
    }

    return(
        <div className={notification.className}>
            <p>{notification.message}</p>
        </div>
    )
}
Notification.propTypes = {
    notification: PropTypes.object
}


export default Notification