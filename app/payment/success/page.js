'use client';

import { useEffect,useContext } from 'react';
import { useRouter } from 'next/navigation';
import { set } from 'mongoose';
import { MyContext } from '@/context/context';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const context = useContext(MyContext);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      context.customToast({success:true, message:'Payment successful'});
      setTimeout(() => router.push("/"), 5000); 
    } else {
      router.push("/"); 
    }
  }, [router]);

  return (
    <div className="text-center min-h-screen min-w-screen flex items-center justify-center gap-3 text-stone-700 text-4xl">
        <CheckCircleOutlineIcon fontSize="" className="text-green-500 text-5xl" />
        Payment Successful!
    </div>
    );
}
