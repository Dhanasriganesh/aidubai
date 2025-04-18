import React from 'react'
import Routers from '../routers/Routers'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import { BrowserRouter as Router } from 'react-router-dom'
function Layout() {
  return (
    <Router>
      <Header />
      <div>
      <Routers/>
      </div>
      <Footer />
      </Router>

  )
}

export default Layout
