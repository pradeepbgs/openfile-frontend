import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FaCopy } from "react-icons/fa";
import { downloadKeyFile } from "~/utils/dowload-key";
import { useAuth } from "~/zustand/store";
import { useNavigate } from "react-router";

export const createLinkSchema = z.object({
  maxUploads: z.number({ required_error: "Max uploads is required" }).min(1),
  allowedFileType: z.array(z.string()).optional(),
  expiresAt: z.string().datetime().optional(),
  secretKey: z.string().min(1),
  iv: z.string().min(1),
});


type CreateLinkData = z.infer<typeof createLinkSchema>;
type TimeUnit = "minutes" | "hours" | "days";

export default function CreateLinkPage() {
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [relativeTime, setRelativeTime] = useState({ value: "", unit: "minutes" });

  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<CreateLinkData>({
    resolver: zodResolver(createLinkSchema),
  });

  const onSubmit = async (data: CreateLinkData) => {
    const secretKey = data.secretKey
    const iv = data.iv

    // console.log(iv)
    // if (!secretKey || !iv) {
    //   alert("Please generate the encryption key and IV before creating the link.");
    //   return;
    // }

    let expiresAt: string | undefined;
    if (relativeTime.value) {
      const now = new Date();
      const amount = parseInt(relativeTime.value);
      if (relativeTime.unit === "minutes") now.setMinutes(now.getMinutes() + amount);
      if (relativeTime.unit === "hours") now.setHours(now.getHours() + amount);
      if (relativeTime.unit === "days") now.setDate(now.getDate() + amount);
      expiresAt = now.toISOString()
    }

    const payload = {
      ...data,
      expiresAt,
      secretKey,
      iv
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_APP_URL}/api/v1/link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok || res.status === 401) {
        useAuth.getState().setUser(null)
        navigate('/auth')
        return;
      }
      const result = await res.json();
      // console.log(result);
      if (result.error) {
        console.error('err', result.error);
        return;
      }

      const safeKey = encodeURIComponent(secretKey);
      const safeIV = encodeURIComponent(iv);
      const fullLink = `${result.uploadUrl}#key=${safeKey}&iv=${safeIV}`;
      if (result) {
        setUploadUrl(fullLink);
        // downloadKeyFile(fullLink, secretKey, iv);
      }

      // reset();
    } catch (err) {
      console.error("Failed to create link");
    }
  };

  const generateKeyAndIV = (): void => {
    const key = crypto.getRandomValues(new Uint8Array(32)); // AES-256
    const iv = crypto.getRandomValues(new Uint8Array(16));

    const base64Key = btoa(String.fromCharCode.apply(null, [...key]));
    const base64IV = btoa(String.fromCharCode.apply(null, [...iv]))

    setValue('secretKey', base64Key)
    setValue('iv', base64IV)
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-2xl font-semibold text-center mb-2">
        Create Secure Upload Link
      </h1>

      <div className="flex gap-8 items-start">
        {/* Form on the left */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-5 border border-gray-200 p-4"
        >
          {/* Max Uploads */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Uploads
            </label>
            <input
              type="number"
              {...register("maxUploads", { valueAsNumber: true })}
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
            {errors.maxUploads && (
              <p className="text-sm text-red-600 mt-1">
                {errors.maxUploads.message}
              </p>
            )}
          </div>

          {/* Expires At */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expires In
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                placeholder="1"
                value={relativeTime.value}
                onChange={(e) => setRelativeTime({ ...relativeTime, value: e.target.value })}
                className="w-24 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
              <select
                value={relativeTime.unit}
                onChange={(e) => setRelativeTime({ ...relativeTime, unit: e.target.value as TimeUnit })}
                className="border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">
              Or select custom date/time
            </label>
            <input
              type="datetime-local"
              // value={customDate}
              // onChange={(e) => setCustomDate(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div> */}


          {/* Secret Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secret Key
            </label>
            <input
              type="text"
              {...register("secretKey")}
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
            {errors.secretKey && (
              <p className="text-sm text-red-600 mt-1">
                {errors.secretKey.message}
              </p>
            )}

          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Initialization Vector (IV)
            </label>
            <input
              type="text"
              {...register("iv")}
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />

            <button
              type="button"
              onClick={generateKeyAndIV}
              className="mt-1 text-xs text-white px-2 py-2 rounded-sm hover:bg-gray-900 cursor-pointer bg-black"
            >
              Generate Secure Key
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-center bg-black text-white py-2 text-sm hover:bg-gray-900 transition"
          >
            {isSubmitting ? "Generating..." : "Generate Link"}
          </button>
        </form>


        {/* Upload Link on the right */}
        <div className="w-full max-w-md border border-gray-200 p-6 text-sm">
          <p className="font-medium mb-2">Upload Link:</p>

          {uploadUrl ? (
            <div className="flex items-start gap-2">
              <a
                href={uploadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 break-all underline"
              >
                {uploadUrl}
              </a>
              <FaCopy
                size={30}
                className="mt-1 cursor-pointer text-gray-600 hover:text-black"
                onClick={() => {
                  navigator.clipboard.writeText(uploadUrl);
                }}
              />
            </div>
          ) : (
            <p className="text-gray-500">Your generated link will appear here.</p>
          )}
        </div>
      </div>
    </div>

  );
}
