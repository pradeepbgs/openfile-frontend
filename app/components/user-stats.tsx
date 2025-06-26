import React from 'react'
import type { LinkItem } from 'types/types'

function UserStats({links}:{links:LinkItem[]}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                <h2 className="text-lg font-medium opacity-90 mb-2">Total Links</h2>
                <p className="text-4xl font-bold">{links.length}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                <h2 className="text-lg font-medium opacity-90 mb-2">Total Uploads</h2>
                <p className="text-4xl font-bold">
                    {links.reduce((sum, l) => sum + (l.uploadCount || 0), 0)}
                </p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                <h2 className="text-lg font-medium opacity-90 mb-2">Storage Used</h2>
                <p className="text-4xl font-bold">—</p>
            </div>
        </div>
    )
}

export default React.memo(UserStats)