import { UserType } from "./user";

export type VideoScriptType = {
  id: string;
  content: {
    hookLine: string;
    body: string;
    cta: string;
  };
  createdAt: Date;
  updatedAt: Date;
  projectId: string | null;
  clientId: string;
  clien: UserType;
  topic: string;
  description: string;
  durationInSeconds: number;
};
