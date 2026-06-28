'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) router.push('/dashboard');
    else router.push('/login');
  }, []);
  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center">
      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white text-xl animate-pulse">↗</div>
    </div>
  );
}
