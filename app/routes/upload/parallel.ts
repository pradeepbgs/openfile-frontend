
const pr = files.map(async (file) => {
    const worker = new Worker(
      new URL("../../utils/encryptWorker.ts", import.meta.url),
      { type: "module" }
    );

    const encryptFileWithWorker = (file: File, secretKey: string, iv: string): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        worker.postMessage({ file, secretKey, iv });

        worker.onerror = (err) => reject("Worker error: " + err.message);
        worker.onmessage = (event) => {
          event.data.error ? reject(event.data.error) : resolve(event.data);
        };
      });
    };
    const status = fileStatusList.find((f) => f.name === file.name);
    if (status?.status === "done") return;

    try {
      const mimeType = file.type || 'application/octet-stream';
      const { url, key: s3Key } = await getUploadUrl(mimeType, token);
      const encryptedBlob = await encryptFileWithWorker(file, key, iv);
      const encryptedFile = new File([encryptedBlob], file.name, { type: file.type });

      await uploadFilesMutation({ encryptFile: encryptedBlob, type: mimeType, url, name: file.name });
      await UpdateDbS3({ s3Key, size: encryptedFile.size, token, filename: file.name });

      updateStatus(file.name, "done");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError(file.name, message ?? "error while upload this file");
    }
  })