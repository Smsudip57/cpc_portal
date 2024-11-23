import React from 'react'

export default function navbar() {
  return (
    <div className='w-full bg-green-200 fixed text-black flex justify-between items-center  py-5 px-[5%]'>
        <p className='w-24 text-nowrap cursor-pointer text-xl font-[600] text-stone-700'>DIU Computer Programming Club</p>
        <div className='flex gap-5 items-center'>
            <img className='w-[80px]' src='https://casamedia.com/wp-content/uploads/2023/04/adidas-1024x683.png' width={100} />
            {/* <p className='text-green-700 text-2xl'>X</p> */}
            <img className='w-[80px]' src='https://casamedia.com/wp-content/uploads/2023/04/adidas-1024x683.png' width={100} />
        </div>
        <button className='text-white bg-blue-500 py-1 px-3 rounded text-base font-[600]'>
            Login
        </button>
    </div>
  )
}
