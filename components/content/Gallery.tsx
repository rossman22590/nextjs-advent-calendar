"use client";

import { getGDriveImage } from "@/app/utils/urlUtils";
import { useState, useCallback } from "react";
import {
  RowsPhotoAlbum,
  RenderImageProps,
  RenderImageContext,
} from "react-photo-album";
import "react-photo-album/rows.css";
import Image from "next/image";
import { Modal, ModalContent } from "@nextui-org/react";

function renderNextImage(
  { alt = "", title, sizes }: RenderImageProps,
  { photo, width, height }: RenderImageContext,
) {
  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        aspectRatio: `${width} / ${height}`,
      }}
    >
      <Image
        fill
        src={photo.src}
        alt={alt}
        title={title}
        sizes={sizes}
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}

export default function MiniGallery({
  images,
}: {
  images: string[];
}): JSX.Element {
  const [currentImage, setCurrentImage] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = useCallback((index: number) => {
    setCurrentImage(index);
    setIsOpen(true);
  }, []);

  const photos = images.map((img) => ({
    src: getGDriveImage(img),
    width: 1600,
    height: 1200,
  }));

  return (
    <div className="max-w-2xl mx-auto">
      <RowsPhotoAlbum
        photos={photos}
        onClick={({ event, photo, index }) => handleClick(index)}
        spacing={8}
        padding={0}
        rowConstraints={{
          minPhotos: 1,
          maxPhotos: 1,
        }}
        render={{ image: renderNextImage }}
        sizes={{
          size: "100vw",
          sizes: [{ viewport: "(max-width: 768px)", size: "100vw" }],
        }}
      />

      <Modal size="full" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent>
          {currentImage !== null && (
            <Image
              src={photos[currentImage].src}
              alt="Full size image"
              fill
              style={{ objectFit: "contain" }}
              onClick={() => setIsOpen(false)}
            />
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
