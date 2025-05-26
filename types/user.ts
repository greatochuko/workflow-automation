export type KnowledgeBaseItemType = {
  id: string;
  title: string;
  content: string;
};

export type UserType = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: "CLIENT" | "FREELANCER" | "ADMIN";
  profilePicture: string;
  companyName: string;
  specialties: string[];
  certifications: string[];
  videoTypes: string[];
  assignedFreelancers: UserType[];
  assignedClients: UserType[];
  knowledgeBase: KnowledgeBaseItemType[];
  phoneNumber: string;
  website: string;
  threads: string;
  instagram: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
  snapchat: string;
  pinterest: string;
};
