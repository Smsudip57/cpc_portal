'use client';

import { useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { set } from 'mongoose';
import { MyContext } from '@/context/context';
import CloseIcon from '@mui/icons-material/Close';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const context = useContext(MyContext);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (true) {
      context.customToast({success:false, message:'Payment cancelled'}); 
      setTimeout(() => router.push("/"), 5000); 
    } else {
      router.push("/"); 
    }
  }, [router]);

  return (
    <div className="text-center min-h-screen min-w-screen flex items-center justify-center gap-3 text-stone-700 text-4xl">
        <CloseIcon fontSize="" className="text-red-600 text-5xl" />
        Payment Cancelled!
    </div>
    );
}
