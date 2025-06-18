import React, { useState } from "react";
import ModalContainer from "../ui/ModalContainer";
import { CheckIcon, XIcon } from "lucide-react";
import { SOPSettingType } from "@/types/user";
import { useMemo } from "react";
import Checkbox from "../ui/Checkbox";
import Button from "../ui/Button";

export default function ClientSOPModal({
  open,
  closeModal,
  SOPChecklist,
}: {
  open: boolean;
  closeModal: () => void;
  SOPChecklist: SOPSettingType[];
}) {
  const [checkedTaskIds, setCheckedTaskIds] = useState<string[]>([]);

  function toggleCheckTask(taskId: string) {
    setCheckedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((tsk) => tsk !== taskId)
        : [...prev, taskId],
    );
  }

  const structuredList = useMemo(() => {
    const map: { [type: string]: { id: string; content: string }[] } = {};
    SOPChecklist.forEach((item) => {
      if (!map[item.type]) {
        map[item.type] = [];
      }
      map[item.type].push({ id: item.id, content: item.content });
    });
    return Object.entries(map).map(([type, children]) => ({
      type,
      children,
    }));
  }, [SOPChecklist]);

  return (
    <ModalContainer open={open} closeModal={closeModal}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background max-h-[85vh] w-[90%] max-w-3xl overflow-hidden overflow-y-auto rounded-lg p-4 sm:p-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold sm:text-xl">
            Reels Editing - Standard Operating Procedure
          </h3>
          <button
            onClick={closeModal}
            className="hover:text-foreground p-1 text-gray-500 duration-200"
          >
            <XIcon size={16} />
          </button>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <p className="text-sm text-gray-500">
            Progress: {checkedTaskIds.length}/{SOPChecklist.length} completed
          </p>
          <div className="h-2 flex-1 overflow-hidden rounded-full">
            <div
              className="bg-accent-black h-full duration-200"
              style={{
                width:
                  Math.floor(checkedTaskIds.length / SOPChecklist.length) *
                    100 +
                  "%",
              }}
            ></div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {structuredList.map((list, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-lg border border-gray-300 bg-white p-4 sm:p-6"
            >
              <h5 className="text-lg font-semibold uppercase">{list.type}</h5>
              <div className="flex flex-col gap-2">
                {list.children.map((value) => (
                  <label
                    key={value.id}
                    htmlFor={value.id}
                    className={`flex w-fit cursor-pointer items-center gap-2 text-sm ${checkedTaskIds.includes(value.id) ? "text-gray-500 line-through" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={checkedTaskIds.includes(value.id)}
                      onChange={() => toggleCheckTask(value.id)}
                      name={value.id}
                      id={value.id}
                      hidden
                    />
                    <Checkbox
                      checked={checkedTaskIds.includes(value.id)}
                      onCheckChange={() => toggleCheckTask(value.id)}
                    />
                    {value.content}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm">
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full border-1 ${checkedTaskIds.length === SOPChecklist.length ? "border-green-600" : "border-gray-500"}`}
            >
              {checkedTaskIds.length === SOPChecklist.length && (
                <CheckIcon size={12} className="text-green-600" />
              )}
            </span>
            Complete all items to finish
          </p>
          <Button
            disabled={checkedTaskIds.length !== SOPChecklist.length}
            onClick={closeModal}
          >
            Complete
          </Button>
        </div>
      </div>
    </ModalContainer>
  );
}
