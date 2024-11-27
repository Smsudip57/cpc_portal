'use client'
import React, { useContext} from 'react'
import { Button } from '@mui/material'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { MyContext } from '@/context/context';




export default function Sidebar() {
  const router = useRouter();
  const context = useContext(MyContext);



  const logout = async () => {
  
    try {
      const res  = await axios.get('/api/user/logout', {}, { withCredentials: true });
      context.customToast(res.data);
      router.push('/login');
    } catch (error) {
      context.customToast({success:false, message:'Something went wrong'});
    }
  };


  return (
    <div className='w-[350px] fixed z-[-2] bg-[#BDE9C9] min-h-[100vh] pt-24 flex flex-col py-[10%] items-center text-[#027223] gap-3'>

        {/* buttons */}
        <Button variant="text" color='inherit'  className=' text-[#027223] text-md font-semibold w-full' style={{display:'flex'}}>Publish News</Button>
        <Button variant="text" color='inherit'  className=' text-[#027223] text-md font-semibold w-full text-left'>Publish Events</Button>
        <Button variant="text" color='inherit'  className=' text-[#027223] text-md font-semibold w-full text-left'>Events Participants</Button>
        <Button variant="text" color='inherit'  className=' text-[#027223] text-md font-semibold w-full text-left'>Comittee Members</Button>
        <Button variant="text" color='inherit'  className=' text-[#027223] text-md font-semibold w-full text-left'>Members</Button>



        {/* logout */}
        <Button variant="text" color='White'  className='text-white absolute bottom-0 mb-16 bg-[#027223] text-md px-4 text-left' onClick={logout}>Logout</Button>

    </div>
  )
}
