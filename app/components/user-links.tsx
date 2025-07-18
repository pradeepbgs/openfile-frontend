import React, { useEffect, useState } from 'react'
import { FaCopy } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router';
import type { LinkItem } from 'types/types';
import { formatDistanceToNow, isBefore } from 'date-fns';
import AlertMenu from './alert-menu';
import { IoMdRefresh } from "react-icons/io";
import { useDeleteLink } from '~/service/api';
import { getCryptoSecret } from '~/utils/crypto-store';
import { FaLink } from "react-icons/fa6";
import { toast } from "sonner"

function UserLinks({ links, handleRefresh }: { links: LinkItem[], handleRefresh: () => void }) {
  const [spinning, setSpinning] = useState<boolean>(false);
  const [secretsMap, setSecretsMap] = useState<Record<string, { key: string, iv: string }>>({});

  const navigate = useNavigate();

  const handleCopyLink = (linkToCopy: string) => {
    navigator.clipboard.writeText(linkToCopy);
    toast("copied to clipboard")
  };

  const route = (token: string, secret: { key: string, iv: string }) => {
    navigate(`/dashboard/link?token=${token}#key=${secret?.key}&iv=${secret?.iv}`);
  };

  const { mutateAsync: deleteLink, isError, error, isSuccess, } = useDeleteLink()
  const handleLinkDelete = async (id: number) => {
    await deleteLink(id)
    toast("link deleted")
    handleRefresh()
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

  useEffect(() => {
    const loadSecrets = async () => {
      const newSecrets: Record<string, { key: string, iv: string }> = {};
      for (const link of links) {
        const secret = await getCryptoSecret(link.token);
        if (secret) {
          newSecrets[link.token] = secret;
        }
      }
      setSecretsMap(newSecrets);
    }
    loadSecrets()
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Recent Links</h2>
      <div className="bg-[#1e1e2f] border border-neutral-700 rounded-lg shadow-md overflow-x-auto">
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
                const secret = secretsMap[link.token];
                const fullLink = `${import.meta.env.VITE_UPLOAD_URL}?token=${link.token}#key=${secret?.key}&iv=${secret?.iv}`;

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
                        <Link 
                        to={fullLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        >
                          <FaLink
                            color='blue'
                            cursor={'pointer'}
                            // onClick={() => }
                            size={18}
                          />
                        </Link>

                        <button
                          onClick={() => route(link.token, secret)}
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
                <td colSpan={4} className="px-6 py-5 text-center text-gray-200 text-lg">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className='bg-blue-700 hover:bg-blue-600 px-2 py-1 rounded-md cursor-pointer'>Create new Link</button>
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
