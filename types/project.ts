import { ProjectStatus } from "@prisma/client";
import { UserType } from "./user";

export type ProjectType = {
  id: string;
  title: string;
  description: string;
  scheduledDate: Date;
  videoType: string;
  files: {
    id: string;
    name: string;
    description: string;
    url: string;
    thumbnailUrl: string;
    type: string;
  }[];
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  createdBy: UserType;
};
