import { FiDownload } from "react-icons/fi";
import type { FileItem } from "types/types";

type FileCardProps = {
    file: FileItem;
    onDownload: () => void;
    isDecrypting: boolean;
    decryptMsg: string;
};

export function FileCard({ file, onDownload, isDecrypting, decryptMsg }: FileCardProps) {
    return (
        <div className="bg-white border rounded-2xl shadow-sm p-4 flex flex-col justify-between gap-2 hover:shadow-md transition-all">
            <div className="flex flex-col gap-1">
                <p className="font-semibold text-gray-800 truncate">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
                onClick={onDownload}
                disabled={isDecrypting}
                className="flex items-center justify-center gap-2 mt-2 py-2 px-4 text-sm rounded-xl text-white bg-black hover:bg-gray-800 transition disabled:opacity-50"
            >
                {isDecrypting ? decryptMsg : (
                    <>
                        <FiDownload size={16} />
                        Decrypt & Download
                    </>
                )}
            </button>
        </div>
    );
}
