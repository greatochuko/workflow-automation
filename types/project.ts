import { ProjectStatus } from "@prisma/client";
import { UserType } from "./user";
import { NewsletterTemplateType } from "./newsletter";
import { VideoScriptType } from "./videoScript";

export type ProjectFileType = {
  id: string;
  name: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  type: string;
};

export type ProjectType = {
  id: string;
  title: string;
  description: string;
  scheduledDate: Date;
  videoType: string;
  videoScriptId?: string;
  videoScript?: VideoScriptType;
  captionData: {
    hook: string;
    cta1: string;
    cta2: string;
    captionContent: string;
  };
  feedback: string;
  submissionDate: Date;
  completedFile: Omit<ProjectFileType, "description">;
  files: ProjectFileType[];
  status: ProjectStatus;
  newsletterTemplates: NewsletterTemplateType[];
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  createdBy: UserType;
};
