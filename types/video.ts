export type FileWithPreview = File & {
  preview: string;
  id: string;
};

export type FileMetadata = {
  title: string;
  description: string;
};

export type MetadataRecord = {
  [key: string]: FileMetadata;
};
