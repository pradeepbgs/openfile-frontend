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