"use client";

import React, { useState } from "react";
import Button from "../ui/Button";
import { UserPlus } from "lucide-react";
import CreateUserModal from "./CreateUserModal";
import { UserType } from "@/types/user";

export default function CreateUserButton({
  addNewUserToList,
}: {
  addNewUserToList(newUser: UserType): void;
}) {
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
        addNewUserToList={addNewUserToList}
      />
    </>
  );
}
