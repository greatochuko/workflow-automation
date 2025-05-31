"use client";

import React, { useState } from "react";
import Button from "../ui/Button";
import { EyeIcon, EyeOffIcon, InfoIcon, LoaderIcon } from "lucide-react";
import { loginUser } from "@/actions/authActions";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const data = await loginUser(email, password);
    if (data?.error) {
      setErrorMessage(data.error);
    }

    setIsLoading(false);
  }

  function toggleShowPassword() {
    setShowPassword((prev) => !prev);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-sm">
      <div className="flex flex-col gap-2">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 disabled:bg-gray-100 disabled:text-gray-500"
          required
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password">Password</label>
        <div className="relative flex">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-10 w-0 flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 disabled:bg-gray-100 disabled:text-gray-500"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1 duration-200 hover:bg-gray-200 focus-visible:bg-gray-200"
          >
            {showPassword ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>
        </div>
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
            Signing in...
          </>
        ) : (
          "Sign In"
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
