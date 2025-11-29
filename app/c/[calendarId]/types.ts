interface WindowContentData {
  day: number;
  title: string;
  text: string;
  content: {
    type: string;
  }[];
  opened?: boolean;
}
