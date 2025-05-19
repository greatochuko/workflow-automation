"use client";

import React from "react";
import CustomButton from "../ui/CustomButton";
import { logoutUser } from "@/actions/authActions";

export default function LogoutButton() {
  return <CustomButton onClick={logoutUser}>Logout</CustomButton>;
}
