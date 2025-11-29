"use client";

import { Button } from "@nextui-org/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

interface DownloadButtonProps {
  imageUrl: string;
  fileName: string;
}

export default function DownloadButton({ imageUrl, fileName }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/download-image?url=${encodeURIComponent(imageUrl)}`);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      size="sm"
      color="primary"
      variant="flat"
      onClick={handleDownload}
      disabled={isDownloading}
      startContent={<FontAwesomeIcon icon={faDownload} />}
    >
      {isDownloading ? 'Downloading...' : 'Download'}
    </Button>
  );
}
