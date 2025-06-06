import React, { useState } from "react";
import ModalContainer from "../ui/ModalContainer";
import { LoaderIcon, UploadIcon, UserIcon, UserPlus } from "lucide-react";
import Button from "../ui/Button";
import Image from "next/image";
import { resizeImage } from "@/lib/utils/imageResize";
import { createUser } from "@/actions/userActions";
import { uploadImage } from "@/lib/utils/imageUpload";

type UserDataType = {
  fullName: string;
  role: "CLIENT" | "FREELANCER";
  email: string;
  profilePicture: string;
  password: string;
  companyName: string;
  industry: string;
  location: string;
  specialties: string;
};

const initialUserData: UserDataType = {
  fullName: "",
  role: "CLIENT",
  email: "",
  profilePicture: "",
  password: "",
  companyName: "",
  industry: "",
  location: "",
  specialties: "",
};

export default function CreateUserModal({
  open,
  closeModal: closeUserModal,
}: {
  open: boolean;
  closeModal: () => void;
}) {
  const [userData, setUserData] = useState<UserDataType>(initialUserData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null,
  );

  function updateUserData<T extends keyof UserDataType>(
    field: T,
    value: UserDataType[T],
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

  function closeModal() {
    setUserData(initialUserData);
    closeUserModal();
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    let uploadedImageUrl = "";
    if (profilePictureFile) {
      const { url } = await uploadImage(profilePictureFile);
      if (!url) {
        setError("An error occured uploading profile picture");
        setLoading(false);
        return;
      }
      uploadedImageUrl = url;
    }

    const { error: createUserError } = await createUser({
      ...userData,
      specialties: userData.specialties.split(",").map((s) => s.trim()),
      profilePicture: uploadedImageUrl,
    });
    if (createUserError) {
      setError(createUserError);
    } else {
      closeModal();
    }

    setLoading(false);
  }

  return (
    <ModalContainer open={open} closeModal={closeModal}>
      <form
        onSubmit={handleCreateUser}
        onClick={(e) => e.stopPropagation()}
        className={`flex max-h-[85%] w-[90%] max-w-xl flex-col rounded-md bg-white text-sm shadow ${open ? "" : "scale-105"}`}
      >
        <h3 className="flex items-center justify-center gap-3 bg-white p-4 pb-2 text-lg font-semibold sm:p-6 sm:pb-3 sm:text-xl">
          <UserPlus className="h-4 w-4 sm:h-5 sm:w-5" />
          Create New User
        </h3>

        <div className="flex flex-col gap-4 overflow-y-auto p-4 sm:p-6">
          <label
            htmlFor="profile-picture"
            className="group flex cursor-pointer flex-col items-center gap-2"
          >
            <input
              type="file"
              name="profile-picture"
              id="profile-picture"
              hidden
              disabled={loading}
              onChange={handleChangeProfilePicture}
              accept="image/png, image/jpg, image/jpeg"
            />
            <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-200">
              {userData.profilePicture ? (
                <Image
                  src={userData.profilePicture}
                  alt={`${userData.fullName} profile picture`}
                  fill
                  className="object-cover"
                />
              ) : (
                <UserIcon className="text-gray-500 duration-200 group-hover:scale-110 group-hover:text-gray-600" />
              )}
            </div>
            <p className="flex items-center justify-center gap-2">
              <UploadIcon className="h-4 w-4" />
              {userData.profilePicture ? "Change" : "Upload"} Profile Picture
            </p>
          </label>

          <div className="flex flex-col gap-2">
            <label htmlFor="user-role" className="font-medium">
              User Role
            </label>
            <select
              name="user-role"
              id="user-role"
              value={userData.role}
              disabled={loading}
              onChange={(e) =>
                updateUserData("role", e.target.value as UserDataType["role"])
              }
              className="bg-background rounded-md border border-gray-300 p-2"
            >
              <option value="CLIENT">Client</option>
              <option value="FREELANCER">Freelancer</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="user-full-name" className="font-medium">
              Full Name
            </label>
            <input
              type="text"
              name="user-full-name"
              id="user-full-name"
              placeholder="John Doe"
              value={userData.fullName}
              disabled={loading}
              onChange={(e) => updateUserData("fullName", e.target.value)}
              className="bg-background rounded-md border border-gray-300 p-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="no-autofill-email" className="font-medium">
              Email
            </label>
            <input
              type="email"
              name="no-autofill-email"
              id="no-autofill-email"
              autoComplete="off"
              placeholder="user@example.com"
              value={userData.email}
              disabled={loading}
              onChange={(e) => updateUserData("email", e.target.value)}
              className="bg-background rounded-md border border-gray-300 p-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="initial-password" className="font-medium">
              Initial Password
            </label>
            <input
              type="password"
              name="initial-password"
              id="initial-password"
              autoComplete="off"
              placeholder="Set initial password"
              value={userData.password}
              disabled={loading}
              onChange={(e) => updateUserData("password", e.target.value)}
              className="bg-background rounded-md border border-gray-300 p-2"
            />
            <p className="text-gray-500">
              User can change this after first login
            </p>
          </div>

          {userData.role === "CLIENT" ? (
            <>
              <div className="flex flex-col gap-2">
                <label htmlFor="company-name" className="font-medium">
                  Company
                </label>
                <input
                  type="text"
                  name="company-name"
                  id="company-name"
                  placeholder="Acme Inc."
                  value={userData.companyName}
                  disabled={loading}
                  onChange={(e) =>
                    updateUserData("companyName", e.target.value)
                  }
                  className="bg-background rounded-md border border-gray-300 p-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="industry" className="font-medium">
                  Industry
                </label>
                <input
                  type="text"
                  name="industry"
                  id="industry"
                  placeholder="e.g. Marketing, Technology, Finance"
                  value={userData.industry}
                  disabled={loading}
                  onChange={(e) => updateUserData("industry", e.target.value)}
                  className="bg-background rounded-md border border-gray-300 p-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="location" className="font-medium">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  placeholder="e.g. New York, London"
                  value={userData.location}
                  disabled={loading}
                  onChange={(e) => updateUserData("location", e.target.value)}
                  className="bg-background rounded-md border border-gray-300 p-2"
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <label htmlFor="specialties" className="font-medium">
                Specialties
              </label>
              <input
                type="text"
                name="specialties"
                id="specialties"
                placeholder="Video Editor, Social Media Manager"
                value={userData.specialties}
                disabled={loading}
                onChange={(e) => updateUserData("specialties", e.target.value)}
                className="bg-background rounded-md border border-gray-300 p-2"
              />
              <p className="text-gray-500">
                Enter specialties separated by commas
              </p>
            </div>
          )}
        </div>

        <div
          className={`flex flex-wrap justify-between bg-white p-4 sm:p-6 ${error ? "pt-2 sm:pt-3" : ""}`}
        >
          {error && <p className="mb-4 w-full text-red-500">{error}</p>}
          <button
            type="button"
            onClick={closeModal}
            className="w-fit rounded-md border border-gray-300 bg-gray-50 px-4 py-2 duration-200 hover:bg-gray-100"
          >
            Cancel
          </button>
          <Button disabled={loading} type="submit" className="w-fit">
            {loading ? (
              <>
                <LoaderIcon className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create User"
            )}
          </Button>
        </div>
      </form>
    </ModalContainer>
  );
}
