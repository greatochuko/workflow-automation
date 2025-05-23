export type FileMetadata = {
  id: string;
  description: string;
  preview: string;
};

export type FileWithPreview = {
  file: File;
  metadata: FileMetadata;
};
