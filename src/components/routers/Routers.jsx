import React from 'react'
import { Routes, Route } from 'react-router-dom'   
import Home from '../pages/Home'
import Replenishment from '../pages/Replenishment'
import ExpiryDate from '../pages/ExpiryDate'
import Slotting from '../pages/Slotting'
import Alerts from '../pages/Alerts'
import Recommendations from '../pages/Recommendations'
function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/replenishment" element={<Replenishment />} />
      <Route path="/expiry-date" element={<ExpiryDate />} />
      <Route path="/slotting" element={<Slotting />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="/recommendations" element={<Recommendations />} />
    </Routes>
  )
}

export default Router
