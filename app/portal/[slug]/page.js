'use client';
import React, { useEffect, useState, useContext  } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { MyContext} from '@/context/context';
import Portalhome from '@/components/sidebar/home';
import Portalnews from '@/components/sidebar/news';
import Portalnewsletters from '@/components/sidebar/newsletter';
import PortalupcomingEvents from '@/components/sidebar/upcomingEvents';
import Portalcomittee from '@/components/sidebar/comitee';
import Portalregister from '@/components/sidebar/registeredEvents';
import CreateNewsletter from '@/components/sidebar/createnewsletter';

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
      case 'news':
        return <Portalnews />;
      case 'newsletters':
        return <Portalnewsletters />;
      case 'upcoming-events':
        return <PortalupcomingEvents />;
      case 'comittee-members':
        return <Portalcomittee />;
      case 'registered-events':
        return <Portalregister />;
      case 'create-newsletter':
        return <CreateNewsletter />;
      default:
        return <Portalnews />; 
    }
  };

  return (
    <div className='text-black'>
      <Navbar />
      <Sidebar />
      <div className="pt-[100px] ml-[380px]">
        {renderContent()}
      </div>
    </div>
  );
}
