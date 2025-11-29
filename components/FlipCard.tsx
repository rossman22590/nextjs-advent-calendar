"use client";

import { useState } from "react";
import { getIconForDay } from "@/app/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface FlipCardProps {
  day: number;
  disabled?: boolean;
  emphasized?: boolean;
  opened?: boolean;
  title?: string;
  text?: string;
}

export default function FlipCard({
  day,
  disabled,
  emphasized,
  opened,
  title,
  text,
}: FlipCardProps) {
  const { calendarId } = useParams();
  const router = useRouter();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    if (!disabled && !opened) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleOpen = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await fetch(`/api/open-window`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ calendarId, day }),
    });
    router.push(`/c/${calendarId}/${day}`);
  };

  if (opened) {
    return (
      <div id={`day-${day}`} className="aspect-square">
        <div className="w-full h-full rounded-2xl shadow-lg bg-gray-200 flex flex-col items-center justify-center p-6">
          <span className="text-2xl font-bold text-gray-400">Day {day}</span>
          <span className="text-sm text-gray-400 mt-2">Already opened</span>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`day-${day}`}
      className="aspect-square [perspective:1000px] cursor-pointer"
      onClick={handleClick}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front of card */}
        <div
          className={`absolute inset-0 [backface-visibility:hidden] rounded-2xl shadow-lg flex flex-col items-center justify-center p-6
            ${disabled ? "opacity-50 bg-gray-100" : "bg-white hover:shadow-xl"}
            ${emphasized ? "ring-4 ring-pink-500" : ""}
          `}
        >
          <span className="text-2xl sm:text-3xl font-bold text-pink-500 mb-4">
            Day {day}
          </span>
          <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
            <FontAwesomeIcon
              icon={getIconForDay(day)}
              className="text-pink-500 w-full h-full"
            />
          </div>
          {disabled && (
            <span className="text-xs sm:text-sm text-gray-400 mt-4">
              Not yet
            </span>
          )}
        </div>

        {/* Back of card */}
        <div
          className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl shadow-lg bg-gradient-to-br from-pink-500 to-pink-600 flex flex-col items-center justify-center p-6 text-white
            ${emphasized ? "ring-4 ring-pink-300" : ""}
          `}
        >
          <span className="text-xl sm:text-2xl font-bold mb-2 text-center">
            {title || `Day ${day}`}
          </span>
          <p className="text-xs sm:text-sm text-center line-clamp-2 mb-4 opacity-90">
            {text || "Click to reveal!"}
          </p>
          <button
            onClick={handleOpen}
            className="px-4 py-2 bg-white text-pink-500 rounded-full font-semibold hover:bg-pink-50 transition-colors text-sm"
          >
            Open
          </button>
        </div>
      </div>
    </div>
  );
}
