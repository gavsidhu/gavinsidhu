import { type } from "os";
import React, { MouseEventHandler, ReactNode, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

interface Props {
  className?: string;
  children: ReactNode;
  link?: string;
}

const Card = ({ className, children, link, ...props }: Props) => {
  return (
    <>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={`card ${className}`}
          {...props}
        >
          <div className="cardContent">{children}</div>
        </a>
      ) : (
        <div className={`card ${className}`} {...props}>
          <div className="cardContent">{children}</div>
        </div>
      )}
    </>
  );
};

export default Card;
