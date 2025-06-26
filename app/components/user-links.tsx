import React from 'react'
import { FaCopy } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router';
import type { LinkItem } from 'types/types';


function UserLinks({ links }: { links: LinkItem[] }) {

    const navigate = useNavigate()

    const handleCopyLink = (linkToCopy: string) => {
        navigator.clipboard.writeText(linkToCopy);
    };

    const route = (link:LinkItem) => {
        navigate(`/dashboard/link?token=${link.token}#key=${link.secretKey}&iv=${link.iv}`)
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Recent Links</h2>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link Details</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploads</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {links.length > 0 ? (
                            links.map((link: LinkItem) => {
                                const fullLink = `${import.meta.env.VITE_UPLOAD_URL}?token=${link.token}#key=${encodeURIComponent(
                                    link.secretKey
                                )}&iv=${encodeURIComponent(link.iv)}`;

                                return (
                                    <tr key={link.id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-3">
                                                <FaCopy
                                                    size={18}
                                                    className="text-gray-500 hover:text-blue-600 cursor-pointer transition-colors duration-200"
                                                    onClick={() => handleCopyLink(fullLink)}
                                                    title="Copy link to clipboard"
                                                />
                                                <button
                                                    onClick={() => route(link)}
                                                    className="text-blue-600 hover:text-blue-800 text-sm truncate max-w-xs block"
                                                    rel="noopener noreferrer"
                                                    title={fullLink}
                                                >
                                                    {fullLink.length > 50 ? `${fullLink.substring(0, 50)}...` : fullLink}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {link.uploadCount} / {link.maxUploads === 0 ? 'Unlimited' : link.maxUploads}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {link.expiresAt ? link.expiresAt : 'Never'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button className="text-red-600 hover:text-red-900 transition-colors duration-200" onClick={() => {/* Add delete logic here */ }}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-gray-500 text-lg">
                                    No links found. Click "Create New Link" to get started!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default React.memo(UserLinks)