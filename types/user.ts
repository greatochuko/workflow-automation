import { NewsletterTemplateType } from "./newsletter";

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
  industry: string;
  location: string;
  monthlyCredits: number;
  newsLetterBasicInstructions: string;
  newsletterExamples: string[];
  specialties: string[];
  videoScriptExamples: string[];
  certifications: string[];
  videoTypes: string[];
  assignedFreelancers: UserType[];
  assignedClients: UserType[];
  knowledgeBase: KnowledgeBaseItemType[];
  newsletterTemplates: NewsletterTemplateType[];
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
