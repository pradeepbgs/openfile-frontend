import React, { useState } from 'react'
import { FaCopy } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import type { LinkItem } from 'types/types';
import { formatDistanceToNow, isBefore } from 'date-fns';
import AlertMenu from './alert-menu';
import { IoMdRefresh } from "react-icons/io";

function UserLinks({ links, handleRefresh }: { links: LinkItem[], handleRefresh: () => void }) {
  const [spinning, setSpinning] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleCopyLink = (linkToCopy: string) => {
    navigator.clipboard.writeText(linkToCopy);
  };

  const route = (link: LinkItem) => {
    navigate(`/dashboard/link?token=${link.token}#key=${link.secretKey}&iv=${link.iv}`);
  };

  const handleLinkDelete = (id: number) => {
    // API call to delete the link
  };

  const handleRefreshLink = async () => {
    setSpinning(true)
    try {
      handleRefresh()
    } catch (error: any) {
      console.error("Refresh failed", error?.message)
    } finally {
      setTimeout(() => {
        setSpinning(false)
      }, 300);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Your Recent Links</h2>
      <div className="bg-[#1e1e2f] border border-neutral-700 rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-neutral-700">
          <thead className="bg-[#2a2b3d]">
            <tr>
              <th className="px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                <button
                  onClick={handleRefreshLink}
                  className="cursor-pointer mr-3 relative  hover:text-indigo-400 text-white"
                >
                  <IoMdRefresh
                    size={20}
                    className={`transition-transform duration-500 ${spinning ? 'animate-spin' : ''}`}
                  />
                </button>
                Link Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Uploads</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Expires</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700 text-white">
            {links.length > 0 ? (
              links.map((link: LinkItem) => {
                const fullLink = `${import.meta.env.VITE_UPLOAD_URL}?token=${link.token}#key=${encodeURIComponent(link.secretKey)}&iv=${encodeURIComponent(link.iv)}`;

                return (
                  <tr key={link.id} className="hover:bg-[#2a2b3d] transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <FaCopy
                          size={18}
                          className="text-gray-400 hover:text-indigo-400 cursor-pointer transition-colors duration-200"
                          onClick={() => handleCopyLink(fullLink)}
                          title="Copy link to clipboard"
                        />
                        <button
                          onClick={() => route(link)}
                          className="text-indigo-400 hover:text-indigo-300 text-sm truncate max-w-xs block"
                          rel="noopener noreferrer"
                          title={fullLink}
                        >
                          {fullLink.length > 50 ? `${fullLink.substring(0, 50)}...` : fullLink}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {link.uploadCount} / {link.maxUploads === 0 ? 'Unlimited' : link.maxUploads}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {link.expiresAt
                        ? isBefore(new Date(link.expiresAt), new Date())
                          ? `Expired ${formatDistanceToNow(new Date(link.expiresAt))} ago`
                          : `in ${formatDistanceToNow(new Date(link.expiresAt))}`
                        : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <AlertMenu onConfirm={() => handleLinkDelete(link.id)} />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-400 text-lg">
                  No links found. Click "Create New Link" to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default React.memo(UserLinks);
