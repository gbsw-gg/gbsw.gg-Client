'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, UserRole } from '@/context/UserContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/context/ToastContext';

export function useRequireRole(allowedRoles: UserRole[]) {
  const { user, loadUser } = useUser();
  const { forceLogout } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      const currentUser = user ?? (await loadUser());

      if (cancelled) return;

      if (!currentUser) {
        router.replace('/');
        return;
      }

      if (!allowedRoles.includes(currentUser.role)) {
        showToast('권한이 없습니다.', 'error');
        setTimeout(() => forceLogout(), 1200);
        return;
      }

      if (!cancelled) setIsChecking(false);
    };

    verify();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isChecking };
}
