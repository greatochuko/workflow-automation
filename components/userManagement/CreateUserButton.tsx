"use client";

import React, { useState } from "react";
import Button from "../ui/Button";
import { UserPlus } from "lucide-react";
import CreateUserModal from "./CreateUserModal";

export default function CreateUserButton() {
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setCreateUserModalOpen(true)}>
        <UserPlus className="h-4 w-4" />
        Create User
      </Button>
      <CreateUserModal
        closeModal={() => setCreateUserModalOpen(false)}
        open={createUserModalOpen}
      />
    </>
  );
}
