import React from 'react'
import type { LinkItem } from 'types/types'
import {filesize} from 'filesize'
import Spinner from './spinner'

function UserStats(
  {
    links,
    storageUsed,
    storageUsedLoading,
    storageUsedError
  }: {
    links: LinkItem[],
    storageUsed: number,
    storageUsedLoading: boolean,
    storageUsedError: Error | null
  }
) {
  const totalUploads = links.reduce((sum, l) => sum + (l.uploadCount || 0), 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      <StatCard label="Total Links" value={links.length} />

      <StatCard label="Total Uploads" value={totalUploads} />

      <div className="bg-[#2a2b3d] text-white p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300">
        <h2 className="font-medium text-gray-300 mb-2">Storage Used</h2>
        <div className="text-2xl font-bold">
          {storageUsedLoading ? (
            <Spinner  />
          ) : storageUsedError ? (
            <span className="text-red-500">Error</span>
          ) : (
            filesize(storageUsed)
          )}
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ label, value }: { label: string, value: React.ReactNode }) => (
  <div className="bg-[#2a2b3d] text-white p-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300">
    <h2 className="font-medium text-gray-300 mb-2">{label}</h2>
    <p className="text-2xl font-bold">{value}</p>
  </div>
)

export default React.memo(UserStats)
