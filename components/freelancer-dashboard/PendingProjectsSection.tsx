import React, { useMemo, useState } from "react";
import Button from "../ui/Button";
import { UploadIcon } from "lucide-react";
import { ProjectType } from "@/types/project";
import ProjectSubmissionModal from "../project/ProjectSubmissionModal";
import ProjectThumbnail from "../project/ProjectThumbnail";

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
  const [showAll, setShowAll] = useState(false);

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
        <div className="flex justify-between gap-4">
          <h3 className="text-lg font-semibold sm:text-xl">
            Videos requiring your attention ({unCompletedProjects.length})
          </h3>
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="text-accent text-sm font-medium whitespace-nowrap hover:underline focus-visible:underline"
          >
            {showAll ? "Show less" : "Show all"}
          </button>
        </div>
        {unCompletedProjects.length > 0 ? (
          <div
            className={`grid grid-cols-2 gap-3 overflow-hidden sm:grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] ${showAll ? "" : "max-h-[min(58.5vw,_240px)] min-[390px]:max-h-[min(56vw,_240px)]"}`}
          >
            {unCompletedProjects.map((project) => (
              <div
                key={project.id}
                className="flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
              >
                <ProjectThumbnail file={project.files?.at(0)} />

                <div className="flex flex-col gap-2 p-2 text-xs">
                  <div className="">
                    <h4 className="line-clamp-1 font-medium">
                      {project.title}
                    </h4>
                    <p className="line-clamp-1 text-gray-500">
                      {project.videoType}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setProjectToSubmit(project);
                      setProjectSubmissionModalOpen(true);
                    }}
                    className="px-3 py-1.5 text-xs"
                  >
                    <UploadIcon className="h-4 w-4" />
                    Submit <span className="hidden sm:block">Edited</span> Video
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
            ))}
          </div>
        ) : (
          <div className="text-gray-500">
            All your assigned projects are either completed or do not require
            action.
          </div>
        )}
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
