export const generateVideoThumbnail = (
  file: File,
  resizeWidth = 320,
  seekTo = 1,
): Promise<
  | { data: { url: string; file: File }; error: null }
  | { data: null; error: string }
> => {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith("video/")) {
      resolve({ data: null, error: "Invalid video file" });
      return;
    }

    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const url = URL.createObjectURL(file);

    video.preload = "metadata";
    video.src = url;
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(seekTo, video.duration / 2);
    };

    video.onseeked = () => {
      const scaleFactor = Math.min(resizeWidth / video.videoWidth, 1);
      const width = Math.floor(video.videoWidth * scaleFactor);
      const height = Math.floor(video.videoHeight * scaleFactor);

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve({ data: null, error: "No ctx" });
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve({ data: null, error: "Failed to create blob" });
          return;
        }

        const imageUrl = URL.createObjectURL(blob);
        const imageFile = new File([blob], "thumbnail.png", {
          type: "image/png",
        });

        URL.revokeObjectURL(url);
        resolve({
          data: {
            url: imageUrl,
            file: imageFile,
          },
          error: null,
        });
      }, "image/png");
    };

    video.onerror = () => {
      resolve({ data: null, error: "Error loading video" });
    };
  });
};
