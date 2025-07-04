import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FaCopy } from "react-icons/fa";
import { downloadKeyFile } from "~/utils/dowload-key";
import { useNavigate } from "react-router";
import { useCreateLinkMutation } from "~/service/api";
import Spinner from "~/components/spinner";
import { generateKeyAndIVWithWebCrypto } from "~/utils/encrypt-decrypt";

const createLinkSchema = z.object({
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
  const [relativeTime, setRelativeTime] = useState<Record<string, string>>({
    value: "",
    unit: "minutes",
  });
  const [shouldDownloadKey, setShouldDownloadKey] = useState<boolean>(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<CreateLinkData>({
    resolver: zodResolver(createLinkSchema),
  });

  const {
    mutateAsync: createLink,
    isError: isCreateLinkError,
    error: createLinkError,
    isPending: isCreateLinkPending,
  } = useCreateLinkMutation();

  const onSubmit = async (data: CreateLinkData) => {
    const { secretKey, iv } = data;

    let expiresAt: string | undefined;
    if (relativeTime.value) {
      const now = new Date();
      const amount = parseInt(relativeTime.value);
      if (relativeTime.unit === "minutes") now.setMinutes(now.getMinutes() + amount);
      if (relativeTime.unit === "hours") now.setHours(now.getHours() + amount);
      if (relativeTime.unit === "days") now.setDate(now.getDate() + amount);
      expiresAt = now.toISOString();
    } else {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 10);
      expiresAt = now.toISOString();
    }

    const payload = {
      ...data,
      expiresAt,
      secretKey,
      iv,
    };

    try {
      const fullLink = await createLink({ iv, navigate, payload, secretKey });
      if (fullLink) {
        setUploadUrl(fullLink);
        shouldDownloadKey && downloadKeyFile(fullLink, secretKey, iv);
      }
    } catch (err) {
      console.error("Failed to create link");
    }
  };

  const generateKeyAndIV = async () => {
    const { key, iv } = await generateKeyAndIVWithWebCrypto();
    setValue("secretKey", key);
    setValue("iv", iv);
  };

  const handleCheckboxChange = (e: any) => {
    setShouldDownloadKey(e.target.checked);
  };

  return (
    <div className="min-h-screen bg-[#14151c] text-white flex flex-col  items-center px-4 py-6">
      <h1 className="md:text-3xl text-[1.3rem] font-extrabold text-center mb-6 text-white">
        Create Secure Upload Link
      </h1>

      <div className="max-w-5xl md:w-[60%] gap-6 border border-neutral-700 rounded-md p-6 shadow-lg bg-[#1e1e2f] text-white">
        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Uploads + Expiry */}
          <div className="flex flex-col md:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Max Uploads
              </label>
              <input
                type="number"
                {...register("maxUploads", { valueAsNumber: true })}
                className="w-24 border border-neutral-600 bg-[#2a2b3d] text-white px-2 py-2 text-sm rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.maxUploads && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.maxUploads.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Expires In
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  placeholder="1"
                  value={relativeTime.value}
                  onChange={(e) =>
                    setRelativeTime({ ...relativeTime, value: e.target.value })
                  }
                  className="w-24 border border-neutral-600 bg-[#2a2b3d] text-white px-3 py-2 text-sm rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  value={relativeTime.unit}
                  onChange={(e) =>
                    setRelativeTime({
                      ...relativeTime,
                      unit: e.target.value as TimeUnit,
                    })
                  }
                  className="border border-neutral-600 bg-[#2a2b3d] text-white px-2 py-2 text-sm rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Secret Key + IV */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Secret Key
              </label>
              <input
                type="text"
                {...register("secretKey")}
                className="w-full border border-neutral-600 bg-[#2a2b3d] text-white px-2 py-2 text-sm rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.secretKey && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.secretKey.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Initialization Vector (IV)
              </label>
              <input
                type="text"
                {...register("iv")}
                className="w-full border border-neutral-600 bg-[#2a2b3d] text-white px-2 py-2 text-sm rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Download checkbox + Generate key */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={shouldDownloadKey}
                onChange={handleCheckboxChange}
              />
              <label className="ml-2 text-sm text-gray-300">Download key & IV?</label>
            </div>
            <button
              type="button"
              onClick={generateKeyAndIV}
              className="text-xs text-white px-3 py-2 rounded-sm bg-indigo-600 hover:bg-indigo-700 transition duration-300"
            >
              Generate Secure Key
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-indigo-600 hover:bg-indigo-700 text-white py-2 text-sm disabled:opacity-60 transition duration-300"
          >
            {isCreateLinkPending ? <Spinner size={15} /> : "Generate Link"}
          </button>
        </form>

        {/* OUTPUT LINK */}
        <div className="space-y-4 mt-4">
          {isCreateLinkError && (
            <p className="text-red-400 text-center">{createLinkError}</p>
          )}

          <div className="w-full border border-neutral-600 rounded-md p-4 text-sm break-words bg-[#2a2b3d] text-white">
            {uploadUrl ? (
              <div className="flex items-start gap-4">
                <FaCopy
                  size={22}
                  className="mt-1 cursor-pointer text-gray-400 hover:text-white"
                  onClick={() => navigator.clipboard.writeText(uploadUrl)}
                />
                <a
                  href={uploadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 break-all underline"
                >
                  {uploadUrl}
                </a>
              </div>
            ) : (
              <p className="text-gray-400">Your generated link will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
