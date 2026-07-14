import AdminGuard from '@/components/admin/AdminGuard';

export default function DashboardLayout({ children }) {
  return <AdminGuard>{children}</AdminGuard>;
}
