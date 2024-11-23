"use client"
import React from 'react'

export default function login() {
  return (
    <div className='bg-green-200 min-w-screen min-h-screen flex justify-center items-center'>
        <div className='min-h-[80vh] flex flex-col gap-16'>
            <div className=' flex flex-col justify-center items-center gap-8 cursor-pointer' onClick={() => window.location.href = "/"}>
                <p className='text-xl font-semibold text-stone-700'>DIU Computer Programming Club</p>
                <div className='logo flex gap-5'>
                <img className='w-[130px]' src='https://casamedia.com/wp-content/uploads/2023/04/adidas-1024x683.png' width={100} />
                <img className='w-[130px]' src='https://casamedia.com/wp-content/uploads/2023/04/adidas-1024x683.png' width={100}/>
                </div>
            </div>
            <div className="min-w-[600px] text-center text-black flex flex-col justify-center items-center bg-green-400 p-5 rounded-md gap-5">
                <b className="text-xl font-mono">Login</b>
                <form 
                    className="text-xs flex flex-col items-center gap-3"
                    // onSubmit={(e) => {
                    // e.preventDefault(); // Prevent the default form action
                    // window.location.href = "/"; // Redirect manually
                    // }}
                >
                  <div className='grid gap-3'>
                  <input 
                    type="text" 
                    className="w-[350px] py-1 px-2 rounded-sm" 
                    placeholder="Email" 
                    title="Email" 
                    name="email" // Add a name attribute
                    required 
                    />
                    <input 
                    type="password" 
                    className="w-[350px] py-1 px-2 rounded-sm" 
                    placeholder="Password" 
                    title="Password" 
                    name="password" // Add a name attribute
                    required 
                    />
                  </div>
                    <button 
                    type="submit" 
                    className="bg-blue-700 text-sm py-1 px-3 w-max text-white rounded-md mt-8" 
                    title="Log In"
                    >
                    Log In
                    </button>
                </form>
            </div>
        </div>
    </div>
  )
}
