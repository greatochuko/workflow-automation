"use client";

import React, { useState } from "react";
import Button from "../ui/Button";
import { InfoIcon, LoaderIcon } from "lucide-react";
import { setNewPassword } from "@/actions/authActions";

export default function SetNewPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    if (password !== confirmPassword) {
      setErrorMessage("New password and confirmation do not match.");
      return;
    }

    setErrorMessage("");

    const data = await setNewPassword(confirmPassword);
    if (data?.error) {
      setErrorMessage(data.error);
    }

    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
      <div className="flex flex-col gap-2">
        <label htmlFor="new-password">New Password</label>
        <input
          id="new-password"
          type="password"
          placeholder="Enter your new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-10 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 disabled:bg-gray-100 disabled:text-gray-500"
          required
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          id="confirm-password"
          type="password"
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="h-10 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 disabled:bg-gray-100 disabled:text-gray-500"
          required
          disabled={isLoading}
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="flex h-10 w-full items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <span className="animate-spin">
              <LoaderIcon className="h-4 w-4" />
            </span>
            Saving...
          </>
        ) : (
          "Save New Password"
        )}
      </Button>

      {errorMessage && (
        <span className="flex w-fit items-center gap-1 rounded-md bg-red-100/80 px-2 py-1.5 text-xs text-red-500">
          <InfoIcon className="h-3.5 w-3.5" />
          {errorMessage}
        </span>
      )}
    </form>
  );
}
