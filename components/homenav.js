import React from 'react'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import Link from 'next/link';

export default function Homenav() {
  return (
    <div className='w-4/5 pb-16 mx-auto'>
        <div className='flex gap-5 justify-center items-center'>
            <Link href={'/events'} className='basis-1/2'>
            <div className='bg-[#01AA4D] hover:bg-[#004e23] transition-colors duration-700 cursor-pointer rounded-tl-[80px] rounded-br-[80px] p-4 sm:p-6 sm:text-[70px] text-[50px]  flex flex-col justify-center items-center'>
                <EmojiEventsIcon fontSize='inherit'/>
                <p className='text-2xl font-sans mt-3 mb-2 font-[600]'>Events</p>
                <p className='text-base px-2 sm:px-6'>See our past Events & Activities</p>
            </div>
            </Link>
            <Link href={'/newsletter'} className='h-full basis-1/2'>
            <div className='bg-[#01AA4D] h-full hover:bg-[#004e23] transition-colors duration-700 cursor-pointer rounded-tr-[80px] rounded-bl-[80px] p-4 sm:p-6 sm:text-[70px] text-[50px] flex flex-col justify-center items-center'>
                <NewspaperIcon fontSize='inherit'/>
                <p className='text-2xl font-sans mt-3 mb-2 font-[600]'>Newsletters</p>
                <p className='text-base text-right px-2 sm:px-6'>Explpore our Research & Ideas</p>
            </div>
            </Link>
        </div>
    </div>
  )
}
