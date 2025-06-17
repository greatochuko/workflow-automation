import { LoaderIcon, SaveIcon, YoutubeIcon } from "lucide-react";
import React, { useCallback, useState } from "react";
import Button from "../ui/Button";
import Select from "../ui/Select";
import { UserType, YoutubeSettingType } from "@/types/user";
import { saveYoutubeSettings } from "@/actions/userActions";
import { toast } from "sonner";

type YoutubeSettingFieldsType =
  | {
      id: keyof YoutubeSettingType;
      label: string;
      type: "select";
      options: string[];
    }
  | {
      id: keyof YoutubeSettingType;
      label: string;
      placeholder: string;
      type: "input" | "textarea";
    };

const businessTypes = [
  "Real Estate",
  "Fitness & Health",
  "Marketing Agency",
  "Restaurant",
  "E-commerce",
  "Consulting",
  "Technology",
  "Education",
  "Healthcare",
  "Finance",
  "Other",
];

const brandVoices = [
  "Professional",
  "Casual & Friendly",
  "Energetic & Motivational",
  "Educational & Informative",
  "Luxury & Premium",
  "Fun & Playful",
  "Authoritative & Expert",
];

const youtubeSettingFields: YoutubeSettingFieldsType[] = [
  {
    id: "industry",
    label: "Industry",
    placeholder: "e.g. Real Estate, Fitness, Marketing",
    type: "input",
  },
  {
    id: "business",
    label: "Business",
    type: "select",
    options: businessTypes,
  },
  {
    id: "state",
    label: "Location/State",
    placeholder: "e.g. California, New York, Florida",
    type: "input",
  },
  {
    id: "city",
    label: "City",
    placeholder: "e.g. Los Angeles, Miami, New York",
    type: "input",
  },
  {
    id: "contactLink",
    label: "Booking/Contact Link",
    placeholder:
      "https://calendly.com/yourlink or https://yourwebsite.com/contact",
    type: "input",
  },
  {
    id: "targetAudience",
    label: "Target Audience",
    placeholder: "e.g., Young professionals, Home buyers, Fitness enthusiasts",
    type: "input",
  },
  {
    id: "brandVoice",
    label: "Brand Voice",
    type: "select",
    options: brandVoices,
  },
  {
    id: "keywordsHashtags",
    label: "Keywords & Hashtags",
    placeholder:
      "Enter relevant keywords and hashtags separated by commas (e.g., #realestate, #Miami, #homebuying, luxury homes, property investment)",
    type: "textarea",
  },
];

const initialYoutubeSettings: YoutubeSettingType = {
  brandVoice: "",
  business: "",
  city: "",
  contactLink: "",
  industry: "",
  keywordsHashtags: "",
  state: "",
  targetAudience: "",
};

export default function YoutubeRepurposingSettings({
  client,
}: {
  client: UserType;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(
    client.youtubeSettings || initialYoutubeSettings,
  );

  const renderFieldInput = useCallback(
    (field: YoutubeSettingFieldsType) => {
      if (field.type === "input") {
        return (
          <input
            type="text"
            id={field.id}
            name={field.id}
            placeholder={field.placeholder}
            value={formData[field.id]}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))
            }
            className="bg-background w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
          />
        );
      }

      if (field.type === "textarea") {
        return (
          <textarea
            id={field.id}
            name={field.id}
            placeholder={field.placeholder}
            rows={4}
            value={formData[field.id]}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))
            }
            className="bg-background w-full resize-none rounded-md border border-gray-300 px-4 py-2 text-sm"
          />
        );
      }

      if (field.type === "select") {
        return (
          <Select
            options={field.options.map((opt) => ({
              label: <span>{opt}</span>,
              value: opt,
            }))}
            value={formData[field.id]}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, [field.id]: value }))
            }
            showCheckmark
            placeholder={`Select ${field.label}`}
          />
        );
      }

      return null;
    },
    [formData],
  );

  async function saveSettings() {
    setLoading(true);
    const { error } = await saveYoutubeSettings(client.id, formData);
    if (error) {
      toast.error(error);
    } else {
      toast.success(`YouTube settings saved for ${client.fullName}`);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-4 rounded-md border border-gray-300 bg-white p-4 sm:p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold sm:text-xl lg:text-2xl">
        <YoutubeIcon className="h-5 w-5 text-red-600" />
        Youtube Repurposing Settings for {client.fullName}
      </h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        {youtubeSettingFields.map((field) => (
          <div
            key={field.id}
            className={`flex flex-col gap-2 ${field.id === "contactLink" || field.type === "textarea" ? "col-span-2" : ""}`}
          >
            <label htmlFor={field.id}>{field.label}</label>
            {renderFieldInput(field)}
          </div>
        ))}
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
              <SaveIcon className="h-4 w-4" />
              Save Youtube Settings
            </>
          )}
        </Button>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h4 className="mb-2 font-medium text-blue-900">
          How these settings work:
        </h4>
        <ul className="list-inside list-disc space-y-1 text-sm text-blue-800">
          <li>
            <strong>Industry & Business Type:</strong> Helps generate relevant
            content and keywords
          </li>
          <li>
            <strong>Location & City:</strong> Adds local SEO targeting to titles
            and descriptions
          </li>
          <li>
            <strong>Booking Link:</strong> Automatically included in video
            descriptions for lead generation
          </li>
          <li>
            <strong>Target Audience:</strong> Tailors content tone and messaging
          </li>
          <li>
            <strong>Brand Voice:</strong> Ensures consistent communication style
          </li>
          <li>
            <strong>Keywords:</strong> Optimizes content for YouTube search and
            discovery
          </li>
        </ul>
      </div>
    </div>
  );
}
