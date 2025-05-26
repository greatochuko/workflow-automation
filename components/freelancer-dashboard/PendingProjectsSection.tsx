import React, { useMemo, useState } from "react";
import Button from "../ui/Button";
import { UploadIcon } from "lucide-react";
import { ProjectType } from "@/types/project";
import ProjectSubmissionModal from "../project/ProjectSubmissionModal";

export default function PendingProjectsSection({
  projects,
  updateProjectList,
  setProjectDetailsModalOpen,
  setProjectToView,
}: {
  projects: ProjectType[];
  updateProjectList(updatedProject: ProjectType): void;
  setProjectDetailsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setProjectToView: React.Dispatch<React.SetStateAction<ProjectType | null>>;
}) {
  const [projectSubmissionModalOpen, setProjectSubmissionModalOpen] =
    useState(false);
  const [projectToSubmit, setProjectToSubmit] = useState<ProjectType | null>(
    null,
  );

  const unCompletedProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          project.status === "IN_PROGRESS" || project.status === "REJECTED",
      ),
    [projects],
  );

  function closeProjectSubmissionModal() {
    setProjectSubmissionModalOpen(false);
    setTimeout(() => {
      setProjectToSubmit(null);
    }, 300);
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold sm:text-xl">
          Videos requiring your attention ({unCompletedProjects.length})
        </h3>
        <div className="w-full overflow-x-auto">
          <div className="flex gap-3">
            {unCompletedProjects.length > 0 ? (
              unCompletedProjects.map((project) => (
                <div
                  key={project.id}
                  className="w-48 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                >
                  <div className="aspect-video bg-gray-200"></div>
                  <div className="flex flex-col gap-2 p-2 text-xs">
                    <div className="">
                      <h4 className="line-clamp-1 font-medium">
                        {project.title}
                      </h4>
                      <p className="text-gray-500">{project.videoType}</p>
                    </div>
                    <Button
                      onClick={() => {
                        setProjectToSubmit(project);
                        setProjectSubmissionModalOpen(true);
                      }}
                      className="px-3 py-1.5 text-xs"
                    >
                      <UploadIcon className="h-4 w-4" />
                      Submit Edited Video
                    </Button>
                    <button
                      onClick={() => {
                        setProjectToView(project);
                        setProjectDetailsModalOpen(true);
                      }}
                      className="hover:bg-accent hover:border-accent rounded-md border border-gray-200 px-3 py-1.5 font-medium duration-200 hover:text-white"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500">
                All your assigned projects are either completed or do not
                require action.
              </div>
            )}
          </div>
        </div>
      </div>

      <ProjectSubmissionModal
        closeModal={closeProjectSubmissionModal}
        open={projectSubmissionModalOpen}
        project={projectToSubmit}
        updateProjectList={updateProjectList}
      />
    </>
  );
}
