import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
import type { FileItem } from "types/types";
import Header from "~/components/header";
import {
  getUploadUrl,
  useUpdateS3UploadDB,
  useUploadS3Mutation,
  useValidateTokenQuery,
} from "~/service/api";
import { useUploadProgressStore } from "~/zustand/progress-store";
import { useAuth } from "~/zustand/store";

const MAX_FREE_USER_UPLOAD_MB = import.meta.env.VIET_MAX_FREE_USER_UPLOAD_MB ?? 200 as number;

function UploadPage() {
  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const key = decodeURIComponent(hashParams.get("key") || "");
  const iv = decodeURIComponent(hashParams.get("iv") || "");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [totalSize, setTotalSize] = useState<number>(0);
  const [displayProgressMessage, setDisplayProgressMessage] = useState<string>("Upload Files");

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const user = useAuth.getState().user;
  const isFreeUser = user?.plan === "free";

  const progress = useUploadProgressStore((state) => state.progress);

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
    error: tokenValidationError,
  } = useValidateTokenQuery(token || "", key, iv);

  const { mutateAsync: uploadFilesMutation, isPending: isUploading, isSuccess: isUploadSuccess } =
    useUploadS3Mutation();

  const { mutateAsync: UpdateDbS3 } = useUpdateS3UploadDB();

  useEffect(() => {
    if (!files || files.length === 0) {
      setTotalSize(0);
      return;
    }

    let size = 0;
    const fileList: FileItem[] = Array.from(files);
    for (const file of fileList) size += file.size;
    setTotalSize(size);
  }, [files]);

  const onSubmit = async (data: any) => {
    setErrorMessage("");

    if (!data.files || data.files.length === 0) {
      setErrorMessage("Please select at least one file.");
      return;
    }

    if (!key || !iv) {
      setErrorMessage("Missing encryption key or IV.");
      return;
    }

    const files: File[] = Array.from(data.files);
    const maxTotalSize = isFreeUser ? MAX_FREE_USER_UPLOAD_MB * 1024 * 1024 : Infinity;

    if (totalSize > maxTotalSize) {
      setErrorMessage(
        `Free users can only upload up to 200MB. Your total is ${(totalSize / 1024 / 1024).toFixed(2)}MB.`
      );
      return;
    }

    // create a worker
    const worker = new Worker(
      new URL("../../utils/encryptWorker.ts", import.meta.url),
      { type: "module" }
    );

    const encryptFileWithWorker = (file: File, secretKey: string, iv: string): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        worker.postMessage({ file, secretKey, iv });

        worker.onerror = (err) => {
          reject("Worker error: " + err.message);
        };

        worker.onmessage = (event) => {
          if (event.data.error) {
            reject(event.data.error);
          } else {
            resolve(event.data);
          }
        };
      })
    }

    try {
      for (const file of files) {
        setDisplayProgressMessage("Getting pre-signed upload URL...");
        const { url, key: s3Key, secretKey } = await getUploadUrl(file.type, token);

        setDisplayProgressMessage(`Encrypting ${file.name}...`);
        const encryptedBlob = await encryptFileWithWorker(file, secretKey, iv);

        const encryptedFile = new File([encryptedBlob], file.name, {
          type: file.type,
        });

        setDisplayProgressMessage(`Uploading ${file.name}...`);
        await uploadFilesMutation({ encryptFile: encryptedBlob, type: file.type, url });

        setDisplayProgressMessage(`Updating database for ${file.name}...`);
        await UpdateDbS3({ iv, s3Key, size: encryptedFile.size, token, filename: file.name });
      }

      setDisplayProgressMessage("All files uploaded successfully!");
    } catch (error) {
      console.error("Upload process failed:", error);
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(`Upload failed: ${message}`);
    } finally {
      worker.terminate();
      setDisplayProgressMessage("Upload Files");
      useUploadProgressStore.getState().resetProgress();
    }
  }

  if (!token)
    return (
      <div className="text-center mt-20 text-red-500 font-semibold">
        No token found. Please check your link again.
      </div>
    );


  if (isTokenValidating) return <div className="text-center mt-20 text-gray-100">Validating link...</div>;

  if (isTokenInvalid) {
    return (
      <div className="text-center bg-black w-full h-screen flex justify-center items-center">
        <p className="text-red-500 text-lg font-medium">
          {tokenValidationError.message ?? "This link has expired or is invalid."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] text-white min-h-screen">
      <Header />
      <div className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-2xl font-semibold text-center mb-6">Upload Encrypted Files</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-[#1f1f1f] border border-[#2c2c2c] p-6 rounded-lg shadow-md space-y-6">
            {isFreeUser && (
              <p className="text-sm text-gray-400">
                Free users can upload up to {MAX_FREE_USER_UPLOAD_MB}MB in total.
              </p>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Select Files</label>
              <input
                type="file"
                multiple
                {...register("files")}
                className="w-full bg-black text-white border border-gray-600 px-3 py-2 text-sm rounded-md file:border-0 file:bg-gray-800 file:text-white"
              />
              {errors.files && (
                <p className="text-sm text-red-500 mt-1">
                  {(errors.files as any).message || "Please select at least one file."}
                </p>
              )}
            </div>

            <p className="text-sm text-gray-400">
              Total size: {(totalSize / 1024 / 1024).toFixed(2)} MB
            </p>

            <div>
              {key && iv ? (
                <p className="text-sm text-green-400">Encryption Key and IV loaded from URL.</p>
              ) : (
                <p className="text-sm text-red-500">Missing encryption key or IV in the link.</p>
              )}
            </div>

            {!errorMessage && isUploadSuccess && (
              <p className="text-sm text-green-500 text-center">All files uploaded successfully!</p>
            )}

            {errorMessage && (
              <p className="text-sm text-red-500 text-center">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={isUploading || !files?.length}
              className={`relative w-full text-sm rounded text-white overflow-hidden border border-gray-600 transition ${isUploading || !files?.length
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
                }`}
            >
              {
                isUploading && (
                  <div
                    className="absolute top-0 left-0 h-full bg-green-600 transition-all duration-300 z-0"
                    style={{ width: `${progress}%` }} >
                  </div>
                )
              }

              <span className="relative z-10 block w-full text-center py-2">
                {isUploading ? `Uploading... ${progress}%` : displayProgressMessage}
              </span>

            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default UploadPage;
