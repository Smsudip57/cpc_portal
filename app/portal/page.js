'use client';
import React from 'react'
import Navbar from '@/components/navbar'
import Sidebar from '@/components/sidebar'
import { useRouter } from 'next/navigation'


export default function Home() {
  const router = useRouter();
  router.replace('/portal/news');
  return (
    <div>
        <Navbar/>
        <Sidebar/>
        <div className='pt-[100px]'>
        </div>
    </div>
  )
}
