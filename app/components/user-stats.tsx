import React from 'react'
import type { LinkItem } from 'types/types'

function UserStats({ links }: { links: LinkItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      <div className="bg-[#2a2b3d] text-white p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300">
        <h2 className="font-medium text-gray-300 mb-2">Total Links</h2>
        <p className="text-2xl font-bold">{links.length}</p>
      </div>
      <div className="bg-[#2a2b3d] text-white p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300">
        <h2 className="font-medium text-gray-300 mb-2">Total Uploads</h2>
        <p className="text-2xl font-bold">
          {links.reduce((sum, l) => sum + (l.uploadCount || 0), 0)}
        </p>
      </div>
      <div className="bg-[#2a2b3d] text-white p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300">
        <h2 className="font-medium text-gray-300 mb-2">Storage Used</h2>
        <p className="text-2xl font-bold">—</p>
      </div>
    </div>
  )
}

export default React.memo(UserStats)
