"use client";

import React from "react";
import Avatar from "../ui/Avatar";
import { UserType } from "@/types/user";
import { PlusIcon, XIcon } from "lucide-react";
import Button from "../ui/Button";

type PersonalInfoFieldType = {
  label: string;
  placeholder: string;
  name: keyof UserType;
  type?: string;
  required?: boolean;
};

const personalInfoFields: PersonalInfoFieldType[] = [
  {
    name: "fullName",
    label: "Full Name",
    placeholder: "John Doe",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    placeholder: "user@example.com",
    required: true,
  },
  {
    name: "companyName",
    label: "Company",
    placeholder: "Company (optional)",
  },
  {
    name: "phoneNumber",
    label: "Phone",
    placeholder: "Your phone number",
  },
  {
    name: "website",
    label: "Website",
    placeholder: "www.example.com",
  },
];

type SocialMediaFieldType = {
  label: string;
  placeholder: string;
  name: keyof UserType;
};

const socialMediaFields: SocialMediaFieldType[] = [
  {
    label: "Instagram",
    placeholder: "https://www.instagram.com/yourprofile",
    name: "instagram",
  },
  {
    label: "Facebook",
    placeholder: "https://www.facebook.com/yourprofile",
    name: "facebook",
  },
  {
    label: "Twitter (x)",
    placeholder: "https://www.x.com/yourprofile",
    name: "twitter",
  },
  {
    label: "threads",
    placeholder: "https://www.threads.com/in/yourprofile",
    name: "threads",
  },
  {
    label: "LinkedIn",
    placeholder: "https://www.linkedin.com/in/yourprofile",
    name: "linkedin",
  },
  {
    label: "YouTube",
    placeholder: "https://www.youtube.com/c/yourchannel",
    name: "youtube",
  },
  {
    label: "TikTok",
    placeholder: "https://www.tiktok.com/@yourprofile",
    name: "tiktok",
  },
  {
    label: "Snapchat",
    placeholder: "https://www.snapchat.com/add/yourprofile",
    name: "snapchat",
  },
];

export default function ProfileDetails({ user }: { user: UserType }) {
  return (
    <div className="flex flex-col gap-4 rounded-md border border-gray-200 bg-white p-4 text-sm sm:p-6">
      <div className="flex items-center justify-center">
        <Avatar user={user} className="h-24 w-24" />
      </div>
      <div className="flex flex-col gap-6">
        <div className="mt-2 flex flex-col gap-2 sm:col-span-2">
          <h4 className="text-lg font-semibold">Personal Information</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            {personalInfoFields.map((field) => (
              <div
                key={field.name}
                className="flex items-center gap-2 sm:last:col-span-2"
              >
                <h3 className="font-medium text-gray-500">{field.label}:</h3>
                <p>{(user[field.name] as string) || "N/A"}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-2 sm:col-span-2">
          <h4 className="text-lg font-medium">Social Media</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            {socialMediaFields.map((field) => (
              <div key={field.name} className="flex items-center gap-2">
                <h5 className="w-20 font-medium text-gray-500">
                  {field.label}:
                </h5>
                <p>{(user[field.name] as string) || "N/A"}</p>
              </div>
            ))}
          </div>
        </div>

        {user.role === "FREELANCER" && (
          <>
            <div className="mt-2 flex flex-col gap-2 sm:col-span-2">
              <h4 className="text-lg font-medium">Specialties</h4>
              <div className="relative flex">
                <input
                  type="text"
                  name="new-specialty"
                  id="new-specialty"
                  placeholder="Add specialty"
                  autoComplete="off"
                  className="bg-background w-0 flex-1 rounded-md border border-gray-300 p-2 pr-14 disabled:opacity-70"
                />
                <Button className="absolute top-0 right-0 h-full rounded-l-none">
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
              {user.specialties.length > 0 && (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {user.specialties.map((specialty, index) => (
                    <p
                      key={index}
                      className="bg-background flex items-center gap-2 rounded-md border border-gray-200 px-2 py-1.5 text-sm"
                    >
                      <span className="flex-1">{specialty}</span>
                      <button
                        type="button"
                        className="hover:text-foreground rounded-md p-1 text-gray-500 duration-200 hover:bg-gray-200"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-2 flex flex-col gap-2 sm:col-span-2">
              <h4 className="text-lg font-medium">Certifications</h4>
              <div className="relative flex">
                <input
                  type="text"
                  name="new-certification"
                  id="new-certification"
                  placeholder="Add certification"
                  autoComplete="off"
                  className="bg-background w-0 flex-1 rounded-md border border-gray-300 p-2 pr-14 disabled:opacity-70"
                />
                <Button className="absolute top-0 right-0 h-full rounded-l-none">
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
              {user.certifications.length > 0 && (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {user.certifications.map((certification, index) => (
                    <p
                      key={index}
                      className="bg-background flex items-center gap-2 rounded-md border border-gray-200 px-2 py-1.5 text-sm"
                    >
                      <span className="flex-1">{certification}</span>
                      <button
                        type="button"
                        className="hover:text-foreground rounded-md p-1 text-gray-500 duration-200 hover:bg-gray-200"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </p>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
