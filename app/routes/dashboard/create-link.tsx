"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FaCopy } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';

export const createLinkSchema = z.object({
  maxUploads: z.number().min(1).default(1).optional(),
  allowedFileType: z.array(z.string()).optional(),
  expiresAt: z.string().datetime().optional(),
  secretKey: z.string(),
});

type CreateLinkData = z.infer<typeof createLinkSchema>;
type TimeUnit = "minutes" | "hours" | "days";

export default function CreateLinkPage() {
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [relativeTime, setRelativeTime] = useState({ value: "", unit: "minutes" });

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
    let expiresAt: string | undefined;
    if (relativeTime.value) {
      const now = new Date();
      const amount = parseInt(relativeTime.value);
      if (relativeTime.unit === "minutes") now.setMinutes(now.getMinutes() + amount);
      if (relativeTime.unit === "hours") now.setHours(now.getHours() + amount);
      if (relativeTime.unit === "days") now.setDate(now.getDate() + amount);
      expiresAt = now.toISOString()
      console.log(expiresAt)
    }

    const allowedFileTypes = watch('allowedFileType')
    const payload = {
      ...data,
      expiresAt,
      allowedFileTypes
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

      const result = await res.json();
      console.log(result);
      setUploadUrl(result.uploadUrl);
      // reset();
    } catch (err) {
      console.error("Failed to create link");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-2xl font-semibold text-center mb-10">
        Create Secure Upload Link
      </h1>

      <div className="flex gap-8 items-start">
        {/* Form on the left */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-5 border border-gray-200 p-6"
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

          {/* Allowed File Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Allowed File Types
            </label>
            <input
              type="text"
              placeholder="e.g. image/png, video/mp4"
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              onChange={(e) => {
                const input = e.target.value;
                const arr = input
                  .split(",")
                  .map((type) => type.trim())
                  .filter((type) => type !== "");

                setValue("allowedFileType", arr);
              }}
            />
            {errors.allowedFileType && (
              <p className="text-sm text-red-600 mt-1">
                {errors.allowedFileType.message}
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
                size={18}
                className="mt-1 cursor-pointer text-gray-600 hover:text-black"
                onClick={() => {
                  navigator.clipboard.writeText(uploadUrl);
                  // toast.success('copied to clipboard', {
                  //   autoClose: 5000,
                  //   hideProgressBar: false,
                  //   closeOnClick: false,
                  //   pauseOnHover: true,
                  //   draggable: true,
                  //   progress: undefined,
                  //   theme: "light",
                  //   });
                }}
              />
            </div>
          ) : (
            <p className="text-gray-500">Your generated link will appear here.</p>
          )}
        </div>
      </div>
      <ToastContainer
          position="bottom-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
    </div>

  );
}
