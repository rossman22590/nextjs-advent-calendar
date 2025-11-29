"use client";

import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardBody, CardHeader } from "@nextui-org/card";

export default function NotificationManager() {
  return (
    <Card>
      <CardHeader>
        <FontAwesomeIcon icon={faBell} className="mr-2" />
        Notifications
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <p>
          Push notifications are disabled in the Postgres-only version. Hook up
          your preferred push provider and wire it to `/api/subscribe` and
          `/api/cron` if you want to re-enable them.
        </p>
      </CardBody>
    </Card>
  );
}
