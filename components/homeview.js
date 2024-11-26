import React from 'react'

export default function homeview() {
  return (
    <div className='w-full text-center relative pt-16'>
        <div className='fixed w-full aspect-[2.9/1] bg-[url("/cps.jpg")] bg-no-repeat bg-cover z-[-1]'>
            <div className='absolute w-full h-full bg-slate-900 opacity-90'>
            </div>
        {/* <img src='/cps.jpg' className=' w-full fixed z-[-1]'></img> */}
        </div>
        
    </div>
  )
}
