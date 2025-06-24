import React from 'react'
import { Link } from 'react-router';


const recentLinks = [
  {
    id: "abc123",
    fileName: "resume.pdf",
    downloadCount: 42,
    expiresAt: "2025-08-01",
  },
  {
    id: "xyz456",
    fileName: "design.zip",
    downloadCount: 12,
    expiresAt: "2025-07-15",
  },
];

function profile() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>

      {/* CTA */}
      <Link
        to="/dashboard/"
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        + Create New Link
      </Link>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Links</h2>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Storage Used</h2>
          <p className="text-2xl font-bold">3.5 GB</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Downloads</h2>
          <p className="text-2xl font-bold">1.2K</p>
        </div>
      </div>

      {/* Recent Links */}
      <div>
        <h2 className="text-xl font-bold mt-8 mb-4">Recent Links</h2>
        <div className="bg-white border rounded-md shadow overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">File Name</th>
                <th className="px-4 py-2 text-left">Downloads</th>
                <th className="px-4 py-2 text-left">Expires</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentLinks.map((link) => (
                <tr key={link.id} className="border-t">
                  <td className="px-4 py-2">{link.fileName}</td>
                  <td className="px-4 py-2">{link.downloadCount}</td>
                  <td className="px-4 py-2">{link.expiresAt}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button className="text-blue-600 hover:underline">
                      Copy Link
                    </button>
                    <button className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default profile