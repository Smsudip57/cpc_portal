import React from 'react'

export default function login() {
  return (
    <div className='min-w-screen min-h-screen flex justify-center items-center'>
        <div className='min-h-[80vh]'>
            <div className='min-h-[25vh] flex flex-col justify-center items-center gap-8'>
                <p className='text-xl font-semibold text-stone-700'>DIU Computer Programming Club</p>
                <div className='logo flex gap-5'>
                <img className='w-[150px]' src='https://casamedia.com/wp-content/uploads/2023/04/adidas-1024x683.png' width={100} />
                <img className='w-[150px]' src='https://casamedia.com/wp-content/uploads/2023/04/adidas-1024x683.png' width={100}/>
                </div>
            </div>
        <div className='min-w-[600px] text-center flex flex-col justify-center items-center bg-green-400 p-5 rounded-md  gap-5'>
            <b className='text-xl font-mono'>Login</b>
            <div className='text-xs grid gap-3'>
            <input type="text" className='w-[350px] py-1 px-2 rounded-md ' placeholder='Email'/>
            <input type="text" className='w-[350px] py-1 px-2 rounded-md ' placeholder='Password'/>
            </div>
            <button   className='bg-blue-700 text-sm py-1 px-3 w-max  text-white rounded-md'  >
                Log In
            </button>
        </div>
        </div>
    </div>
  )
}
