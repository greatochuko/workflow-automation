import { ProjectType } from "./project";
import { UserType } from "./user";

export type NewsletterTemplateType = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;

  project: ProjectType;
  projectId: string;

  client: UserType;
  clientId: string;
};
