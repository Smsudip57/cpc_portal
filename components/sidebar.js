'use client'
import React, {useState, useContext} from 'react'
import { Button } from '@mui/material'
import axios from 'axios';
import { useRouter,usePathname } from 'next/navigation';
import { MyContext } from '@/context/context';
import Link from 'next/link';



export default function Sidebar() {
  const router = useRouter();
  const context = useContext(MyContext);
  const pathname = usePathname();
  // const [pathname, setpathname] = useState('home');



  const logout = async () => {
    context.setLogin(true);
    try {
      const res  = await axios.get('/api/user/logout', {}, { withCredentials: true });
      context.customToast(res.data);
      if(res.data.success){
        context.setUser()
      }
      router.push('/login');
    } catch (error) {
      context.customToast({success:false, message:'Something went wrong'});
    }
    setTimeout(() => context.setLogin(false), 5000);
  };




  return (
    <div className='w-[350px] z-[50] fixed bg-[#BDE9C9] min-h-[100vh] pt-24 flex flex-col py-[10%] items-center text-[#027223] gap-3' style={{fontWeight:'bold'}}>
      

        {/* buttons */}
        {/* <Button
        variant="text"
        color="inherit"
        className="text-[#027223] text-md font-semibold w-full"
        style={{ fontWeight: '600', backgroundColor: pathname === '/portal/home' && '#80BE92' }}
        onClick={() => router.replace('/portal/home')}
      >
        Home
      </Button> */}
      <Button
        variant="text"
        color="inherit"
        className="text-[#027223] text-md font-semibold w-full"
        style={{ fontWeight: '600', backgroundColor: pathname === '/portal/news' && '#80BE92' }}
        onClick={() => router.replace('/portal/news')}
      >
        News
      </Button>
      <Button
        variant="text"
        color="inherit"
        className="text-[#027223] text-md font-semibold w-full"
        style={{ fontWeight: '600', backgroundColor: pathname === '/portal/upcoming-events' && '#80BE92' }}
        onClick={() => router.replace('/portal/upcoming-events')}
      >
        Upcoming Events
      </Button>
      <Button
        variant="text"
        color="inherit"
        className="text-[#027223] text-md font-semibold w-full"
        style={{ fontWeight: '600', backgroundColor: pathname === '/portal/registered-events' && '#80BE92' }}
        onClick={() => router.replace('/portal/registered-events')}
      >
        Registered Events
      </Button>
      <Button
        variant="text"
        color="inherit"
        className="text-[#027223] text-md font-semibold w-full"
        style={{ fontWeight: '600', backgroundColor: pathname === '/portal/comittee-members' && '#80BE92' }}
        onClick={() => router.replace('/portal/comittee-members')}
      >
        Committee Members
      </Button>
      <Button
        variant="text"
        color="inherit"
        className="text-[#027223] text-md font-semibold w-full"
        style={{ fontWeight: '600', backgroundColor: pathname === '/portal/newsletters' && '#80BE92' }}
        onClick={() => router.replace('/portal/newsletters')}
      >
        Newsletter
      </Button>


        
        <div className='text-white absolute bottom-0 mb-16 bg-[#027223] text-md   rounded-sm'>

        <Button variant="text" color='White'  className='px-4' onClick={logout} style={{paddingLeft:'16px',paddingRight:'16px'}}>Logout</Button>
        </div>

        
    </div>
  )
}
