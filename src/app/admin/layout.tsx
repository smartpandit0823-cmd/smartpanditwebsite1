import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // If not logged in, show children directly (login page handles itself)
  if (!session?.user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminSidebar />
      <div className="pl-64 transition-all duration-300">
        <AdminHeader user={session?.user} />
        <main className="p-6 max-w-[1600px]">{children}</main>
      </div>
    </div>
  );
}
