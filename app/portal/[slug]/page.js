'use client';
import React, { useEffect, useState, useContext  } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { MyContext} from '@/context/context';

export default function PortalPage({params}) {
  const router = useRouter();
  const slug = params.slug
  const context = useContext(MyContext);

  const renderContent = () => {
    if (!slug) {
        <p>Loading...</p>; 
        context.customToast({success:false, message:'Something went wrong'});
    }
        

    switch (slug) {
      case 'home':
        return <p>Welcome to the Home page!</p>;
      case 'news':
        return <p>Welcome to the News page!</p>;
      default:
        return <p>Page not found</p>; 
    }
  };

  return (
    <div className='text-black'>
      <Navbar />
      <Sidebar />
      <div className="pt-[100px] mx-[380px]">
        {renderContent()}
      </div>
    </div>
  );
}
