import type { FileItem } from "types/types";
import { useFileStatusStore } from "~/zustand/fileStatusStore";

const toBase64URL = (bytes: Uint8Array): string => {
    const base64 = btoa(String.fromCharCode(...bytes));
    return base64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};

const base64UrlToBase64 = (base64url: string): string => {
    let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
        base64 += '=';
    }
    return base64;
};



export const generateKeyAndIVWithWebCrypto = async (): Promise<{ key: string; iv: string }> => {

    const key = await crypto.subtle.generateKey(
        {
            name: "AES-CBC",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );

    const exportedKey = await crypto.subtle.exportKey("raw", key);
    const keyBase64URL = toBase64URL(new Uint8Array(exportedKey));

    const iv = crypto.getRandomValues(new Uint8Array(16));
    const ivBase64URL = toBase64URL(iv);

    return { key: keyBase64URL, iv: ivBase64URL };
};


export const encryptFileWithWebCrypto = async (
    file: File,
    base64Key: string,
    base64IV: string
) => {
    const keyBytes = Uint8Array.from(atob(base64UrlToBase64(base64Key)), c => c.charCodeAt(0));
    const ivBytes = Uint8Array.from(atob(base64UrlToBase64(base64IV)), c => c.charCodeAt(0));

    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        { name: "AES-CBC" },
        false,
        ["encrypt"]
    );

    const fileBuffer = await file.arrayBuffer();

    const encryptedBuffer = await crypto.subtle.encrypt(
        { name: "AES-CBC", iv: ivBytes },
        cryptoKey,
        fileBuffer
    );

    return new File([encryptedBuffer], file.name, { type: file.type });
};


export const decryptAndDownloadFileWithCrypto = async (
    file: FileItem,
    fileName: string,
    token: string,
    key: string
) => {
    try {
        const awskey = new URL(file?.url).pathname.slice(1);
        useFileStatusStore.getState().updateFileStatus('getting signed URL..')
        const download_url = await fetch(
            `${import.meta.env.VITE_BACKEND_APP_URL}/api/v1/file/signed-url?s3key=${awskey}&token=${token}&secretKey=${key}&fileId=${file.id}`,
            {
                credentials: 'include'
            }
        );
        useFileStatusStore.getState().updateFileStatus("downloading files...")
        const data = await download_url.json();

        const res = await fetch(data.url);
        const encryptedBuffer = await res.arrayBuffer()
        useFileStatusStore.getState().updateFileStatus("decrypting files...")
        const decryptedBlob = await decryptFileWithWebCrypto(encryptedBuffer, data.file.secretKey, data.file.iv);

        const link = document.createElement("a");
        link.href = URL.createObjectURL(decryptedBlob);
        link.download = fileName;
        link.click();
    } catch (error) {
        console.error("Error during decryption/download:", error);
    } finally {
        useFileStatusStore.getState().updateFileStatus("Decrypt & Download file")
    }
};
export const decryptFileWithWebCrypto = async (
    encryptedData: ArrayBuffer,
    base64Key: string,
    base64IV: string
): Promise<Blob> => {
    const keyBytes = Uint8Array.from(atob(base64UrlToBase64(base64Key)), c => c.charCodeAt(0));
    const ivBytes = Uint8Array.from(atob(base64UrlToBase64(base64IV)), c => c.charCodeAt(0));

    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        { name: "AES-CBC" },
        false,
        ["decrypt"]
    );

    const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-CBC", iv: ivBytes },
        cryptoKey,
        encryptedData
    );

    return new Blob([decryptedBuffer]);
};
