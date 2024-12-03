import React from 'react'

export default function committeeHeads() {
  return (
    <div className='w-full py-20 sm:py-40'>
      <p className='w-full text-3xl text-center py-10 pb-16 font-bold text-stone-700'>Commi<span className='text-[#FF3115]'>tt</span>ee
      </p>
        <div className='w-4/5 mx-auto flex flex-col lg:flex-row gap-10 lg:gap-0 items-center  justify-between'>
        <div title='Club Advisor' className='basis-[30%] max-w-[350px] flex justify-center'>
            <div className='flex flex-col items-center gap-5'>
            <img className='aspect-square w-[200px] border-b-8 border-[#FF3115]' src='/dummyjpg.jpg' width={100} style={{}} />
            <div className='w-4/5 self-right'>
            <p className='text-xl text-stone-700 font-[600] mb-1'>S M Najmul Hossain</p>
            <p className='text-lg text-green-700  font-sans font-[600] text-right pr-[15%]'>Club Advisor</p>
            </div>
            <p className='text-left font-sarif text-md text-stone-700 w-4/5 max-w-[1200px]'>
            When I&apos;m not coding, I enjoy exploring emerging technologies and contributing to open-source projects, fostering innovation and community growth. 
            </p>
            </div>
        </div>
        <div title='President' className='basis-[30%] max-w-[350px] flex justify-center'>
            <div className='flex flex-col items-center gap-5'>
            <img className='aspect-square w-[200px] border-b-8 border-[#FF3115]' src='/dummyjpg.jpg' width={100} style={{}} />
            <div className='w-4/5 self-right'>
            <p className='text-xl text-stone-700 font-[600] mb-1'>S M Najmul Hossain</p>
            <p className='text-lg text-green-700  font-sans font-[600] text-right pr-[15%]'>President</p>
            </div>
            <p className='text-left  text-stone-700 w-4/5 max-w-[1200px]'>
            Throughout my career, I have successfully delivered projects ranging from e-commerce platforms to custom business solutions, focusing on scalability and maintainability. 
            </p>
            </div>
        </div>
        <div title='President' className='basis-[30%] max-w-[350px] flex justify-center'>
            <div className='flex flex-col items-center gap-5'>
            <img className='aspect-square w-[200px] border-b-8 border-[#FF3115]' src='/dummyjpg.jpg' width={100} style={{}} />
            <div className='w-4/5 self-right'>
            <p className='text-xl text-stone-700 font-[600] mb-1'>S M Najmul Hossain</p>
            <p className='text-lg text-green-700  font-sans font-[600] text-right pr-[15%]'>Vice President</p>
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
