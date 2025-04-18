import React from 'react'
import { Link } from 'react-router-dom'   
function Header() {
  return (
    <div>
      <div>
      <Link to="/">Space exploration</Link>
      </div>
      <div>
        <Link to="/blogs">Blogs</Link>
      </div>
    </div>
  )
}

export default Header
