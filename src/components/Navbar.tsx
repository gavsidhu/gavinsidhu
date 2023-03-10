import Link from 'next/link'
import React from 'react'
import { FaGithub, FaTwitter, FaEnvelope } from "react-icons/fa"

const navigation = []

const Navbar = () => {
  return (
    <div className='navbarContainer'>
      <div className='navbarName'>
        <h1>Gavin Sidhu</h1>
      </div>
      <div>
        <nav>
          <div className='navbar'>
            <a className='navLink'>
              <div>Home</div>
            </a>
            <a className='navLink'>
              <div>Projects</div>
            </a>
            <a className='navLink'>
              <div>Contact</div>
            </a>
          </div>
        </nav>
      </div>
      <div className='socialLinks'>
        <Link
          href="#"
          className='socialIcon'
        >
          <FaEnvelope className='socialIcon' />
        </Link>
        <Link
          href="#"
          className='socialIcon'
        >
          <FaGithub className='socialIcon' />
        </Link>
        <Link
          href="#"
          className='socialIcon'
        >
          <FaTwitter className='socialIcon' />
        </Link>
      </div>
    </div>
  )
}

export default Navbar