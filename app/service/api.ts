import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import type { createLinkArgs } from "types/types";
import { useAuth } from "~/zustand/store";


export function useGoogleLoginHandler() {

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleGoogleLogin = useCallback(async (token: string | undefined) => {
        if (!token) {
            console.log("Google token not found.");
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_APP_URL}/api/v1/auth/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
                credentials: 'include'
            });

            if (!res.ok) {
                const error = await res.json();
                console.log(error?.message || "Google login failed.")
                return;
            }

            const data = await res.json();
            useAuth.getState().setUser(data.user);
            navigate(from, { replace: true });

        } catch (err) {
            console.error("Login error:", err);
        }

    }, [navigate, from]);

    return handleGoogleLogin;
}

export const authCheck = async () => {
    try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_APP_URL}/api/v1/auth/check`, {
            method: "GET",
            credentials: 'include'
        });

        if (!res.ok) {
            useAuth.getState().logout()
            useAuth.getState().setUser(null)
        }

        const data = await res.json();
        useAuth.getState().setUser(data.user);
    } catch (err) {
        console.error("Login error:", err);
    }
}


export const logout = async () => {
    try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_APP_URL}/api/v1/auth/logout`, {
            method: "GET",
            credentials: 'include'
        });

        if (!res.ok) {
            throw new Error("Logout failed");
        }

        useAuth.getState().logout()
        useAuth.getState().setUser(null)
    } catch (err) {
        console.error("Logout error:", err);
    }
}

const fetchValidateToken = async (token: string,secretKey:string,iv:string) => {

    const res = await fetch(`${import.meta.env.VITE_BACKEND_APP_URL}/api/v1/link/validate?token=${token}&secretKey=${secretKey}&iv=${iv}`, {
        method: "GET",
        credentials: 'include',
    });
    if (!res.ok) {
        throw new Error("Invalid or expired token");
    }

    return res.json();
};

export function useValidateTokenQuery(token: string,secretKey:string,iv:string) {
    return useQuery({
        queryKey: ["validate-token", token],
        queryFn: () => fetchValidateToken(token,secretKey,iv),
        enabled: !!token,
        retry: false,
    });
}


const fetchUserLinks = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_APP_URL}/api/v1/link`, {
        method: "GET",
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error("Failed to fetch user links");
    }

    return res.json();
};
export function useUserLinksQuery() {
    return useQuery({
        queryKey: ["user-links"],
        queryFn: fetchUserLinks,
    });
}


const uploadFiles = async ({ formData, iv, token }: { formData: FormData; iv: string; token: string }) => {

    const res = await fetch(`${import.meta.env.VITE_BACKEND_APP_URL}/api/v1/file?token=${token}`, {
        method: "POST",
        body: formData,
        headers: {
            'X-IV': iv,
        },
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error("Failed to upload files");
    }

    return res.json();
};

export function useUploadFilesMutation() {
    return useMutation({
        mutationFn: uploadFiles,
    });
}


const uploadToS3 = async ({ encryptFile, url, type }: { encryptFile: Blob, url: string, type: string }) => {
    try {
        const s3Response = await fetch(url, {
            method: 'PUT',
            headers: {
                "Content-Type": type,
            },
            body: encryptFile
        })
        if (!s3Response.ok) {
            throw new Error("Failed to upload to S3");
        }
        return true
    } catch (error) {
        console.error("Error uploading to S3:", error);
        throw error;
    }
}


export function useUploadS3Mutation() {
    return useMutation({
        mutationFn: uploadToS3,
    });
}



const fetchUserFiles = async (token: string, key: string) => {
    // const encodedKey = encodeURIComponent(key);
    const res = await fetch(
        `${import.meta.env.VITE_BACKEND_APP_URL}/api/v1/file/${token}/files?page=${1}&limit=${10}&key=${key}`, {
        method: "GET",
        credentials: 'include',
        // body:JSON.stringify({key})
    });

    if (!res.ok) {
        throw new Error("Failed to fetch user files");
    }

    return res.json();
}

export function useUserFilesQuery(token: string, key: string) {
    return useQuery({
        queryKey: ["user-files"],
        queryFn: () => fetchUserFiles(token, key),
        enabled: !!token
    });
}


export const getUploadUrl = async (mimeType: string, token: string) => {
    try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_APP_URL}/api/v1/file/upload-url?token=${token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ mimeType }),
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data?.error || "Failed to get upload URL");
        }

        return data;
    } catch (error) {
        console.log('got error during getting upload pre-signed url', error)
        throw error
    }
};


const updateS3UpoadDB = async ({ iv, s3Key, size, token, filename }: { iv: string, s3Key: string, size: number, token: string, filename: string }) => {
    try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_APP_URL}/api/v1/file/notify-upload?token=${token}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-IV": iv,
            },
            body: JSON.stringify({
                s3Key,
                fileSize: size,
                name: filename
            }),
        });
        if (!res.ok) {
            throw new Error("got error while uodating db for s3 upload")
        }

    } catch (error) {
        console.log("got error while uodating db for s3 upload")
        throw error;
    }
}

export const useUpdateS3UploadDB = () => {
    return useMutation({
        mutationFn: updateS3UpoadDB,
    });
}



const createLink = async ({ payload, navigate, secretKey, iv }: createLinkArgs): Promise<string | void> => {
    try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_APP_URL}/api/v1/link`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        if (res.status === 401) {
            useAuth.getState().setUser(null)
            navigate('/auth')
            return;
        }
        const result = await res.json();
        if (result.error) {
            console.error('err', result.error);
            throw result.error;
        }

        // const safeKey = encodeURIComponent(secretKey);
        // const safeIV = encodeURIComponent(iv);
        const fullLink = `${result.uploadUrl}#key=${secretKey}&iv=${iv}`;
        return fullLink
    } catch (error) {
        console.log("got error during creating link ")
        throw error;
    }
}

export function useCreateLinkMutation() {
    // const navigate = useNavigate();
    return useMutation({
        mutationFn: createLink,
    });
}