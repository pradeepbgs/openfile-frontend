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
    <div className="flex flex-col justify-center items-center px-4 py-6">
      <h1 className="md:text-3xl text-[1.3rem] font-extrabold text-center mb-6">
        Create Secure Upload Link
      </h1>

      <div className="max-w-5xl gap-6 border border-gray-300 rounded-md p-6 shadow-md bg-white">
        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Uploads + Expiry */}
          <div className="flex flex-col md:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Uploads
              </label>
              <input
                type="number"
                {...register("maxUploads", { valueAsNumber: true })}
                className="w-24 border rounded-sm border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
              {errors.maxUploads && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.maxUploads.message}
                </p>
              )}
            </div>

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
                  onChange={(e) =>
                    setRelativeTime({ ...relativeTime, value: e.target.value })
                  }
                  className="w-24 border rounded-sm border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
                <select
                  value={relativeTime.unit}
                  onChange={(e) =>
                    setRelativeTime({
                      ...relativeTime,
                      unit: e.target.value as TimeUnit,
                    })
                  }
                  className="border rounded-sm border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secret Key
              </label>
              <input
                type="text"
                {...register("secretKey")}
                className="w-full border rounded-sm border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
              {errors.secretKey && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.secretKey.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initialization Vector (IV)
              </label>
              <input
                type="text"
                {...register("iv")}
                className="w-full border rounded-sm border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
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
              <label className="ml-2 text-sm">Download key & IV?</label>
            </div>
            <button
              type="button"
              onClick={generateKeyAndIV}
              className="text-xs text-white px-3 py-2 rounded-sm bg-black hover:bg-gray-900 transition-transform duration-300"
            >
              Generate Secure Key
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer text-center rounded-md bg-black text-white py-2 text-sm hover:bg-gray-900 transition-transform duration-300"
          >
            {isCreateLinkPending ? <Spinner size={15} /> : "Generate Link"}
          </button>
        </form>

        {/* OUTPUT LINK */}
        <div className="space-y-4 mt-4">
          {isCreateLinkError && (
            <p className="text-red-600 text-center">{createLinkError}</p>
          )}

          <div className="w-full border border-gray-200 rounded-md p-4 text-sm break-all">
            {uploadUrl ? (
              <div className="flex items-start gap-4">
                <FaCopy
                  size={22}
                  className="mt-1 cursor-pointer text-gray-600 hover:text-black  "
                  onClick={() => navigator.clipboard.writeText(uploadUrl)}
                />
                <a
                  href={uploadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 break-all underline"
                >
                  {uploadUrl}
                </a>
              </div>
            ) : (
              <p className="text-gray-500">
                Your generated link will appear here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
