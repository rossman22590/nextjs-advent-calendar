import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import ContentTypeSelector from "./ContentTypeSelector";
import {
  ContentData,
  ContentType,
  YouTubeContent,
  TextContent,
  ImageContent,
  VideoFileContent,
  SpotifyContent,
  GalleryContent,
  LinkContent,
  QuizContent,
} from "./types";
import QuizEditor from "./QuizEditor";

export default function ContentEditor({
  content,
  onChange,
}: {
  content: ContentData;
  onChange: (content: ContentData) => void;
}) {
  const [type, setType] = useState<ContentType>(content.type);

  const updateType = (newType: ContentType) => {
    setType(newType);
    switch (newType) {
      case "youtube":
        onChange({ type: "youtube", url: "" });
        break;
      case "text":
        onChange({ type: "text", text: "" });
        break;
      case "image":
        onChange({ type: "image", url: "" });
        break;
      case "video-file":
        onChange({ type: "video-file", url: "" });
        break;
      case "placeholder":
        onChange({ type: "placeholder" });
        break;
      case "spotify":
        onChange({ type: "spotify", url: "" });
        break;
      case "gallery":
        onChange({ type: "gallery", images: [] });
        break;
      case "link":
        onChange({ type: "link", url: "", label: "" });
        break;
      case "quiz":
        onChange({
          type: "quiz",
          intro: "",
          questions: [
            {
              questionText: "",
              answers: [{ text: "" }],
              correctAnswers: [0],
              isMultipleChoice: false,
            },
          ],
        });
        break;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <ContentTypeSelector value={type} onChange={updateType} />

      {type === "youtube" && (
        <Input
          label="YouTube URL"
          value={(content as YouTubeContent).url}
          onChange={(e) => onChange({ ...content, url: e.target.value } as YouTubeContent)}
        />
      )}

      {type === "text" && (
        <Textarea
          label="Text Content"
          value={(content as TextContent).text || ""}
          onValueChange={(value) => onChange({ ...content, text: value } as TextContent)}
        />
      )}

      {type === "image" && (
        <Input
          label="Image URL"
          value={(content as ImageContent).url}
          onChange={(e) => onChange({ ...content, url: e.target.value } as ImageContent)}
        />
      )}

      {type === "video-file" && (
        <Input
          label="Video URL"
          value={(content as VideoFileContent).url}
          onChange={(e) => onChange({ ...content, url: e.target.value } as VideoFileContent)}
        />
      )}

      {type === "spotify" && (
        <Input
          label="Spotify URL"
          value={(content as SpotifyContent).url}
          onChange={(e) => onChange({ ...content, url: e.target.value } as SpotifyContent)}
        />
      )}

      {type === "gallery" && (
        <div className="flex flex-col gap-2">
          {(content as GalleryContent).images.map((url, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={url}
                onChange={(e) => {
                  const newImages = [...(content as GalleryContent).images];
                  newImages[index] = e.target.value;
                  onChange({ ...content, images: newImages } as GalleryContent);
                }}
              />
              <Button
                color="danger"
                onClick={() => {
                  const newImages = [...(content as GalleryContent).images];
                  newImages.splice(index, 1);
                  onChange({ ...content, images: newImages } as GalleryContent);
                }}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            onClick={() =>
              onChange({
                ...content,
                images: [...(content as GalleryContent).images, ""],
              } as GalleryContent)
            }
          >
            Add Image
          </Button>
        </div>
      )}

      {type === "link" && (
        <div className="flex flex-col gap-2">
          <Input
            label="URL"
            value={(content as LinkContent).url}
            onChange={(e) => onChange({ ...content, url: e.target.value } as LinkContent)}
          />
          <Input
            label="Label"
            value={(content as LinkContent).label}
            onChange={(e) => onChange({ ...content, label: e.target.value } as LinkContent)}
          />
        </div>
      )}

      {type === "quiz" && (
        <QuizEditor
          quiz={content as QuizContent}
          onChange={(quiz) => onChange({ ...content, ...quiz } as QuizContent)}
        />
      )}
    </div>
  );
}
