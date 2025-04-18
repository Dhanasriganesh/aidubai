import React from 'react'
import { Routes, Route } from 'react-router-dom'   
import Home from '../pages/Home'
import Replenishment from '../pages/Replenishment'
import ExpiryDate from '../pages/ExpiryDate'
import Slotting from '../pages/Slotting'

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/replenishment" element={<Replenishment />} />
      <Route path="/expiry-date" element={<ExpiryDate />} />
      <Route path="/slotting" element={<Slotting />} />
    </Routes>
  )
}

export default Router
