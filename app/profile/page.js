import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Page() {
  return (
    <div className='min-w-full min-h-screen'>
        <Skeleton count={5} highlightColor='#BDE9C9'/> 
    </div>
  )
}
