import { auth } from "@/auth";
import { NotificationForm } from "./NotificationForm";

export default async function NotificationsPage() {
  await auth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-warm-900">Notifications</h1>
        <p className="mt-1 text-gray-600">Send booking updates, call reminders, order alerts</p>
      </div>
      <NotificationForm />
    </div>
  );
}
