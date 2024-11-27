"use client"
import React from 'react';
import { useState,useEffect,useContext } from 'react';
import Link from 'next/link'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import { MyContext } from '@/context/context';



export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const context = useContext(MyContext);

  



  //validating user 
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get('/user/findnvalidateuser', {
  //         withCredentials: true, 
  //       });

  //       console.log('User Validation Data:', response.data);
        
  //     } catch (error) {
  //       console.error('Error fetching user validation:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);




  
  return (
    <div className='w-full bg-[#01AA4D] fixed top-0 text-black flex justify-between items-center py-5 px-[5%]'>
        <Link href='/login'>
        <p className='w-16  overflow-visible text-nowrap cursor-pointer text-xl font-[600] text-white'>DIU Computer Programming Club</p></Link>
        <div className='flex gap-5 items-center cursor-pointer'>
            <img className='w-[50px]' src='https://casamedia.com/wp-content/uploads/2023/04/adidas-1024x683.png' width={100} />
            {/* <p className='text-green-700 text-2xl'>X</p> */}
            <img className='w-[50px]' src='https://casamedia.com/wp-content/uploads/2023/04/adidas-1024x683.png' width={100} />
        </div>
         <div>
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            className='text-white gap-2'
            color='white'
          >
            <AccountCircleIcon fontSize='medium'/>
            {
              context?.user?.role === 'guest' ? context?.user?.email : context?.user?.name
            }
            
          </Button>
          {/* <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu> */}
        </div>
    </div>
  )
}
