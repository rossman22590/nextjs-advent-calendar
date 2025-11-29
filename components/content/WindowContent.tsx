"use client";

import { useCallback, useEffect, useState } from "react";
import Quiz from "./Quiz";
import ContentElementResolver from "./ContentElementResolver";
import { useParams } from "next/navigation";
import { isOpen } from "@/app/utils/calendarUtils";

export default function WindowContent({
  content,
}: {
  content: any[];
}): JSX.Element {
  const { calendarId, day } = useParams() as {
    calendarId: string;
    day: string;
  };

  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // either one element or two, if two then first has to be type quiz
  if (content.length > 2) {
    throw new Error("Invalid data: too many elements");
  } else if (content.length === 0) {
    throw new Error("Invalid data: no elements");
  } else if (content.length === 2 && content[0].type !== "quiz") {
    throw new Error("Invalid data: first element must be quiz");
  }

  useEffect(() => {
    const completed = getStoredState(calendarId)[day] ?? false;
    if (completed) {
      setIsCompleted(true);
    }

    // mark this window as visited so it cannot be reopened
    if (isOpen(parseInt(day, 10))) {
      const visitedKey = `${calendarId}:visited`;
      const visited =
        (JSON.parse(localStorage.getItem(visitedKey) ?? "{}") as Record<
          string,
          boolean
        >) || {};
      visited[day] = true;
      localStorage.setItem(visitedKey, JSON.stringify(visited));
    }
  }, [calendarId, day]);

  const setIsCompletedAndSave = useCallback(() => {
    const newState = {
      ...getStoredState(calendarId),
      [day]: true,
    };
    localStorage.setItem(calendarId, JSON.stringify(newState));
    setIsCompleted(true);
  }, [calendarId, day]);

  return (
    <div>
      {content.length === 1 ? (
        <ContentElementResolver data={content[0]} />
      ) : content.length === 2 ? (
        isCompleted ? (
          <ContentElementResolver data={content[1]} />
        ) : (
          <Quiz onCompleted={() => setIsCompletedAndSave()} q={content[0]} />
        )
      ) : (
        <div>Invalid data: too many elements</div>
      )}
    </div>
  );
}

function getStoredState(calendarId: string): Record<string, boolean> {
  return JSON.parse(localStorage.getItem(calendarId) ?? "{}") as Record<
    string,
    boolean
  >;
}
