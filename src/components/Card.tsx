import { type } from 'os'
import React, { MouseEventHandler, ReactNode, useState } from 'react'

type Props = {
    className?: string
    children: ReactNode
}

const Card = ({ className, children }: Props) => {
    return (
        <div
            className={`card ${className}`}
        >
            {children}
        </div>
    )
}

export default Card