import React from 'react'
import { Button } from '@mui/material'

export default function sidebar() {
  return (
    <div className='w-[350px] fixed z-[-2] bg-[#BDE9C9] min-h-[100vh] pt-24 flex flex-col py-[10%] items-center text-[#027223] gap-3'>

        {/* buttons */}
        <Button variant="text" color='inherit' className='bg-[#80BE92] text-[#027223] text-md font-semibold w-full'>Home</Button>
        <Button variant="text" color='inherit'  className=' text-[#027223] text-md font-semibold w-full' style={{display:'flex'}}>News</Button>
        <Button variant="text" color='inherit'  className=' text-[#027223] text-md font-semibold w-full text-left'>Upcoming Events</Button>
        <Button variant="text" color='inherit'  className=' text-[#027223] text-md font-semibold w-full text-left'>Registered Events</Button>
        <Button variant="text" color='inherit'  className=' text-[#027223] text-md font-semibold w-full text-left'>Comittee Members</Button>
        <Button variant="text" color='inherit'  className=' text-[#027223] text-md font-semibold w-full text-left'>Members</Button>



        {/* logout */}
        <Button variant="text" color='White'  className='text-white absolute bottom-0 mb-16 bg-[#027223] text-md px-4 text-left'>Logout</Button>

    </div>
  )
}
