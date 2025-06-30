import { useState } from 'react'
import { useLocation, useSearchParams } from 'react-router'
import type { FileItem } from 'types/types';
import { useUserFilesQuery } from '~/service/api'
import { decryptAndDownloadFileWithCrypto } from '~/utils/encrypt-decrypt';
import { decryptAndDownloadFile2 } from '~/utils/generate-key';
import { useFileStatusStore } from '~/zustand/fileStatusStore';

function LinkPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const [showMessage, setShowMessage] = useState('Decrypt & Download')

    const location = useLocation();
    const hashParams = new URLSearchParams(location.hash.slice(1));
    const key = decodeURIComponent(hashParams.get("key") ?? "");
    const iv = decodeURIComponent(hashParams.get("iv") ?? "");

    const { data, error, isLoading } = useUserFilesQuery(token);
    const files = data?.files;

    if (isLoading) return <p className="p-4">Loading files...</p>;
    if (error) return <p className="p-4 text-red-500">Error fetching files.</p>;
    if (!files?.length) return <p className="p-4 text-gray-500">No files available.</p>;

    // const fileStatusMessages = useFileStatusStore((state) => state.fileStatusMessages);
    // console.log(fileStatusMessages)

    const decryptAndDownload = async () => {

    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Encrypted Files</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {files.map((file: FileItem) => {
                    const filename = decodeURIComponent(file.url.split("/").pop() || "file.bin");
                    // const currentMessage = fileStatusMessages[file.id] || 'Decrypt & Download';
                    return (
                        <div key={file.id} className="border p-4 rounded-lg shadow space-y-2">
                            <p className="font-medium truncate">{filename}</p>
                            <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                            <button
                                className="w-full bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 cursor-pointer"
                                onClick={() => decryptAndDownloadFileWithCrypto(file.url, filename, iv, key, token)}
                            >
                                {/* {currentMessage} */}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default LinkPage;
