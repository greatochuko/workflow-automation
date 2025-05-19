export async function resizeImage(
  file: File,
  maxWidth = 256,
): Promise<
  | { dataUrl: string; resizedFile: File; error?: undefined }
  | { error: Error; dataUrl?: undefined; resizedFile?: undefined }
> {
  if (!file || !file.type.startsWith("image/")) {
    return { error: new Error("Please upload a valid image file.") };
  }

  try {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") resolve(reader.result);
        else reject(new Error("Failed to read file as a string."));
      };
      reader.onerror = () => reject(new Error("Failed to read file."));
      reader.readAsDataURL(file);
    });

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Failed to load image."));
      image.src = dataUrl;
    });

    const scale = Math.min(1, maxWidth / img.width);
    const canvas = document.createElement("canvas");
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    const ctx = canvas.getContext("2d");
    if (!ctx) return { error: new Error("Failed to get canvas context.") };
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, file.type),
    );
    if (!blob) return { error: new Error("Image compression failed.") };

    const resizedFile = new File([blob], file.name, { type: file.type });
    const resizedDataUrl = canvas.toDataURL(file.type);
    return { dataUrl: resizedDataUrl, resizedFile };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
}
