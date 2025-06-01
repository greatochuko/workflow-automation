import { UserType } from "@/types/user";
import React, { useMemo, useState } from "react";
import { ChevronDownIcon, LoaderIcon } from "lucide-react";
import Button from "../ui/Button";
import { saveUserKnowledgeBase } from "@/actions/userActions";
import { toast } from "sonner";
import { defaultKnowledgeBaseItems } from "@/lib/data/knowledgeBase";

function getKnowledgeBasePlaceholder(kbId: string) {
  return defaultKnowledgeBaseItems.find((kb) => kb.id === kbId)?.placeholder;
}

export default function KnowledgeBase({ client }: { client: UserType }) {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [clientKnowledgeBase, setClientKnowledgeBase] = useState(
    client.knowledgeBase,
  );
  const [knowledgeBaseItems, setKnowledgeBaseItems] = useState(
    client.knowledgeBase,
  );

  const toggleKnowledgeBaseItem = (id: string) =>
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );

  const allItemsOpen = knowledgeBaseItems.every(({ id }) =>
    openItems.includes(id),
  );
  const toggleExpandAll = () =>
    setOpenItems(allItemsOpen ? [] : knowledgeBaseItems.map(({ id }) => id));

  const handleChangeKnowledgeBaseItem = (id: string, value: string) =>
    setKnowledgeBaseItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, content: value } : item)),
    );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await saveUserKnowledgeBase(
      client.id,
      knowledgeBaseItems,
    );

    if (error === null) {
      setClientKnowledgeBase(knowledgeBaseItems);
      toast.success(`Knowledge base updated for ${client.fullName}`);
    } else {
      toast.error(error);
    }

    setLoading(false);
  };

  const knowledgeBaseDataChanged = useMemo(() => {
    const normalize = (arr: typeof knowledgeBaseItems) =>
      JSON.stringify(
        arr.map(({ id, content }) => ({ id, content: content.trim() })),
      );
    return normalize(knowledgeBaseItems) !== normalize(clientKnowledgeBase);
  }, [knowledgeBaseItems, clientKnowledgeBase]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-md border border-gray-300 bg-white p-4 sm:gap-6 sm:p-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold sm:text-xl lg:text-2xl">
            Knowledge Base for {client.fullName}
          </h2>
          <p className="text-sm text-gray-500">
            Manage content guidance data for {client.fullName} to improve
            content generation
          </p>
        </div>
        <button
          type="button"
          onClick={toggleExpandAll}
          className="hover:bg-accent hover:border-accent flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium duration-200 hover:text-white"
        >
          <ChevronDownIcon
            className={`h-4 w-4 duration-200 ${allItemsOpen ? "-rotate-180" : ""}`}
          />
          {allItemsOpen ? "Collapse" : "Expand"} All
        </button>
      </div>

      <div className="flex flex-col">
        {knowledgeBaseItems.map((kb) => {
          const isOpen = openItems.includes(kb.id);
          return (
            <div
              key={kb.id}
              className="overflow-hidden border-b border-b-gray-300"
            >
              <h4
                onClick={() => toggleKnowledgeBaseItem(kb.id)}
                className="flex w-full cursor-pointer items-center justify-between rounded-md py-4 text-left font-medium hover:underline"
              >
                <span>{kb.title}</span>
                <ChevronDownIcon
                  className={`h-4 w-4 duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </h4>
              <div
                className={`flex flex-col gap-2 duration-300 ease-in-out ${
                  isOpen ? "max-h-40 py-2 pb-4" : "max-h-0 overflow-hidden"
                }`}
              >
                <label htmlFor={kb.id} className="text-sm font-medium">
                  {kb.title} for {client.fullName}
                </label>
                <textarea
                  name={kb.id}
                  id={kb.id}
                  rows={4}
                  disabled={loading}
                  value={kb.content}
                  placeholder={getKnowledgeBasePlaceholder(kb.id)}
                  onChange={(e) =>
                    handleChangeKnowledgeBaseItem(kb.id, e.target.value)
                  }
                  className="bg-background mx-1 resize-none rounded-md border border-gray-300 px-3 py-2 text-sm"
                ></textarea>
              </div>
            </div>
          );
        })}
      </div>
      <Button
        type="submit"
        disabled={loading || !knowledgeBaseDataChanged}
        className="ml-auto w-fit"
      >
        {loading ? (
          <>
            <LoaderIcon className="h-4 w-4 animate-spin" /> Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  );
}
