import React from 'react'

export default function committeeHeads() {
  return (
    <div className='w-full pt-40'>
        <div className='w-4/5 mx-auto flex justify-between'>
        <div title='Club Advisor' className='basis-[30%] flex justify-center'>
            <div className='flex flex-col items-center gap-5'>
            <img className='aspect-square w-[200px] border-b-8 border-[#FF3115]' src='/dummy.jpg' width={100} style={{}} />
            <div className='w-4/5 self-right'>
            <p className='text-2xl text-stone-800 font-[600] mb-1'>Sudip</p>
            <p className='text-xl text-green-700  font-sans font-[600] text-right pr-[15%]'>Club Advisor</p>
            </div>
            <p className='text-left font-sarif text-md text-stone-700 w-4/5 max-w-[1200px]'>
            When I'm not coding, I enjoy exploring emerging technologies and contributing to open-source projects, fostering innovation and community growth. 
            </p>
            </div>
        </div>
        <div title='President' className='basis-[30%] flex justify-center'>
            <div className='flex flex-col items-center gap-5'>
            <img className='aspect-square w-[200px] border-b-8 border-[#FF3115]' src='/dummy.jpg' width={100} style={{}} />
            <div className='w-4/5 self-right'>
            <p className='text-2xl text-stone-800 font-[600] mb-1'>Sudip</p>
            <p className='text-xl text-green-700  font-sans font-[600] text-right pr-[15%]'>President</p>
            </div>
            <p className='text-left  text-stone-700 w-4/5 max-w-[1200px]'>
            Throughout my career, I have successfully delivered projects ranging from e-commerce platforms to custom business solutions, focusing on scalability and maintainability. 
            </p>
            </div>
        </div>
        <div title='President' className='basis-[30%] flex justify-center'>
            <div className='flex flex-col items-center gap-5'>
            <img className='aspect-square w-[200px] border-b-8 border-[#FF3115]' src='/dummy.jpg' width={100} style={{}} />
            <div className='w-4/5 self-right'>
            <p className='text-2xl text-stone-800 font-[600] mb-1'>Sudip</p>
            <p className='text-xl text-green-700  font-sans font-[600] text-right pr-[15%]'>Vice President</p>
            </div>
            <p className='text-left  text-stone-700 w-4/5 max-w-[1200px]'>
            I am a passionate full-stack web developer with extensive experience in building dynamic, responsive websites and applications. Specializing in the MERN stack and Next.js.
            </p>
            </div>
        </div>
        </div>
    </div>
  )
}
