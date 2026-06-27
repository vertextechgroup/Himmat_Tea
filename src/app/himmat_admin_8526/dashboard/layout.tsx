'use client';

import ProtectedRoute from '@/app/components/ProtectedRoute';
import DashboardLayout from '@/app/pages/dashboard/DashboardLayout';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
