import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function checkAuth(redirectTo = '/') {
  const router = useRouter();
  const { user } = useSelector((state) => state.user)

  useEffect(() => {
    if (!user) {
      router.push(redirectTo);
    }
  }, [user, router, redirectTo]);
}
