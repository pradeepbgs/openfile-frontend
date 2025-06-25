import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
import Header from "~/components/header";
import { useUploadFilesMutation, useValidateTokenQuery } from "~/service/api";
import { useAuth } from "~/zustand/store";

function UploadPage() {
    const [key, setKey] = useState("");
    const [iv, setIV] = useState("");
    const [message, setMessage] = useState("");
    const [totalSize, setTotalSize] = useState(0);

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const user = useAuth.getState().user
    const isFreeUser = user?.plan === "FREE";

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
    } = useForm();

    const files = watch("files");

    const { isError, isLoading, error } = useValidateTokenQuery(token || "");

    const { mutate: uploadFiles, isPending, isSuccess, error: err } = useUploadFilesMutation()
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
        const maxTotalSize = isFreeUser ? 200 * 1024 * 1024 : Infinity;
        if (totalSize > maxTotalSize) {
            setMessage(`Free users can only upload up to 200MB. Your total is ${(totalSize / 1024 / 1024).toFixed(2)}MB.`);
            return;
        }

        const formData = new FormData();
        for (const file of files) {
            formData.append("files", file);
        }
        formData.append("key", key);
        formData.append("iv", iv);
        uploadFiles(
            { formData, iv, token },
        )
    };


    const extractHashParams = () => {
        try {
            const hashParams = new URLSearchParams(window.location.hash.slice(1));
            setKey(decodeURIComponent(hashParams.get("key") || ""));
            setIV(decodeURIComponent(hashParams.get("iv") || ""));
        } catch (error) {
            console.log("got error while extracting params from URL");
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
        const fileList = Array.from(files);
        for (const file of fileList) {
            size += file.size;
        }
        setTotalSize(size);
    }, [files]);


    if (isLoading) {
        return (
            <div className="text-center mt-20 text-gray-500 font-medium">
                Validating link...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center  bg-black w-full h-screen">
                <p className="py-20 text-red-500 font-semibold">
                    {
                        error.message ?? 'This link has expired or is invalid.'
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
                            <p className="text-sm text-gray-500">
                                {isFreeUser && "Free users can upload up to 200MB in total."}
                            </p>

                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Files</label>
                            <input
                                type="file"
                                multiple
                                {...register("files")}
                                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black rounded-sm"
                            />
                            {errors?.files && (
                                <p className="text-sm text-red-600 mt-1">{errors?.files?.message}</p>
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

                        {isSuccess && (
                            <p className="text-sm text-green-600 text-center">
                                All files uploaded successfully!
                            </p>
                        )}

                        {err && (
                            <p className="text-sm text-red-600 text-center">
                                {err instanceof Error ? err.message : "Something went wrong during upload."}
                            </p>
                        )}
                        {message && (
                            <p className="text-sm text-red-600 text-center">
                                {message}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={isPending || !files?.length}
                            className={`w-full text-center py-2 rounded text-white text-sm ${isPending || !files?.length
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-black hover:bg-gray-900"
                                }`}
                        >
                            {isPending ? "Uploading..." : "Upload Files"}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}

export default UploadPage;
