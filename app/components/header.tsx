import React from 'react'
import { Link } from 'react-router'

function Header() {
    return (
        // {/* Header Placeholder   */}
        <header className="sticky top-0 z-50 bg-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">
                    <Link to={'/'}>DropFile</Link>
                </h1>
                <nav className="space-x-4">
                    <Link to="/auth" className="text-gray-600 hover:text-black">Login</Link>
                    <Link to="/dashboard" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">Get Started</Link>
                </nav>
            </div>
        </header>
    )
}

export default React.memo(Header)