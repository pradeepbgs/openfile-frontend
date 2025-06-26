import React, { useEffect, useState } from 'react'
import { useLocation, useParams, useSearchParams } from 'react-router'
import { useUserFilesQuery } from '~/service/api'

function link() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") ?? "";

    const location = useLocation();
    const hashParams = new URLSearchParams(location.hash.slice(1));
    const key = hashParams.get("key") ?? "";
    const iv = hashParams.get("iv") ?? "";
    const { data, error, isLoading } = useUserFilesQuery(token);

    if (isLoading) return <p className="p-4">Loading files...</p>;
    if (error) return <p className="p-4 text-red-500">Error fetching files.</p>;
    if (!data?.files) return <p className="p-4 text-gray-500">No files available.</p>;

    const files = data?.files
    console.log(files)
    const decryptAndDownload = async (fileurl: string, filename: string, ivFromFile: string) => {
        try {
            const keyBytes = Uint8Array.from(atob(key), c => c.charCodeAt(0));
            const ivBytes = Uint8Array.from(atob(ivFromFile), c => c.charCodeAt(0));

            const awskey = new URL(fileurl).pathname.slice(1);
            const res = await fetch(`${import.meta.env.VITE_BACKEND_APP_URL}/api/v1/file/signed-url?key=${awskey}`);
            const data = await res.json();
            const fileRes = await fetch(data.url)
            const encryptedBuffer = await fileRes.arrayBuffer()

            const cryptoKey = await crypto.subtle.importKey(
                'raw',
                keyBytes,
                { name: 'AES-CBC' },
                false,
                ['decrypt']
            );

            const decrypedBuffer = await crypto.subtle.decrypt(
                { name: 'AES-CBC', iv: ivBytes },
                cryptoKey,
                encryptedBuffer
            )

            const blob = new Blob([decrypedBuffer])
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('encryption failed', error);
        }
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Encrypted Files</h1>
            {files?.length === 0 && <p>No files found for this link.</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {files?.map((file) => {
                    const filename = decodeURIComponent(file.url.split("/").pop() || "file.bin");
                    return (
                        <div key={file.id} className="border p-4 rounded-lg shadow space-y-2">
                            <p className="font-medium truncate">{filename}</p>
                            <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                            <button
                                className="w-full bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700"
                                onClick={() => decryptAndDownload(file.url, filename, file.iv)}
                            >
                                Decrypt & Download
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default link