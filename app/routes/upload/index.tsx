import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
import type { FileItem } from "types/types";
import Header from "~/components/header";
import {
    getUploadUrl,
    useUpdateS3UploadDB,
    useUploadS3Mutation,
    useValidateTokenQuery
} from "~/service/api";
import { encryptFileWithWebCrypto } from "~/utils/encrypt-decrypt";
import { useAuth } from "~/zustand/store";

const MAX_FREE_USER_UPLOAD_MB = import.meta.env.VIET_MAX_FREE_USER_UPLOAD_MB ?? 200 as number;

function UploadPage() {
    const [key, setKey] = useState<string>("");
    const [iv, setIV] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [totalSize, setTotalSize] = useState<number>(0);
    const [displayProgressMessage, setDisplayProgressMessage] = useState<string>('Upload Files');

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    if (!token) {
        return (
            <div className="text-center mt-20 text-red-500 font-semibold">
                No token found. Please check your link again.
            </div>
        );
    }

    const user = useAuth.getState().user
    const isFreeUser = user?.plan === "FREE";

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();

    const files = watch("files");

    const {
        isError: isTokenInvalid,
        isLoading: isTokenValidating,
        error: tokenValidationError
    } = useValidateTokenQuery(token || "");

    const {
        mutateAsync: uploadFilesMutation,
        isPending: isUploading,
        isSuccess: isUploadSuccess,
        error: uploadError
    } = useUploadS3Mutation()

    const { mutateAsync: UpdateDbS3 } = useUpdateS3UploadDB()

    const extractHashParams = useCallback(() => {
        try {
            const hashParams = new URLSearchParams(window.location.hash.slice(1));
            setKey(decodeURIComponent(hashParams.get("key") || ""));
            setIV(decodeURIComponent(hashParams.get("iv") || ""));
        } catch (error) {
            console.error("Error extracting hash parameters from URL:", error);
            setMessage("Failed to load encryption details from URL.");
        }
    }, []);

    const onSubmit = async (data: any) => {
        setMessage("");
        if (!data.files || data.files.length === 0) {
            setMessage("Please select at least one file.");
            return;
        }
        if (!key || !iv) {
            setMessage("Missing encryption key or IV.");
            return;
        }

        const files: File[] = Array.from(data.files);
        const maxTotalSize = isFreeUser ? MAX_FREE_USER_UPLOAD_MB * 1024 * 1024 : Infinity;
        if (totalSize > maxTotalSize) {
            setMessage(`Free users can only upload up to 200MB. Your total is ${(totalSize / 1024 / 1024).toFixed(2)}MB.`);
            return;
        }

        setDisplayProgressMessage('getting pre-signed upload URL...')
        for (const file of files) {
            try {
                const { url, key: s3Key, secretKey, iv: ivKey } = await getUploadUrl(file.type, token);

                setDisplayProgressMessage(`Encrypting ${file.name}...`);
                const encryptedBlob = await encryptFileWithWebCrypto(file, secretKey, ivKey);
                const encryptedFile = new File([encryptedBlob], file.name, {
                    type: file.type,
                });

                setDisplayProgressMessage(`Uploading ${file.name}...`);
                await uploadFilesMutation({ encryptFile: encryptedBlob, type: file.type, url })

                setDisplayProgressMessage(`Updating database for ${file.name}...`);
                await UpdateDbS3({ iv, s3Key, size: encryptedFile.size, token , filename:file.name })

                setMessage("All files uploaded successfully!");
            } catch (error) {
                console.error("Upload process failed:", error);
                const errorMessage = (error instanceof Error) ? error.message : "An unexpected error occurred.";
                setMessage(`Upload failed: ${errorMessage}. Please try again.`);
            }
            finally {
                setDisplayProgressMessage("Upload Files");
            }
        }
    };


    useEffect(() => {
        extractHashParams();
        window.addEventListener("hashchange", extractHashParams);
        return () => window.removeEventListener("hashchange", extractHashParams);
    }, []);


    useEffect(() => {
        if (!files || files.length === 0) {
            setTotalSize(0);
            return;
        }

        let size = 0;
        const fileList: FileItem[] = Array.from(files);
        for (const file of fileList) {
            size += file.size;
        }
        setTotalSize(size);
    }, [files]);


    if (isTokenValidating) {
        return (
            <div className="text-center mt-20 text-gray-500 font-medium">
                Validating link...
            </div>
        );
    }

    if (isTokenInvalid) {
        return (
            <div className="text-center  bg-black w-full h-screen">
                <p className="py-20 text-red-500 font-semibold">
                    {
                        tokenValidationError.message ?? 'This link has expired or is invalid.'
                    }
                </p>
            </div>
        );
    }
    
    return (
        <div className="bg-gray-200 min-h-screen text-black">
            <Header />
            <div className="max-w-2xl mx-auto py-12 px-4">

                <h1 className="text-2xl font-semibold text-center mb-6">Upload Encrypted Files</h1>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="border border-gray-300 p-6 rounded-lg shadow-sm space-y-6">
                        <div>
                            {isFreeUser && (
                                <p className="text-sm text-gray-500 mb-2">
                                    Free users can upload up to {MAX_FREE_USER_UPLOAD_MB}MB in total.
                                </p>
                            )}

                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Files</label>
                            <input
                                type="file"
                                multiple
                                {...register("files")}
                                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black rounded-sm"
                            />
                            {errors.files && (
                                <p className="text-sm text-red-600 mt-1">
                                    {(errors.files as any).message || "Please select at least one file."}
                                </p>
                            )}
                        </div>
                        <p className="text-sm text-gray-500">
                            Total size: {(totalSize / (1024 * 1024)).toFixed(2)} MB
                        </p>


                        <div>
                            {key && iv ? (
                                <p className="text-sm text-gray-500">Encryption Key and IV are loaded from the link.</p>
                            ) : (
                                <p className="text-sm text-red-500">Encryption key and IV not found in link.</p>
                            )}
                        </div>

                        {isUploadSuccess && (
                            <p className="text-sm text-green-600 text-center">
                                All files uploaded successfully!
                            </p>
                        )}

                        {uploadError && (
                            <p className="text-sm text-red-600 text-center">
                                {uploadError instanceof Error ? uploadError.message : "Something went wrong during upload."}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isUploading || !files?.length}
                            className={`w-full cursor-pointer text-center py-2 rounded text-white text-sm ${isUploading || !files?.length
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-black hover:bg-gray-900"
                                }`}
                        >
                            {displayProgressMessage}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}

export default UploadPage;
