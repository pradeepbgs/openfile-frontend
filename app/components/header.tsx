import React from 'react'
import { Link } from 'react-router'
import { useAuth } from '~/zustand/store'

function Header() {
  const isLoggedIn = useAuth.getState().user?.email
  return (
    <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-lg shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">
          <Link to="/">OpenFile</Link>
        </h1>
        <nav className="space-x-4">
          {
            isLoggedIn ?
              <Link to="/dashboard" className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition">Dashboard</Link>
              :
              <Link to="/auth" className="text-gray-300 hover:text-white transition">Login</Link>
          }
        </nav>
      </div>
    </header>
  )
}

export default React.memo(Header)
