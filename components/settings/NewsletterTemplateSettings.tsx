import { useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  ChevronDown,
  ChevronUp,
  LoaderIcon,
} from "lucide-react";
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
  const [newExample, setNewExample] = useState("");
  const [expandedExamples, setExpandedExamples] = useState<{
    [key: number]: boolean;
  }>({});
  //   const [settings, setSettings] = useState({
  //     basicInstructions:
  //       "Create engaging email newsletter templates based on approved video content. Focus on compelling subject lines, clear value propositions, and strong calls-to-action.",
  //     examples: [
  //       "Subject: 🚀 This Changed Everything for Our Clients\n\nHey [First Name],\n\nI wanted to share something that's been getting incredible results...\n\n[Video content summary]\n\nThe response has been amazing - people are saying this is exactly what they needed to hear.\n\nCheck it out here: [Link]\n\nLet me know what you think!\n\nBest,\n[Your Name]",
  //       "Subject: Personal Note About [Video Title]\n\n[First Name],\n\nI've been working on something that I think you'll really appreciate.\n\n[Video hook/teaser]\n\nWhat you'll discover:\n• Key insight #1\n• Practical strategy #2\n• Game-changing perspective #3\n\nThis represents hours of research and real-world application.\n\nTake a look: [Link]\n\nTalk soon,\n[Your Name]",
  //     ],
  //     monthlyCredits: 2,
  //   });

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
    setExpandedExamples((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
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
      <div className="flex flex-col gap-4 rounded-md border border-gray-300 bg-white p-4 sm:p-6">
        <h4 className="font-semibold">Basic Instructions</h4>
        <div className="flex flex-col gap-1">
          <label htmlFor="instructions" className="text-sm font-medium">
            Newsletter Generation Instructions
          </label>
          <textarea
            id="instructions"
            value={basicInstructions}
            onChange={(e) => setBasicInstructions(e.target.value)}
            placeholder="Enter instructions for newsletter template generation..."
            rows={4}
            className="bg-background resize-none rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            These instructions will guide the AI when generating newsletter
            templates
          </p>
        </div>
      </div>

      {/* Newsletter Examples */}
      <div className="flex flex-col gap-4 rounded-md border border-gray-300 bg-white p-4 sm:p-6">
        <h4 className="font-semibold">Newsletter Examples</h4>
        {examples.length ? (
          examples.map((example, index) => (
            <div key={index} className="space-y-2 rounded-lg bg-gray-100 p-4">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-medium">Example {index + 1}</h5>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleExample(index)}
                    className="hover:bg-accent rounded-md p-2 duration-200 hover:text-white"
                  >
                    {expandedExamples[index] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => removeExample(index)}
                    className="hover:bg-accent rounded-md p-2 duration-200 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="bg-background rounded border p-3">
                <pre
                  className={`font-mono text-sm whitespace-pre-wrap ${expandedExamples[index] ? "" : "line-clamp-4"}`}
                >
                  {example}
                </pre>
                <button
                  onClick={() => toggleExample(index)}
                  className="text-accent mt-2 h-auto p-0 text-xs hover:underline"
                >
                  Show {!expandedExamples[index] ? "more" : "less"}
                </button>
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
