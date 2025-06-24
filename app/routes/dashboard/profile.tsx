import React from "react";
import { FaCopy } from "react-icons/fa";
import { Link } from "react-router"; // fixed!
import { useUserLinksQuery } from "~/service/api";

interface Link {
  id: string;
  iv: string;
  maxUploads: number;
  secretKey: number;
  token: string
  uploadCount: number;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

function Profile() {
  const { data, isLoading, error } = useUserLinksQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading links</p>;

  const links: Link[] = data?.links || [];

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
          <p className="text-2xl font-bold">{links.length}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Storage Used</h2>
          <p className="text-2xl font-bold">—</p>
        </div>
        {/* <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Downloads</h2>
          <p className="text-2xl font-bold">
            {links.reduce((sum, l) => sum + (l.uploadCount || 0), 0)}
          </p>
        </div> */}
      </div>

      {/* Recent Links */}
      <div>
        <h2 className="text-xl font-bold mt-8 mb-4">Recent Links</h2>
        <div className="bg-white border rounded-md shadow overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Link</th>
                {/* <th className="px-4 py-2 text-left">Downloads</th> */}
                <th className="px-4 py-2 text-left">Expires</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link: Link) => {
                const fullLink = `${import.meta.env.VITE_UPLOAD_URL}?token=${link.token}#key=${encodeURIComponent(
                  link.secretKey
                )}&iv=${encodeURIComponent(link.iv)}`;

                return (
                  <tr key={link.id} className="border-t">
                    <td className="flex space-x-2 px-4 py-2">
                      <FaCopy
                        size={20}
                        className="cursor-pointer text-gray-600 hover:text-black"
                        onClick={() => {
                          navigator.clipboard.writeText(link.link);
                        }}
                      />
                      <a
                        href={fullLink}
                        className="text-blue-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {
                          fullLink
                        }
                      </a>
                    </td>
                    <td className="px-4 py-2">
                      {new Date(link.expiresAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button className="text-red-600 hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {links.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                    No links found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Profile;
