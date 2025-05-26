"use client";

import { LoaderIcon, LockIcon } from "lucide-react";
import React, { useState } from "react";
import Button from "../ui/Button";
import { changeUserPassword } from "@/actions/userActions";
import { toast } from "sonner";

type PasswordFieldName =
  | "currentPassword"
  | "newPassword"
  | "confirmNewPassword";

const passwordFields: {
  name: PasswordFieldName;
  label: string;
  type: string;
  placeholder: string;
}[] = [
  {
    name: "currentPassword",
    label: "Current Password",
    type: "password",
    placeholder: "Enter your current password",
  },
  {
    name: "newPassword",
    label: "New Password",
    type: "password",
    placeholder: "Enter your new password",
  },
  {
    name: "confirmNewPassword",
    label: "Confirm New Password",
    type: "password",
    placeholder: "Confirm your new password",
  },
];

export default function ChangePasswordForm() {
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState<
    Record<PasswordFieldName, string>
  >({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  function updatePasswordData(field: PasswordFieldName, value: string) {
    setPasswordData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  }

  const passwordsDontMatch =
    passwordData.newPassword !== passwordData.confirmNewPassword;

  const cannotSubmit =
    loading ||
    !passwordData.currentPassword.trim() ||
    !passwordData.newPassword.trim() ||
    passwordData.newPassword.length < 8 ||
    !passwordData.confirmNewPassword.trim() ||
    passwordsDontMatch;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (cannotSubmit) return;
    const { data, error } = await changeUserPassword(
      passwordData.currentPassword,
      passwordData.newPassword,
    );
    if (data) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      toast.success("Password changed successfully!");
    } else {
      toast.error(error);
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-md border border-gray-200 bg-white p-4 text-sm sm:p-6"
    >
      <h2 className="flex items-center gap-2 text-xl font-semibold sm:text-2xl">
        <LockIcon className="h-5 w-5" /> Change Password
      </h2>

      {passwordFields.map((field) => (
        <div
          key={field.name}
          className="flex flex-col gap-2 sm:last:col-span-2"
        >
          <label className="font-medium" htmlFor={field.name}>
            {field.label}
          </label>
          <input
            type={field.type}
            name={field.name}
            id={field.name}
            placeholder={field.placeholder}
            autoComplete="off"
            value={passwordData[field.name]}
            disabled={loading}
            required
            onChange={(e) => updatePasswordData(field.name, e.target.value)}
            className="bg-background w-full rounded-md border border-gray-300 p-2 disabled:opacity-70"
          />
          {passwordData.newPassword &&
            passwordData.newPassword.length < 8 &&
            field.name === "newPassword" && (
              <p className="text-red-500">
                New password must be at least 8 characters long.
              </p>
            )}
          {passwordData.confirmNewPassword &&
            passwordsDontMatch &&
            field.name === "confirmNewPassword" && (
              <p className="text-red-500">
                New password and confirmation do not match.
              </p>
            )}
        </div>
      ))}

      <Button disabled={cannotSubmit} type="submit" className="w-fit self-end">
        {loading ? (
          <>
            <LoaderIcon className="h-4 w-4 animate-spin" />
            Changing...
          </>
        ) : (
          "Change Password"
        )}
      </Button>
    </form>
  );
}
