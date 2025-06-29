export interface LinkItem {
  id: string;
  iv: string;
  maxUploads: number;
  secretKey: number;
  token: string;
  uploadCount: number;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface FileItem {
  createdAt: string
  id:number
  iv: string
  keyUsed: boolean
  size:number
  updatedAt:string
  uploadLinkId: number
  url: string
  userId: number
}

export interface createLinkArgs {
  payload: CreateLinkPayload;
  navigate: (path:string) => void; 
  secretKey: string;
  iv: string
}

export interface CreateLinkPayload {
  maxUploads: number;
  allowedFileType?: string[];
  expiresAt?: string; 
  secretKey: string;
  iv: string;
}