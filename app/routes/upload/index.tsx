import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
import Header from "~/components/header";
import {
  getUploadUrl,
  useUpdateS3UploadDB,
  useUploadS3Mutation,
  useValidateTokenQuery,
} from "~/service/api";
import { useAuth } from "~/zustand/store";
import Spinner from "~/components/spinner";
import { SelectedFilesList } from "~/components/selected-file";
import { useUploadStatusStore } from "~/zustand/upload-status-store";
import { CircleX } from "lucide-react";

const MAX_FREE_USER_UPLOAD_MB = import.meta.env.VIET_MAX_FREE_USER_UPLOAD_MB ?? 20 as number;



function UploadPage() {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const key = hashParams.get("key") || ""
  const iv = hashParams.get("iv") || ""

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [totalSize, setTotalSize] = useState<number>(0);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const user = useAuth.getState().user;
  const isFreeUser = user?.subscription?.planName === "free";

  const {
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const files = selectedFiles

  const {
    isError: isTokenInvalid,
    isLoading: isTokenValidating,
    error: tokenValidationError,
  } = useValidateTokenQuery(token || "");

  const { mutateAsync: uploadFilesMutation, isPending: isUploading } = useUploadS3Mutation();

  const { mutateAsync: UpdateDbS3 } = useUpdateS3UploadDB();
  const { addFile, updateStatus, setError } = useUploadStatusStore.getState();
  const fileStatusList = useUploadStatusStore((state) => state.uploads);

  useEffect(() => {
    if (!files || files.length === 0) {
      setTotalSize(0);
      return;
    }

    let size = 0;
    const existingStatus = useUploadStatusStore.getState().uploads;

    selectedFiles.forEach((file) => {
      size += file.size

      const existingFile = existingStatus.find((f) => f.name === file.name)
      if (!existingFile) {
        addFile({ id: file.name, name: file.name, progress: 0, status: "pending" });
      }

    });

    setTotalSize(size);

  }, [selectedFiles]);

  const onSubmit = async (data: any) => {
    setIsProcessing(true);
    setErrorMessage("");

    if (!selectedFiles || selectedFiles.length === 0) {
      setErrorMessage("Please select at least one file.");
      return;
    }

    if (!key || !iv) {
      setErrorMessage("Missing encryption key or IV.");
      setIsProcessing(false);
      return;
    }

    const maxTotalSize = isFreeUser ? MAX_FREE_USER_UPLOAD_MB * 1024 * 1024 : Infinity;

    if (totalSize > maxTotalSize) {
      setErrorMessage(
        `can only upload up to 200MB. Your total is ${(totalSize / 1024 / 1024).toFixed(2)}MB.`
      );
      setIsProcessing(false)
      return;
    }

    const worker = new Worker(
      new URL("../../utils/encryptWorker.ts", import.meta.url),
      { type: "module" }
    );

    const encryptFileWithWorker = (file: File, secretKey: string, iv: string): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        worker.postMessage({ file, secretKey, iv });

        worker.onerror = (err) => reject("Worker error: " + err.message);
        worker.onmessage = (event) => {
          event.data.error ? reject(event.data.error) : resolve(event.data);
        };
      });
    };

    try {

      for (const file of files) {
        const status = fileStatusList.find((f) => f.name === file.name);
        if (status?.status === "done") continue;

        try {
          const mimeType = file.type || 'application/octet-stream';
          const { url, key: s3Key } = await getUploadUrl(mimeType, token, file.size);
          const encryptedBlob = await encryptFileWithWorker(file, key, iv);
          const encryptedFile = new File([encryptedBlob], file.name, { type: file.type });

          await uploadFilesMutation({ encryptFile: encryptedBlob, type: mimeType, url, name: file.name });
          await UpdateDbS3({ s3Key, size: encryptedFile.size, token, filename: file.name });

          updateStatus(file.name, "done");
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          setError(file.name, message ?? "error while upload this file");
        }

      }
    } catch (error) {
      console.error("Upload process failed:", error);
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(`Upload failed: ${message}`);
    } finally {
      worker.terminate();
      setIsProcessing(false);
    }
  }




  if (!token)
    return (
      <div className="text-center mt-20 text-red-500 font-semibold">
        No token found. Please check your link again.
      </div>
    );


  if (isTokenValidating)
    return <div className="text-center bg-black w-ful h-screen text-gray-100">
      <Spinner size={20} color="white" />
    </div>;

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
    <div className="text-white min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Header />

      <div className={`mx-auto py-12 px-4 ${totalSize > 0 ? 'md:flex md:justify-center md:items-center max-w-6xl' : 'max-w-2xl'} md:gap-6 md:items-start`}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full md:w-1/2">
          <h1 className="text-2xl font-semibold text-center mb-6">Upload Files</h1>
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-xl space-y-6 text-white backdrop-blur-md">
            {isFreeUser && (
              <p className="text-sm text-gray-400">
                Free users can upload up to {MAX_FREE_USER_UPLOAD_MB}MB in total.
              </p>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Select Files</label>
              <input
                type="file"
                multiple
                onChange={(e) => {
                  const newFiles = Array.from(e.target.files || []);
                  setSelectedFiles((prev) => [...prev, ...newFiles]);
                }}

                className="w-full bg-white/10 text-white border border-white/10 px-3 py-2 text-sm rounded-md file:border-0 file:bg-gray-700 file:text-white hover:border-white/20"
              />
              {errors.files && (
                <p className="text-sm text-red-400 mt-1">
                  {(errors.files as any).message || "Please select at least one file."}
                </p>
              )}
            </div>

            <p className="text-sm text-gray-400">
              Total size: {(totalSize / 1024 / 1024).toFixed(2)} MB
            </p>

            {/* {!errorMessage && isUploadSuccess && (
              <p className="text-sm text-green-400 text-center">All files uploaded successfully!</p>
            )} */}

            {errorMessage && (
              <p className="text-sm text-red-400 text-center">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={isUploading || !files?.length}
              className={`relative w-full text-sm rounded-md overflow-hidden border border-white/10 transition duration-300 ${isUploading || !files?.length
                ? "bg-white/10 cursor-not-allowed text-white/50"
                : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
            >
              {/* {isUploading && (
                <div
                  className="absolute top-0 left-0 h-full bg-green-600 transition-all duration-300 z-0"
                  style={{ width: `${progress}%` }}
                />
              )} */}
              <span className="relative z-10 block w-full text-center py-2">
                {isProcessing ? <Spinner size={16} color="white" /> : "Upload"}
              </span>

            </button>
          </div>
        </form>

        {files.length > 0 && (
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl w-full max-h-[30rem] overflow-auto space-y-3 mt-5 md:mt-0 md:w-1/2">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-white text-lg font-medium">Selected Files</h2>
              <CircleX
                onClick={() => { setSelectedFiles([]); reset() }}
              />
            </div>
            <SelectedFilesList files={files} />
          </div>
        )}


      </div>

    </div>

  );
}

export default UploadPage;
