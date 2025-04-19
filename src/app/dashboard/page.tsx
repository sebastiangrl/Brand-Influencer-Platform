//src/app/dashboard/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/lib/constants';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      switch (session.user.role) {
        case UserRole.ADMIN:
          router.push('/dashboard/admin');
          break;
        case UserRole.BRAND:
          router.push('/dashboard/brand');
          break;
        case UserRole.INFLUENCER:
          router.push('/dashboard/influencer');
          break;
        default:
          router.push('/login');
      }
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, session, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );
}