import React from 'react'

export default function Goal() {
  return (
    <div className='w-4/5 mx-auto min-h-6 sm:mt-28'>
      <p className='w-full text-center font-sans text-stone-700 text-3xl font-bold    my-10 sm:my-20'>Our G<img src='/arrow.png' className='inline w-5 h-5 mx-[1px]'/>als</p>
        <div className='max-w-1200px flex-col flex xl:flex-col mx-auto gap-3 full'>

          <div className='basis-1/3 p-2 relative text-stone-600 font-sans'>
          <img src='/goal1.jpg' className='absolute border-2 border-green-500 top-0 left-0 w-[80px] rounded-full aspect-square'/>
          <p className='text-lg text-green-700 absolute top-0 right-0 font-sans font-[600] text-right pr-4'>Programming Excellence</p>
           <div className='border-2 border-red-400 p-6 pt-8 pb-8 xl:pb-0 text-sm mt-[10%] ml-[30px] rounded-t-2xl rounded-bl-2xl pl-10 h-full '>
           <li className='mb-2'>Skill Building: Enhance problem-solving and programming skills.</li>
          <li className='mb-2'>Prepare for Competitions: Equip members for contests like ICPC, Codeforces, and Google Coding Competitions.</li>
          <li className='mb-2'>Regular Practice: Organize coding challenges, hackathons, and workshops.</li>
          <li className='mb-2'>Structured Thinking: Develop systematic problem-solving techniques.</li>

           </div>

          </div>
          <div className='basis-1/3 p-2 relative text-stone-600 font-sans min-h-full'>
          <img src='/goal2.jpg' className='absolute border-2 border-green-500 top-0 left-0 w-[80px] rounded-full aspect-square'/>
          <p className='text-lg text-green-700 absolute top-0 right-0 font-sans font-[600] text-right pr-4'>Collaborative Community</p>
           <div className='border-2 border-red-400 p-6 pt-8 pb-8 xl:pb-0 text-sm mt-[10%] ml-[30px] rounded-t-2xl rounded-bl-2xl pl-10 h-full '>
           <li className='mb-2'>Networking: Connect like-minded students passionate about coding.</li>
          <li className='mb-2'>Teamwork: Foster collaboration through group projects and contests.</li>
          <li className='mb-2'>Knowledge Sharing: Encourage peer-to-peer learning and mentorship.</li>
          <li className='mb-2'>Support System: Build a community that motivates and uplifts members.</li>


           </div>

          </div>
          <div className='basis-1/3 p-2 relative text-stone-600 font-sans'>
          <img src='/goal3.jpg' className='absolute border-2 border-green-500 top-0 left-0 w-[80px] rounded-full aspect-square'/>
          <p className='text-lg text-green-700 absolute top-0 right-0 font-sans font-[600] text-right pr-4'>Career Development</p>
           <div className='border-2 border-red-400 p-6 pt-8 pb-8 xl:pb-0 text-sm mt-[10%] ml-[30px] rounded-t-2xl rounded-bl-2xl pl-10 h-full'>
           <li className='mb-2'>Resume Building: Provide experience with real-world projects and achievements.</li>
          <li className='mb-2'>Technical Interviews: Organize mock interviews and coding prep sessions.</li>
          <li className='mb-2'>Industry Exposure: Host guest lectures and workshops by industry experts.</li>
          <li className='mb-2'>Job Opportunities: Connect members with internships and placements.</li>


           </div>

          </div>


        </div>
    </div>
  )
}
