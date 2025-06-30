import { useState } from 'react';
import { useSearchParams } from 'react-router';
import type { FileItem } from 'types/types';
import { useUserFilesQuery } from '~/service/api';
import { decryptAndDownloadFileWithCrypto } from '~/utils/encrypt-decrypt';
import { useFileStatusStore } from '~/zustand/fileStatusStore';

function LinkPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const [decryptingFileId, setDecryptingFileId] = useState<number | null>(null);

    const { data, error, isLoading } = useUserFilesQuery(token);
    const files = data?.files;

    if (isLoading) return <p className="p-4">Loading files...</p>;
    if (error) return <p className="p-4 text-red-500">Error fetching files.</p>;
    if (!files?.length) return <p className="p-4 text-gray-500">No files available.</p>;

    const handleDecryptDownload = async (file: FileItem) => {
        setDecryptingFileId(file.id);
        try {
            await decryptAndDownloadFileWithCrypto(file.url, decodeURIComponent(file.url.split('/').pop() || "file.bin"), token);
        } finally {
            setDecryptingFileId(null);
        }
    };

    const msg = useFileStatusStore.getState().fileStatusMessages
    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Encrypted Files</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {files.map((file: FileItem) => {
                    const isDecrypting = decryptingFileId === file.id;

                    return (
                        <div key={file.id} className="border p-4 rounded-lg shadow space-y-2">
                            <p className="font-medium truncate">{file.name}</p>
                            <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                            <button
                                className="w-full bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 cursor-pointer"
                                onClick={() => handleDecryptDownload(file)}
                                disabled={isDecrypting}
                            >
                                {isDecrypting ? msg : 'Decrypt & Download'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default LinkPage;
