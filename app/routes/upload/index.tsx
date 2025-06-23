import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useSearchParams } from "react-router";

function UploadPage() {
    const [key, setKey] = useState("");
    const [iv, setIV] = useState("");
    const [message, setMessage] = useState("");

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        getValues,
        watch,
    } = useForm();

    // Watch file input separately since it's uncontrolled
    const files = watch("files");

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

        const formData = new FormData();
        Array.from(data.files).forEach((file: File) => {
            formData.append("file", file);
        });

        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_APP_URL}/api/v1/file?token=${token}`,
                {
                    method: "POST",
                    headers: {
                        "X-IV": iv,
                    },
                    credentials: "include",
                    body: formData,
                });

            const result = await res.json();
            if (!res.ok) {
                setMessage(result?.error || "Failed to upload.");
                return;
            }

            setMessage("Files uploaded successfully.");
        } catch {
            setMessage("Something went wrong.");
        }
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

    return (
        <div className="max-w-2xl mx-auto mt-12 px-4">
            <h1 className="text-2xl font-semibold text-center mb-6">Upload Encrypted Files</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="border border-gray-300 p-6 rounded-lg shadow-sm space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Files</label>
                        <input
                            type="file"
                            multiple
                            {...register("files")}
                            className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black rounded-sm"
                        />
                        {errors.files && (
                            <p className="text-sm text-red-600 mt-1">{errors.files.message}</p>
                        )}
                    </div>

                    <div>
                        {key && iv ? (
                            <p className="text-sm text-gray-500">Encryption Key and IV are loaded from the link.</p>
                        ) : (
                            <p className="text-sm text-red-500">Encryption key and IV not found in link.</p>
                        )}
                    </div>

                    {message && <p className="text-sm text-red-600 text-center">{message}</p>}

                    <button
                        type="submit"
                        disabled={isSubmitting || !files?.length}
                        className={`w-full text-center py-2 rounded text-white text-sm ${isSubmitting || !files?.length
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-black hover:bg-gray-900"
                            }`}
                    >
                        {isSubmitting ? "Uploading..." : "Upload Files"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UploadPage;
