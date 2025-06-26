export const encryptFile = async (
    file: File,
    keyBase64: string,
    ivBase64: string
): Promise<Blob> => {
    try {
        const keyBuffer = Uint8Array.from(atob(keyBase64), char => char.charCodeAt(0));
        const ivBuffer = Uint8Array.from(atob(ivBase64), char => char.charCodeAt(0));

        const cryptoKey = await crypto.subtle.importKey(
            "raw",
            keyBuffer,
            { name: "AES-CBC" },
            false,
            ["encrypt"]
        );

        const fileBuffer = await file.arrayBuffer();

        const encryptedBuffer = await crypto.subtle.encrypt(
            { name: "AES-CBC", iv: ivBuffer },
            cryptoKey,
            fileBuffer
        );

        return new File([encryptedBuffer], file.name, { type: file.type });

    } catch (error) {
        console.error("Error encrypting file:", error);
        throw error;
    }
};
