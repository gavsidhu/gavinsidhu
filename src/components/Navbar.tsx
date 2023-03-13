import Link from 'next/link'
import React from 'react'
import { FaGithub, FaTwitter, FaEnvelope } from "react-icons/fa"

const navigation = []

const Navbar = () => {
  return (
    <div className='navbarContainer'>
      {/* <div className='navbarName'>
        <h1>Gavin Sidhu</h1>
      </div> */}
      {/* <div>
        <nav>
          <div className='navbar'>
            <Link href='#' 
            className={`${typeof window !== "undefined" && window.location.pathname === "/"?
            "navLink navLinkCurrent"
            :
            "navLink"}`}
            >
              <div>Home</div>
            </Link>
            <Link href='/projects' 
            className={`${typeof window !== "undefined" && window.location.pathname === "/projects"?
            "navLink navLinkCurrent"
            :
            "navLink"}`}
            >
              <div>Projects</div>
            </Link>
            <Link href='/contact' 
            className={`${typeof window !== "undefined" && window.location.pathname === "/contact"?
            "navLink navLinkCurrent"
            :
            "navLink"}`}
            >
              <div>Contact</div>
            </Link>
          </div>
        </nav>
      </div> */}
      <div className='socialLinks'>
        <Link
          href="#"
          className='socialIcon'
        >
          <FaEnvelope/>
        </Link>
        <Link
          href="#"
          className='socialIcon'
        >
          <FaGithub />
        </Link>
        <Link
          href="#"
          className='socialIcon'
        >
          <FaTwitter />
        </Link>
      </div>
    </div>
  )
}

export default Navbar