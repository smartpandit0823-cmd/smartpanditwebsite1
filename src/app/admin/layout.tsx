import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-warm-50">
      <AdminSidebar />
      <div className="pl-64">
        <AdminHeader user={session?.user} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
