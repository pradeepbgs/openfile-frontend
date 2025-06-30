
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
    const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedKey)));

    const iv = crypto.getRandomValues(new Uint8Array(16));
    const ivBase64 = btoa(String.fromCharCode(...iv));

    return { key: keyBase64, iv: ivBase64 };
};


export const encryptFileWithWebCrypto = async (
    file: File,
    base64Key: string,
    base64IV: string
) => {
    const keyBytes = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));
    const ivBytes = Uint8Array.from(atob(base64IV), c => c.charCodeAt(0));

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
    fileUrl: string,
    fileName: string,
    iv: string,
    key: string,
    token:string
) => {
    try {
        const awskey = new URL(fileUrl).pathname.slice(1);
        const download_url = await fetch(
            `${import.meta.env.VITE_BACKEND_APP_URL}/api/v1/file/signed-url?key=${awskey}&token=${token}`,
            {
                credentials:'include'
            }
        );
        const data = await download_url.json();
        const res = await fetch(data.url);
        const encryptedBuffer = await res.arrayBuffer()

        const decryptedBlob = await decryptFileWithWebCrypto(encryptedBuffer, data.link.secretKey, data.link.iv);

        const link = document.createElement("a");
        link.href = URL.createObjectURL(decryptedBlob);
        link.download = fileName;
        link.click();
    } catch (error) {
        console.error("Error during decryption/download:", error);
    }
};
export const decryptFileWithWebCrypto = async (
    encryptedData: ArrayBuffer,
    base64Key: string,
    base64IV: string
): Promise<Blob> => {
    const keyBytes = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));
    const ivBytes = Uint8Array.from(atob(base64IV), c => c.charCodeAt(0));
    
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
