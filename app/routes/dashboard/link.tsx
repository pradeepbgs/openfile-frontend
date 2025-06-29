import  { useState } from 'react'
import { useLocation,  useSearchParams } from 'react-router'
import type { FileItem } from 'types/types';
import { useUserFilesQuery } from '~/service/api'
import { decryptAndDownloadFile } from '~/utils/decrypt';

function link() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const [showMessage, setShowMessage] = useState('Decrypt & Download')

    const location = useLocation();
    const hashParams = new URLSearchParams(location.hash.slice(1));
    const key = hashParams.get("key") ?? "";
    const iv = hashParams.get("iv") ?? "";
    const { data, error, isLoading } = useUserFilesQuery(token);

    const files = data?.files

    if (isLoading) return <p className="p-4">Loading files...</p>;
    if (error) return <p className="p-4 text-red-500">Error fetching files.</p>;
    if (!data?.files) return <p className="p-4 text-gray-500">No files available.</p>;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Encrypted Files</h1>
            {files?.length === 0 && <p>No files found for this link.</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {files?.map((file: FileItem) => {
                    const filename = decodeURIComponent(file.url.split("/").pop() || "file.bin");
                    return (
                        <div key={file.id} className="border p-4 rounded-lg shadow space-y-2">
                            <p className="font-medium truncate">{filename}</p>
                            <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                            <button
                                className="w-full bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 cursor-pointer"
                                onClick={() => decryptAndDownloadFile(file.url, filename, file.iv,key)}
                            >
                                {
                                    showMessage
                                }
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default link