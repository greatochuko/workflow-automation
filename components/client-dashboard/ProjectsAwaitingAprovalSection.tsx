import React, { useMemo, useState } from "react";
import { ProjectType } from "@/types/project";
import RejectProjectModal from "./ProjectActionModal";
import ProjectThumbnail from "../project/ProjectThumbnail";

export default function ProjectsAwaitingApprovalSection({
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
  const [projectActionModal, setProjectActionModal] = useState<{
    open: boolean;
    type: "approve" | "reject" | "";
    projectId: string;
  }>({ open: false, type: "", projectId: "" });
  const [showAll, setShowAll] = useState(false);

  const submittedProjects = useMemo(
    () => projects.filter((project) => project.status === "SUBMITTED"),
    [projects],
  );

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold sm:text-xl">
            Videos requiring your attention ({submittedProjects.length})
          </h3>
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="text-accent text-sm font-medium hover:underline"
          >
            {showAll ? "Show less" : "Show all"}
          </button>
        </div>
        <div className="w-full overflow-x-auto">
          {submittedProjects.length > 0 ? (
            <div
              className="grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-3 overflow-hidden transition-all duration-300"
              style={{ maxHeight: showAll ? "none" : 240 }}
            >
              {submittedProjects.map((project) => (
                <div
                  key={project.id}
                  className="w-48 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                >
                  <ProjectThumbnail file={project.completedFile} />

                  <div className="flex flex-col gap-2 p-2 text-xs">
                    <div className="">
                      <h4 className="line-clamp-1 font-medium">
                        {project.title}
                      </h4>
                      <p className="text-gray-500">{project.videoType}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setProjectActionModal({
                            open: true,
                            type: "reject",
                            projectId: project.id,
                          })
                        }
                        className="flex-1 rounded-md border border-red-200 py-1.5 text-xs text-red-600 duration-200 hover:bg-red-50"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() =>
                          setProjectActionModal({
                            open: true,
                            type: "approve",
                            projectId: project.id,
                          })
                        }
                        className="flex-1 rounded-md border border-emerald-600 bg-emerald-600 py-1.5 text-xs text-white duration-200 hover:bg-emerald-700"
                      >
                        Approve
                      </button>
                    </div>

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
              There are no projects awaiting your approval at the moment.
            </div>
          )}
        </div>
      </div>

      <RejectProjectModal
        closeModal={() =>
          setProjectActionModal((prev) => ({
            ...prev,
            open: false,
            projectId: "",
          }))
        }
        open={projectActionModal.open}
        projectId={projectActionModal.projectId}
        actionType={projectActionModal.type}
        updateProjectList={updateProjectList}
      />
    </>
  );
}
