import { create } from 'zustand';

interface FileStatusState {
    fileStatusMessages: { [key: string]: string };
    updateFileStatus: (fileId: string, message: string) => void;
}

export const useFileStatusStore = create<FileStatusState>((set) => ({
    fileStatusMessages: {},
    updateFileStatus: (fileId, message) =>
        set((state) => ({
            fileStatusMessages: {
                ...state.fileStatusMessages,
                [fileId]: message,
            },
        })),
}));
