import React from 'react'
import Navbar from '@/components/navbar'
import Sidebar from '@/components/sidebar'


export default function Home() {
  return (
    <div>
        <Navbar/>
        <Sidebar/>
        <div className='pt-[100px]'>
          <p className='text-black mx-[380px]'>May name is sudipMay name is sudip</p>

        </div>
    </div>
  )
}
