"use client";

import React, { useState } from "react";
import Avatar from "../ui/Avatar";
import { UserType } from "@/types/user";
import { resizeImage } from "@/lib/utils/imageResize";
import { PlusIcon, UploadIcon, XIcon } from "lucide-react";
import Button from "../ui/Button";

export default function ProfileForm({ user }: { user: UserType }) {
  const [userData, setUserData] = useState(user);
  const [loading, setLoading] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null,
  );
  const [newSpecialty, setNewSpecialty] = useState("");
  const [newCertification, setNewCertification] = useState("");

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
    setLoading(true);

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

  function handleAddCertification() {
    if (newCertification.trim() === "") return;
    setUserData((prev) => ({
      ...prev,
      certifications: [...(prev.certifications || []), newCertification],
    }));
    setNewCertification("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-md border border-gray-200 bg-white p-4 text-sm sm:p-6"
    >
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
      </div>
      <div className="flex flex-col gap-6">
        <div className="mt-2 flex flex-col gap-2 sm:col-span-2">
          <h4 className="text-lg font-semibold">Personal Information</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="font-medium" htmlFor="full-name">
                Full Name
              </label>
              <input
                type="text"
                name="full-name"
                id="full-name"
                placeholder="John Doe"
                autoComplete="off"
                value={userData.fullName}
                disabled={loading}
                onChange={(e) => updateUserData("fullName", e.target.value)}
                className="bg-background w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="user@example.com"
                autoComplete="off"
                value={userData.email}
                disabled={loading}
                onChange={(e) => updateUserData("email", e.target.value)}
                className="bg-background w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium" htmlFor="company">
                Company
              </label>
              <input
                type="text"
                name="company"
                id="company"
                placeholder="Company (optional)"
                autoComplete="off"
                value={userData.companyName}
                disabled={loading}
                onChange={(e) => updateUserData("companyName", e.target.value)}
                className="bg-background w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium" htmlFor="phone-number">
                Phone
              </label>
              <input
                type="text"
                name="phone-number"
                id="phone-number"
                placeholder="Your phone number"
                autoComplete="off"
                value={userData.phoneNumber}
                disabled={loading}
                onChange={(e) => updateUserData("phoneNumber", e.target.value)}
                className="bg-background w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="font-medium" htmlFor="website">
                Website
              </label>
              <input
                type="text"
                name="website"
                id="website"
                placeholder="Your phone number"
                autoComplete="off"
                value={userData.phoneNumber}
                disabled={loading}
                onChange={(e) => updateUserData("phoneNumber", e.target.value)}
                className="bg-background w-full rounded-md border border-gray-300 p-2"
              />
            </div>
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-2 sm:col-span-2">
          <h4 className="text-lg font-medium">Social Media</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <label htmlFor="instagram" className="flex items-center gap-2">
              <span className="font-medium">Instagram</span>
              <input
                type="text"
                name="instagram"
                id="instagram"
                placeholder="https://www.instagram.com/yourprofile"
                autoComplete="off"
                value={userData.instagram}
                disabled={loading}
                onChange={(e) => updateUserData("instagram", e.target.value)}
                className="bg-background w-0 flex-1 rounded-md border border-gray-300 p-2"
              />
            </label>
            <label htmlFor="facebook" className="flex items-center gap-2">
              <span className="font-medium">Facebook</span>
              <input
                type="text"
                name="facebook"
                id="facebook"
                placeholder="https://www.facebook.com/yourprofile"
                autoComplete="off"
                value={userData.facebook}
                disabled={loading}
                onChange={(e) => updateUserData("facebook", e.target.value)}
                className="bg-background w-0 flex-1 rounded-md border border-gray-300 p-2"
              />
            </label>
            <label htmlFor="twitter" className="flex items-center gap-2">
              <span className="font-medium">Twitter (X)</span>
              <input
                type="text"
                name="twitter"
                id="twitter"
                placeholder="https://www.x.com/yourprofile"
                autoComplete="off"
                value={userData.twitter}
                disabled={loading}
                onChange={(e) => updateUserData("twitter", e.target.value)}
                className="bg-background w-0 flex-1 rounded-md border border-gray-300 p-2"
              />
            </label>
            <label htmlFor="threads" className="flex items-center gap-2">
              <span className="font-medium">Threads</span>
              <input
                type="text"
                name="threads"
                id="threads"
                placeholder="https://www.threads.com/in/yourprofile"
                autoComplete="off"
                value={userData.threads}
                disabled={loading}
                onChange={(e) => updateUserData("threads", e.target.value)}
                className="bg-background w-0 flex-1 rounded-md border border-gray-300 p-2"
              />
            </label>
            <label htmlFor="linkedin" className="flex items-center gap-2">
              <span className="font-medium">LinkedIn</span>
              <input
                type="text"
                name="linkedin"
                id="linkedin"
                placeholder="https://www.linkedin.com/in/yourprofile"
                autoComplete="off"
                value={userData.linkedin}
                disabled={loading}
                onChange={(e) => updateUserData("linkedin", e.target.value)}
                className="bg-background w-0 flex-1 rounded-md border border-gray-300 p-2"
              />
            </label>
            <label htmlFor="youtube" className="flex items-center gap-2">
              <span className="font-medium">YouTube</span>
              <input
                type="text"
                name="youtube"
                id="youtube"
                placeholder="https://www.youtube.com/c/yourchannel"
                autoComplete="off"
                value={userData.youtube}
                disabled={loading}
                onChange={(e) => updateUserData("youtube", e.target.value)}
                className="bg-background w-0 flex-1 rounded-md border border-gray-300 p-2"
              />
            </label>
            <label htmlFor="tiktok" className="flex items-center gap-2">
              <span className="font-medium">TikTok</span>
              <input
                type="text"
                name="tiktok"
                id="tiktok"
                placeholder="https://www.tiktok.com/@yourprofile"
                autoComplete="off"
                value={userData.tiktok}
                disabled={loading}
                onChange={(e) => updateUserData("tiktok", e.target.value)}
                className="bg-background w-0 flex-1 rounded-md border border-gray-300 p-2"
              />
            </label>
            <label htmlFor="snapchat" className="flex items-center gap-2">
              <span className="font-medium">Snapchat</span>
              <input
                type="text"
                name="snapchat"
                id="snapchat"
                placeholder="https://www.snapchat.com/add/yourprofile"
                autoComplete="off"
                value={userData.snapchat}
                disabled={loading}
                onChange={(e) => updateUserData("snapchat", e.target.value)}
                className="bg-background w-0 flex-1 rounded-md border border-gray-300 p-2"
              />
            </label>
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
                  className="bg-background w-0 flex-1 rounded-md border border-gray-300 p-2 pr-14"
                />
                <Button
                  onClick={handleAddSpecialty}
                  className="absolute top-0 right-0 h-full rounded-l-none"
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {userData.specialties.map((specialty, index) => (
                  <p
                    key={index}
                    className="bg-background mr-2 mb-2 flex items-center gap-2 rounded-md border border-gray-200 px-2 py-1.5 text-sm"
                  >
                    <span className="flex-1">{specialty}</span>
                    <button className="hover:text-foreground rounded-md p-1 text-gray-500 duration-200 hover:bg-gray-200">
                      <XIcon className="h-4 w-4" />
                    </button>
                  </p>
                ))}
              </div>
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
                  className="bg-background w-0 flex-1 rounded-md border border-gray-300 p-2 pr-14"
                />
                <Button
                  onClick={handleAddCertification}
                  className="absolute top-0 right-0 h-full rounded-l-none"
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {userData.certifications.map((certification, index) => (
                  <p
                    key={index}
                    className="bg-background mr-2 mb-2 flex items-center gap-2 rounded-md border border-gray-200 px-2 py-1.5 text-sm"
                  >
                    <span className="flex-1">{certification}</span>
                    <button className="hover:text-foreground rounded-md p-1 text-gray-500 duration-200 hover:bg-gray-200">
                      <XIcon className="h-4 w-4" />
                    </button>
                  </p>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <Button className="w-fit self-end">Save Profile</Button>
    </form>
  );
}
