import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  await auth();
  return (
    <div className="space-y-6">
      <div><h1 className="font-heading text-3xl font-bold">Settings</h1><p className="mt-1 text-gray-600">Site configuration</p></div>
      <Card><CardHeader><CardTitle>General</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Site name, logo, contact info.</p></CardContent></Card>
      <Card><CardHeader><CardTitle>Payment</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">Razorpay keys (configured via env).</p></CardContent></Card>
      <Card><CardHeader><CardTitle>Email / SMTP</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">SMTP config for transactional emails.</p></CardContent></Card>
    </div>
  );
}
