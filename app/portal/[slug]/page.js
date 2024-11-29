'use client';
import React, { useEffect, useState, useContext  } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { MyContext} from '@/context/context';
import Portalhome from '@/components/sidebar/home';
import Portalnews from '@/components/sidebar/news';
import Portalmembers from '@/components/sidebar/members';
import PortalupcomingEvents from '@/components/sidebar/upcomingEvents';
import Portalcomittee from '@/components/sidebar/comitee';
import Portalregister from '@/components/sidebar/registeredEvents';

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
        return <Portalhome />;
      case 'news':
        return <Portalnews />;
      case 'members':
        return <Portalmembers />;
      case 'upcoming-events':
        return <PortalupcomingEvents />;
      case 'comittee':
        return <Portalcomittee />;
      case 'registered-events':
        return <Portalregister />;
      default:
        return <Portalhome />; 
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
