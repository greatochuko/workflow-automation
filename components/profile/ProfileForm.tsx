"use client";

import React, { useState } from "react";
import Avatar from "../ui/Avatar";
import { UserType } from "@/types/user";
import { resizeImage } from "@/lib/utils/imageResize";
import {
  LoaderIcon,
  PlusIcon,
  UploadIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import Button from "../ui/Button";
import { toast } from "sonner";
import { uploadImage } from "@/lib/utils/imageUpload";
import { updateUserProfile } from "@/actions/userActions";
import { generateInstagramOauthLink } from "@/actions/authActions";
import FacebookLogo from "@/lib/svg-icons/FacebookLogo";
import DisconnectFacebookModal from "./DisconnectFacebookModal";

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
    name: "industry",
    label: "Industry",
    placeholder: "Industry",
  },
  {
    name: "location",
    label: "Location",
    placeholder: "Where are you located?",
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

export default function ProfileForm({ user }: { user: UserType }) {
  const [userData, setUserData] = useState(user);
  const [loading, setLoading] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null,
  );
  const [newSpecialty, setNewSpecialty] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [disconnectFacebookModalOpen, setDisconnectFacebookModalOpen] =
    useState(false);

  function updateUserData<T extends keyof UserType>(
    field: T,
    value: UserType[T],
  ) {
    setUserData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleChangeProfilePicture(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    if (file) {
      const { dataUrl, resizedFile, error } = await resizeImage(file, 128);
      if (!error) {
        setProfilePictureFile(resizedFile);
        updateUserData("profilePicture", dataUrl);
      }
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    let uploadedImageUrl = userData.profilePicture || "";
    if (profilePictureFile) {
      const { url } = await uploadImage(profilePictureFile);
      if (!url) {
        toast.error("An error occured uploading profile picture");
        setLoading(false);
        return;
      }
      uploadedImageUrl = url;
    }
    const { data } = await updateUserProfile({
      ...userData,
      profilePicture: uploadedImageUrl,
    });
    if (data) {
      toast.success("Profile updated successfully");
    } else {
      toast.error("An error occurred updating profile");
    }

    setLoading(false);
  }

  function handleAddSpecialty() {
    if (newSpecialty.trim() === "") return;
    setUserData((prev) => ({
      ...prev,
      specialties: [...(prev.specialties || []), newSpecialty],
    }));
    setNewSpecialty("");
  }

  function removeSpecialty(specialty: string) {
    setUserData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((s) => s !== specialty),
    }));
  }

  function handleAddCertification() {
    if (newCertification.trim() === "") return;
    setUserData((prev) => ({
      ...prev,
      certifications: [...(prev.certifications || []), newCertification],
    }));
    setNewCertification("");
  }

  function removeCertification(certification: string) {
    setUserData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c !== certification),
    }));
  }

  async function openInstagramOauthLink() {
    const oauthLink = await generateInstagramOauthLink(user.id);
    if (oauthLink) {
      window.location.href = oauthLink;
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-md border border-gray-200 bg-white p-4 text-sm sm:p-6"
      >
        <h2 className="flex items-center gap-2 text-xl font-semibold sm:text-2xl">
          <UserIcon className="h-5 w-5" />
          Profile Information
        </h2>
        <div className="flex flex-col items-center">
          <Avatar user={userData} className="h-24 w-24" />
          <input
            type="file"
            name="profile-picture"
            id="profile-picture"
            hidden
            disabled={loading}
            onChange={handleChangeProfilePicture}
            accept="image/png, image/jpg, image/jpeg"
          />
          <label
            htmlFor="profile-picture"
            className="flex cursor-pointer items-center gap-2 p-2"
          >
            <UploadIcon className="h-4 w-4" />
            Upload profile picture
          </label>

          {user.role === "CLIENT" &&
            (user.facebookAuth ? (
              <>
                <div className="mt-2 flex items-center gap-2">
                  <FacebookLogo size={20} color="#1877F2" />
                  <span className="font-medium text-[#1877F2]">
                    Facebook Connected
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDisconnectFacebookModalOpen(true)}
                  className="hover:text-foreground mt-2 font-medium text-gray-500 duration-200 hover:underline"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <>
                <span className="mt-2 text-center text-gray-500">
                  Login to Facebook to access your Instagram Professional
                  Account
                </span>
                <button
                  type="button"
                  onClick={openInstagramOauthLink}
                  className="mt-2 flex items-center gap-2 rounded-md bg-[#1877F2] px-4 py-2 font-medium text-white duration-200 hover:bg-[#1877F2]/90"
                >
                  <FacebookLogo size={20} />
                  Continue with Facebook
                </button>
              </>
            ))}
        </div>
        <div className="flex flex-col gap-6">
          <div className="mt-2 flex flex-col gap-2 sm:col-span-2">
            <h4 className="text-lg font-semibold">Personal Information</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              {personalInfoFields.map((field) => (
                <div
                  key={field.name}
                  className="flex flex-col gap-2 sm:last:col-span-2"
                >
                  <label className="font-medium" htmlFor={field.name}>
                    {field.label}
                  </label>
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    id={field.name}
                    placeholder={field.placeholder}
                    autoComplete="off"
                    required={field.required}
                    value={userData[field.name] as string}
                    disabled={loading}
                    onChange={(e) => updateUserData(field.name, e.target.value)}
                    className="bg-background w-full rounded-md border border-gray-300 p-2 disabled:opacity-70"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-2 sm:col-span-2">
            <h4 className="text-lg font-medium">Social Media</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              {socialMediaFields.map((field) => (
                <div key={field.name} className="flex items-center gap-2">
                  <label htmlFor={field.name} className="w-[70px] font-medium">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    id={field.name}
                    placeholder={field.placeholder}
                    autoComplete="off"
                    value={userData[field.name] as string}
                    disabled={loading}
                    onChange={(e) => updateUserData(field.name, e.target.value)}
                    className="bg-background w-0 flex-1 rounded-md border border-gray-300 p-2 disabled:opacity-70"
                  />
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
                    value={newSpecialty}
                    disabled={loading}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSpecialty();
                      }
                    }}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    className="bg-background w-0 flex-1 rounded-md border border-gray-300 p-2 pr-14 disabled:opacity-70"
                  />
                  <Button
                    onClick={handleAddSpecialty}
                    className="absolute top-0 right-0 h-full rounded-l-none"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
                {userData.specialties.length > 0 && (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {userData.specialties.map((specialty, index) => (
                      <p
                        key={index}
                        className="bg-background flex items-center gap-2 rounded-md border border-gray-200 px-2 py-1.5 text-sm"
                      >
                        <span className="flex-1">{specialty}</span>
                        <button
                          onClick={() => removeSpecialty(specialty)}
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
                    value={newCertification}
                    disabled={loading}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCertification();
                      }
                    }}
                    onChange={(e) => setNewCertification(e.target.value)}
                    className="bg-background w-0 flex-1 rounded-md border border-gray-300 p-2 pr-14 disabled:opacity-70"
                  />
                  <Button
                    onClick={handleAddCertification}
                    className="absolute top-0 right-0 h-full rounded-l-none"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
                {userData.certifications.length > 0 && (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {userData.certifications.map((certification, index) => (
                      <p
                        key={index}
                        className="bg-background flex items-center gap-2 rounded-md border border-gray-200 px-2 py-1.5 text-sm"
                      >
                        <span className="flex-1">{certification}</span>
                        <button
                          type="button"
                          onClick={() => removeCertification(certification)}
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

        <Button disabled={loading} type="submit" className="w-fit self-end">
          {loading ? (
            <>
              <LoaderIcon className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Profile"
          )}
        </Button>
      </form>

      <DisconnectFacebookModal
        closeModal={() => setDisconnectFacebookModalOpen(false)}
        open={disconnectFacebookModalOpen}
      />
    </>
  );
}
