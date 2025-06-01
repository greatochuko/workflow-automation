import { getPresignedUrl } from "@/actions/projectActions";

export async function uploadFileWithProgress(
  file: File,
  onProgress?: (percent: number, key: string) => void,
): Promise<string | null> {
  try {
    const { url, key } = await getPresignedUrl(file.name, file.type);

    if (!url || !key) return null;

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("PUT", url, true);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent, key);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error("Network error during upload"));
      xhr.send(file);
    });

    return key;
  } catch (err) {
    console.error("Error uploading file:", (err as Error).message);
    return null;
  }
}
