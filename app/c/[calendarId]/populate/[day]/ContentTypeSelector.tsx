"use client";

import { ContentType } from "./types";
import { Select, SelectItem } from "@nextui-org/select";

const contentTypes: { label: string; key: ContentType }[] = [
  { label: "YouTube Video", key: "youtube" },
  { label: "Text", key: "text" },
  { label: "Single Image", key: "image" },
  { label: "Video File", key: "video-file" },
  { label: "Placeholder", key: "placeholder" },
  { label: "Spotify", key: "spotify" },
  { label: "Image Gallery", key: "gallery" },
  { label: "Link Button", key: "link" },
  { label: "Quiz", key: "quiz" },
];

export default function ContentTypeSelector({
  value,
  onChange,
}: {
  value: ContentType;
  onChange: (type: ContentType) => void;
}) {
  return (
    <Select
      label="Content Type"
      selectedKeys={[value]}
      onSelectionChange={(selection) => onChange(Array.from(selection)[0] as ContentType)}
    >
      {contentTypes.map((type) => (
        <SelectItem key={type.key} value={type.key}>
          {type.label}
        </SelectItem>
      ))}
    </Select>
  );
}
