import React from 'react'
import '../index.css'

const Notification = ({ message, type }) => {
    if (message === null) {
        return null
    }

    const className = `notification notification__${type}`

    return (
        <div className={className}>
            {message}
        </div>
    )
}

export default Notification