type ContentType =
  | "youtube"
  | "text"
  | "image"
  | "video-file"
  | "placeholder"
  | "spotify"
  | "gallery"
  | "link"
  | "quiz";

interface BaseContent {
  type: ContentType;
}

interface YouTubeContent extends BaseContent {
  type: "youtube";
  url: string;
}

interface TextContent extends BaseContent {
  type: "text";
  text: string;
}

interface ImageContent extends BaseContent {
  type: "image";
  url: string;
}

interface VideoFileContent extends BaseContent {
  type: "video-file";
  url: string;
}

interface PlaceholderContent extends BaseContent {
  type: "placeholder";
}

interface SpotifyContent extends BaseContent {
  type: "spotify";
  url: string;
}

interface GalleryContent extends BaseContent {
  type: "gallery";
  images: string[];
}

interface LinkContent extends BaseContent {
  type: "link";
  url: string;
  label: string;
}

interface QuizContent extends BaseContent {
  type: "quiz";
  intro: string;
  questions: {
    questionText: string;
    questionImage?: string;
    answers: {
      text: string;
      image?: string;
    }[];
    correctAnswers: number[];
    isMultipleChoice: boolean;
  }[];
}

type ContentData =
  | YouTubeContent
  | TextContent
  | ImageContent
  | VideoFileContent
  | PlaceholderContent
  | SpotifyContent
  | GalleryContent
  | LinkContent
  | QuizContent;

export type { 
  ContentType, 
  ContentData, 
  YouTubeContent, 
  TextContent, 
  ImageContent, 
  VideoFileContent, 
  SpotifyContent, 
  GalleryContent, 
  LinkContent,
  QuizContent 
};
