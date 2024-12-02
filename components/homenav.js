import React from 'react'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import Link from 'next/link';

export default function Homenav() {
  return (
    <div className='w-4/5 pb-16 mx-auto'>
        <div className='flex gap-5 justify-center'>
            <Link href={'/events'}>
            <div className='bg-[#01AA4D] hover:bg-[#004e23] transition-colors duration-700 cursor-pointer rounded-tl-[80px] rounded-br-[80px] p-6 text-[70px] flex flex-col justify-center items-center'>
                <EmojiEventsIcon fontSize='inherit'/>
                <p className='text-2xl font-sans mt-3 mb-2 font-[600]'>Events</p>
                <p className='text-base px-6'>See our past Events & Activities</p>
            </div>
            </Link>
            <Link href={'/newsletter'}>
            <div className='bg-[#01AA4D] hover:bg-[#004e23] transition-colors duration-700 cursor-pointer rounded-tr-[80px] rounded-bl-[80px] p-6 text-[70px] flex flex-col justify-center items-center'>
                <NewspaperIcon fontSize='inherit'/>
                <p className='text-2xl font-sans mt-3 mb-2 font-[600]'>Newsletters</p>
                <p className='text-base px-6'>See out past Events & Activities</p>
            </div>
            </Link>
        </div>
    </div>
  )
}
