import { redirect } from "next/navigation";

export default async function Page({ params }) {
  const { calendarId } = await params;
  redirect(`/c/${calendarId}/populate/start`);
}
