import { auth } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Si no hay sesion, renderizar solo los children (login page)
  // La proteccion de rutas se maneja en el middleware
  if (!session?.user) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-white p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
