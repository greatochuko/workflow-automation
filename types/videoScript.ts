import { UserType } from "./user";

export type VideoScriptContentType = {
  hookLine: string;
  body: string;
  cta: string;
};

export type VideoScriptType = {
  id: string;
  content: VideoScriptContentType;
  createdAt: Date;
  updatedAt: Date;
  projectId: string | null;
  isSaved: boolean;
  clientId: string;
  clien: UserType;
  topic: string;
  description: string;
  durationInSeconds: number;
};
