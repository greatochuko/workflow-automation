import { ProjectType } from "./project";
import { UserType } from "./user";

export type YoutubeContentType = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  thumbnailText: string[];
  createdAt: string;
  updatedAt: string;

  project: ProjectType;
  projectId: string;

  client: UserType;
  clientId: string;
};
