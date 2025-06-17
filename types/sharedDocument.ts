import { UserType } from "./user";

export type SharedDocumentType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  createdBy: UserType;
  createdById: string;
  content: string;
  lastEditedBy: UserType | null;
  lastEditedById: string | null;
};
