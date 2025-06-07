import { useState } from "react";
import { Plus, Trash2, Save, LoaderIcon, ChevronDownIcon } from "lucide-react";
import { toast } from "sonner";
import Button from "../ui/Button";
import { UserType } from "@/types/user";
import { saveUserNewsletterSettings } from "@/actions/userActions";

interface NewsletterTemplateSettingsProps {
  client: UserType;
}

export function NewsletterTemplateSettings({
  client,
}: NewsletterTemplateSettingsProps) {
  const [basicInstructions, setBasicInstructions] = useState(
    client.newsLetterBasicInstructions,
  );
  const [examples, setExamples] = useState<string[]>(client.newsletterExamples);
  const [monthlyCredits, setMonthlyCredits] = useState(client.monthlyCredits);
  const [loading, setLoading] = useState(false);
  const [expandBasicInstructions, setExpandBasicInstructions] = useState(false);
  const [newExample, setNewExample] = useState("");
  const [expandedExamples, setExpandedExamples] = useState<number[]>([]);

  const handleCreditsChange = (value: string) => {
    const credits = parseInt(value) || 0;
    setMonthlyCredits(credits);
  };

  const addExample = () => {
    if (newExample.trim()) {
      setExamples((prev) => [...prev, newExample.trim()]);
      setNewExample("");
    }
  };

  const removeExample = (index: number) => {
    setExamples((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleExample = (index: number) => {
    if (expandedExamples.includes(index)) {
      setExpandedExamples((prev) => prev.filter((n) => n !== index));
    } else {
      setExpandedExamples((prev) => [...prev, index]);
    }
  };

  const saveSettings = async () => {
    setLoading(true);

    const { error } = await saveUserNewsletterSettings(client.id, {
      monthlyCredits,
      newsLetterBasicInstructions: basicInstructions,
      newsletterExamples: examples,
    });

    if (error === null) {
      toast.success("Newsletter settings saved successfully!");
    } else {
      toast.error("Failed to save newsletter settings. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Newsletter Content Settings</h3>
        <p className="text-sm text-gray-500">
          Configure newsletter content generation for {client.fullName}
        </p>
      </div>

      {/* Monthly Credits */}
      <div className="flex flex-col gap-4 rounded-md border border-gray-300 bg-white p-4 sm:p-6">
        <h4 className="font-semibold">Monthly Credits</h4>
        <div className="flex flex-col gap-1">
          <label htmlFor="credits" className="text-sm font-medium">
            Monthly Newsletter Content Credits
          </label>
          <input
            id="credits"
            type="number"
            min="0"
            value={monthlyCredits}
            onChange={(e) => handleCreditsChange(e.target.value)}
            placeholder="Number of templates per month"
            className="bg-background w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            Number of newsletter templates the client can generate per month
          </p>
        </div>
      </div>

      {/* Basic Instructions */}
      <div className="flex flex-col gap-6 rounded-md border border-gray-300 bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold">Basic Instructions</h4>
          <div className="overflow-hidden border-b border-b-gray-300">
            <h5
              onClick={() => setExpandBasicInstructions((prev) => !prev)}
              className="flex w-full cursor-pointer items-center justify-between rounded-md py-2 text-left text-sm font-medium hover:underline"
            >
              <span>Newsletter Generation Instructions</span>
              <ChevronDownIcon
                className={`h-4 w-4 duration-200 ${expandBasicInstructions ? "rotate-180" : ""}`}
              />
            </h5>
            <div
              className={`flex flex-col gap-2 duration-300 ease-in-out ${
                expandBasicInstructions
                  ? "max-h-80 py-2 pb-4"
                  : "max-h-0 overflow-hidden"
              }`}
            >
              <textarea
                rows={8}
                disabled={loading}
                value={basicInstructions}
                onChange={(e) => setBasicInstructions(e.target.value)}
                placeholder={"Basic Instructions"}
                className="bg-background mx-1 resize-none rounded-md border border-gray-300 px-3 py-2 text-sm"
              ></textarea>
              <p className="mt-1 text-xs text-gray-500">
                These instructions will guide the AI when generating newsletter
                templates
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Examples */}
      <div className="flex flex-col gap-4 rounded-md border border-gray-300 bg-white p-4 sm:p-6">
        <h4 className="font-semibold">Newsletter Examples</h4>
        {examples.length ? (
          examples.map((example, index) => (
            <div key={index} className="rounded-lg bg-gray-100 p-4">
              <div className="flex items-center justify-between">
                <h5
                  onClick={() => toggleExample(index)}
                  className="cursor-pointer text-xs font-medium hover:underline"
                >
                  Example {index + 1}
                </h5>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleExample(index)}
                    className="hover:bg-accent rounded-md p-2 duration-200 hover:text-white"
                  >
                    <ChevronDownIcon
                      className={`h-4 w-4 duration-200 ${expandedExamples.includes(index) ? "rotate-180" : ""}`}
                    />
                  </button>
                  <button
                    onClick={() => removeExample(index)}
                    className="hover:bg-accent-red rounded-md p-2 duration-200 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div
                className={`overflow-hidden duration-300 ${expandedExamples.includes(index) ? "mt-2 max-h-80" : "max-h-0"}`}
              >
                <textarea
                  disabled
                  value={example}
                  className={`h-80 w-full rounded border bg-white p-3 font-mono text-sm whitespace-pre-wrap`}
                ></textarea>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">
            No newsletter examples added yet.
          </p>
        )}

        <hr className="border-gray-200" />

        <div className="flex flex-col gap-2">
          <label htmlFor="newExample" className="text-sm font-medium">
            Add New Newsletter Example
          </label>
          <textarea
            id="newExample"
            value={newExample}
            onChange={(e) => setNewExample(e.target.value)}
            placeholder="Paste your newsletter example here...&#10;&#10;Include subject line, body text, and any formatting you want to preserve."
            rows={8}
            className="bg-background resize-none rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <Button
            onClick={addExample}
            disabled={!newExample.trim()}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Newsletter Example
          </Button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={loading}>
          {loading ? (
            <>
              <LoaderIcon className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Newsletter Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
