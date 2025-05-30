export type FileMetadata = {
  id: string;
  description: string;
  previewUrl: string;
  previewFile: File | undefined;
};

export type FileWithPreview = {
  file: File;
  metadata: FileMetadata;
};
