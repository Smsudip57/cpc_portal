import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';

export default function Loader() {
  return (
    <div className='w-full h-[80vh] flex justify-center items-center'>
        <CircularProgress/>
    </div>
  )
}
