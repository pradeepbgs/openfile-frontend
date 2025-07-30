import { create } from "zustand";

type FileStatus = {
  id: string; // Unique ID or filename
  name: string;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
};

type UploadStatusStore = {
  uploads: FileStatus[];
  addFile: (file: FileStatus) => void;
  updateProgress: (id: string, progress: number) => void;
  updateStatus: (id: string, status: FileStatus["status"]) => void;
  reset: () => void;
};

export const useUploadStatusStore = create<UploadStatusStore>((set) => ({
  uploads: [],
  addFile: (file) =>
    set((state) => ({
      uploads: [...state.uploads.filter(f => f.id !== file.id), file],
    })),
  updateProgress: (id, progress) =>
    set((state) => ({
      uploads: state.uploads.map((f) =>
        f.id === id ? { ...f, progress } : f
      ),
    })),
  updateStatus: (id, status) =>
    set((state) => ({
      uploads: state.uploads.map((f) =>
        f.id === id ? { ...f, status } : f
      ),
    })),
  reset: () => set({ uploads: [] }),
}));
