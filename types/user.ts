import { InstagramAccount } from "@prisma/client";
import { NewsletterTemplateType } from "./newsletter";
import { VideoScriptType } from "./videoScript";

export type SOPSettingType = { id: string; type: string; content: string };

export type KnowledgeBaseItemType = {
  id: string;
  title: string;
  content: string;
};

export type YoutubeSettingType = {
  industry: string;
  business: string;
  state: string;
  city: string;
  contactLink: string;
  targetAudience: string;
  brandVoice: string;
  keywordsHashtags: string;
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
  SOPSettings: SOPSettingType[];
  newsLetterBasicInstructions: string;
  instagramAccount?: InstagramAccount;
  newsletterExamples: string[];
  specialties: string[];
  videoScriptExamples: string[];
  videoScripts: VideoScriptType[];
  certifications: string[];
  videoTypes: string[];
  assignedFreelancers: UserType[];
  assignedClients: UserType[];
  knowledgeBase: KnowledgeBaseItemType[];
  youtubeSettings?: YoutubeSettingType;
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
