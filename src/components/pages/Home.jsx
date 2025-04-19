import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen  p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Warehouse Management System</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Replenishment Tile */}
        <Link to="/replenishment" className="group">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 h-64 flex flex-col justify-between transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-4">Replenishment</h2>
              <p className="text-blue-100">Manage and track inventory replenishment processes</p>
            </div>
            <div className="text-white text-right">
              <span className="text-sm opacity-75 group-hover:opacity-100 transition-opacity">View Details →</span>
            </div>
          </div>
        </Link>

        {/* Expiry Date Tile */}
        <Link to="/expiry-date" className="group">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 h-64 flex flex-col justify-between transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-4">Expiry Date</h2>
              <p className="text-green-100">Monitor and manage product expiration dates</p>
            </div>
            <div className="text-white text-right">
              <span className="text-sm opacity-75 group-hover:opacity-100 transition-opacity">View Details →</span>
            </div>
          </div>
        </Link>

        {/* Slotting Tile */}
        <Link to="/slotting" className="group">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 h-64 flex flex-col justify-between transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-4">Slotting & Rearrangement</h2>
              <p className="text-purple-100">Optimize warehouse layout and product placement</p>
            </div>
            <div className="text-white text-right">
              <span className="text-sm opacity-75 group-hover:opacity-100 transition-opacity">View Details →</span>
            </div>
          </div>
        </Link>


        <Link to="/artiware" className="group">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 h-64 flex flex-col justify-between transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-4">ArtiWare</h2>
              <p className="text-purple-100">Virtual Intelligence for Warehouse Management</p>
            </div>
            <div className="text-white text-right">
              <span className="text-sm opacity-75 group-hover:opacity-100 transition-opacity">View Details →</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Home
