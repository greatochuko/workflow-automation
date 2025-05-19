"use client";

import React, { useState } from "react";
import CustomButton from "../ui/CustomButton";
import { UserPlus } from "lucide-react";
import CreateUserModal from "./CreateUserModal";

export default function CreateUserButton() {
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);

  return (
    <>
      <CustomButton onClick={() => setCreateUserModalOpen(true)}>
        <UserPlus className="h-4 w-4" />
        Create User
      </CustomButton>
      <CreateUserModal
        closeModal={() => setCreateUserModalOpen(false)}
        open={createUserModalOpen}
      />
    </>
  );
}
