import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useUserFilesQuery } from '~/service/api';
import { decryptAndDownloadFileWithCrypto } from '~/utils/encrypt-decrypt';
import { useFileStatusStore } from '~/zustand/fileStatusStore';
import type { FileItem } from 'types/types';
import { FileCard } from '~/components/file-card';

function LinkPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const [decryptingFileId, setDecryptingFileId] = useState<number | null>(null);

    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const key = hashParams.get("key") || "";
    const { data, error, isLoading } = useUserFilesQuery(token, key);
    const files = data?.files;
    const msg = useFileStatusStore.getState().fileStatusMessages;

    if (isLoading) return <p className="p-4">Loading files...</p>;
    if (error) return <p className="p-4 text-red-500">Error fetching files.</p>;
    if (!files?.length) return <p className="p-4 text-gray-500">No files available.</p>;

    const handleDecryptDownload = async (file: FileItem) => {
        setDecryptingFileId(file.id);
        try {
            // const fileName = decodeURIComponent(file.url.split('/').pop() || "file.bin");
            await decryptAndDownloadFileWithCrypto(file, file.name, token, key);
        } finally {
            setDecryptingFileId(null);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Encrypted Files</h1>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {files.map((file: FileItem) => (
                    <FileCard
                        key={file.id}
                        file={file}
                        onDownload={() => handleDecryptDownload(file)}
                        isDecrypting={decryptingFileId === file.id}
                        decryptMsg={msg}
                    />
                ))}
            </div>
        </div>
    );
}

export default LinkPage;
