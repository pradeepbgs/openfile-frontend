import React from 'react'
import { Link } from 'react-router'
import { useAuth } from '~/zustand/store'

function Header() {
    const isLoggedIn = useAuth.getState().user?.email
    return (
        <header className="sticky top-0 z-50 bg-blue-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">
                    <Link to={'/'}>OpenFile</Link>
                </h1>
                <nav className="space-x-4">
                    {
                        isLoggedIn ?
                            <Link to="/dashboard" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">Dashboard</Link>
                            :
                            <Link to="/auth" className="text-gray-600 hover:text-black">Login</Link>
                    }
                    {/* <Link to="/dashboard" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">Get Started</Link> */}
                </nav>
            </div>
        </header>
    )
}

export default React.memo(Header)