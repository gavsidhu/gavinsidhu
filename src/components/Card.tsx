import { type } from 'os'
import React, { MouseEventHandler, ReactNode, useState } from 'react'

interface Props {
    className?: string
    children: ReactNode
}

const Card = ({ className, children, ...props }: Props) => {
    return (
        <div
            className={`card ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}

export default Card