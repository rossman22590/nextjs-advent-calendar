import Image from "next/image";
import { useMemo } from "react";
import { getGDriveImage } from "../../app/utils/urlUtils";

export default function SingleImage({ url }: { url: string }): JSX.Element {
  const urlReplaced = useMemo(() => {
    return getGDriveImage(url);
  }, [url]);

  return (
    <img // eslint-disable-line @next/next/no-img-element
      src={urlReplaced}
      alt="Calendar day image"
      className="w-full max-w-2xl mx-auto"
      width={500}
      height={500}
    />
  );
}
