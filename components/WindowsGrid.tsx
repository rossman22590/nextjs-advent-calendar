"use client";

import { useEffect } from "react";
import FlipCard from "./FlipCard";
import { useParams } from "next/navigation";
import {
  getTodayDay,
  isCalendarPeriod,
  isDayToday,
  isOpen,
} from "@/app/utils/calendarUtils";

interface WindowsGridProps {
  scrollToToday?: boolean;
  windows: WindowContentData[];
}

export default function WindowsGrid({ windows }: WindowsGridProps) {
  const params = useParams();

  useEffect(() => {
    if (!isCalendarPeriod()) return;

    const today = getTodayDay();

    const hash = window.location.hash;
    const dayToScrollTo = hash ? parseInt(hash.split("-")[1]) : undefined;

    if (!dayToScrollTo) {
      const todayElement = document.getElementById(`day-${today}`);
      if (todayElement) {
        todayElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      const element = document.getElementById(`day-${dayToScrollTo}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [params]);

  return (
    <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      {windows.map((window: any) => (
        <FlipCard
          key={window.day}
          day={window.day}
          disabled={!isOpen(window.day)}
          emphasized={isDayToday(window.day)}
          opened={window.opened}
          title={window.title}
          text={window.text}
        />
      ))}
    </div>
  );
}
