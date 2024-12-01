'use client';
import React, { useEffect, useState, useContext  } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import Adminbar from '@/components/adminSidebar';
import { MyContext} from '@/context/context';
import Publishnews from '@/components/adminbar/publishnews';
import Publishevents from '@/components/adminbar/publishevents';
import DraftNewsletterList from '@/components/adminbar/draftnewsletters';
import Members from '@/components/adminbar/memebers';
import Createcustomuser from '@/components/adminbar/customuser';

export default function AdminPage({params}) {
  const router = useRouter();
  const slug = params.slug
  const context = useContext(MyContext);

  const renderContent = () => {
    if (!slug) {
        <p>Loading...</p>; 
        context.customToast({success:false, message:'Something went wrong'});
    }
        

    switch (slug) {
      case '':
        return <Publishnews />;
      case 'publishnews':
        return <Publishnews />;
      case 'publishevents':
        return <Publishevents />;
      case 'events-participants':
        return <Publishnews />;
      case 'draft-newsletters':
        return <DraftNewsletterList />;
      case 'members':
        return <Members />;
      case 'registered-events':
        return <Publishnews />;
      case 'customuser':
        return <Createcustomuser />;
      default:
        return <Publishnews />; 
    }
  };

  return (
    <div className='text-black relative'>
      <Navbar />
      <Adminbar />
      <div className="pt-[100px] pl-[380px]">
        {renderContent()}
      </div>
    </div>
  );
}
