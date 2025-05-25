import React from "react";
import ModalContainer from "../ui/ModalContainer";
import { ProjectType } from "@/types/project";
import { XIcon } from "lucide-react";
import Button from "../ui/Button";

export default function ProjectSubmissionModal({
  open,
  closeModal,
  project,
}: {
  open: boolean;
  closeModal: () => void;
  project: ProjectType | null;
}) {
  return (
    <ModalContainer open={open} closeModal={closeModal}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background flex max-h-[85%] w-[90%] max-w-xl flex-col gap-4 overflow-hidden overflow-y-auto rounded-md p-4"
      >
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold sm:text-xl">
            Submit finished project
          </h4>
          <button
            onClick={closeModal}
            className="hover:text-foreground p-2 text-gray-500 duration-200"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <h5 className="font-medium">{project?.title}</h5>
          <p className="text-sm text-gray-500">{project?.description}</p>
        </div>

        <div className="flex flex-col gap-3 rounded-md border border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-1">
            <h4 className="font-medium">AI Generated Caption</h4>
            <p className="text-sm text-gray-500">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
              nobis, reprehenderit nam unde accusamus natus aspernatur ipsum hic
              beatae. Tempora rerum libero reprehenderit reiciendis saepe?
              Expedita sint eos consequuntur magnam.
            </p>
          </div>
        </div>

        <input
          type="file"
          name="finished-project"
          id="finished-project"
          className="cursor-pointer rounded-md border border-gray-200 p-1 text-sm file:cursor-pointer file:rounded-md file:border file:border-gray-200 file:bg-gray-100 file:p-2 file:duration-200 placeholder:text-gray-500 hover:file:bg-gray-200"
        />

        <Button className="self-end">Submit</Button>
      </div>
    </ModalContainer>
  );
}
