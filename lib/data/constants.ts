import {
  EditIcon,
  MailIcon,
  SettingsIcon,
  UserCogIcon,
  UsersIcon,
  YoutubeIcon,
} from "lucide-react";

export const sidebarLinks = [
  { title: "Users", url: "/users", icon: UsersIcon, validUserRole: "ADMIN" },
  {
    title: "User Settings",
    url: "/settings",
    icon: SettingsIcon,
    validUserRole: "ADMIN",
  },
  {
    title: "Client Management",
    url: "/client-management",
    icon: UserCogIcon,
    validUserRole: "ADMIN",
  },
  {
    title: "Script Generator",
    url: "/script-generator",
    icon: EditIcon,
    validUserRole: "CLIENT",
  },
  {
    title: "Newsletter Content",
    url: "/newsletter-content",
    icon: MailIcon,
    validUserRole: "CLIENT",
  },
  {
    title: "Youtube Repurposing",
    url: "/youtube-repurposing",
    icon: YoutubeIcon,
    validUserRole: "CLIENT",
  },
];

export const noSidebarRoutes = [
  "/login",
  "/change-password",
  "/privacy-policy",
  "/terms-of-service",
];
