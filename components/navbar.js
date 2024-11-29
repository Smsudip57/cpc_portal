"use client"
import React from 'react';
import { useState,useEffect,useContext } from 'react';
import Link from 'next/link'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
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
  const [seton,setSeton] = useState();

  



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


  useEffect(()=>{
    if(context?.user){
      setSeton(context.user.name);
    }
  },[context.user])


  
  return (
    <div className='w-full z-[90] bg-[#01AA4D] fixed top-0 text-black flex  items-center justify-between py-5 px-[5%]'>
        <Link href='/'>
        <p className='w-16 overflow-visible text-nowrap cursor-pointer text-xl font-[600] text-white'>DIU Computer Programming Club</p></Link>
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
            style={{color:'white'}}
          >
           <Link href='/login'> { !context.loading && !context?.user && 'Login' }</Link>
          </Button>
            
            { 
            context?.user?.role === 'admin' &&
            <>
            <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            className='text-white gap-2'
            color='white'
            style={{color:'white'}}
          >
            <AccountCircleIcon fontSize='medium' color='white' style={{color:'white'}}/>
            { context?.user?.name }
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            style={{zIndex:91}}
          >
            <Link href='/admin'><MenuItem onClick={handleClose}>Admin</MenuItem></Link>
            <Link href='/portal'><MenuItem onClick={handleClose}>Portal</MenuItem></Link>
          </Menu>
            </>
          }
            { 
            context?.user?.role === 'guest' &&
            <>
            <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            className='text-white gap-2'
            color='white'
            style={{color:'white'}}
          >
            <AccountCircleIcon fontSize='medium' color='white' style={{color:'white'}}/>
            { context?.user?.email.split('@')[0] }
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            style={{zIndex:91}}
          >
            <Link href='/guest'><MenuItem onClick={handleClose}>Guest</MenuItem></Link>
          </Menu>
            </>
          }
          { 
            context?.user?.role === 'user' &&
            <>
            <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            className='text-white gap-2'
            color='white'
            style={{color:'white'}}
          >
            <AccountCircleIcon fontSize='medium' color='white' style={{color:'white'}}/>
            { context?.user?.name }
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            style={{zIndex:91}}
          >
            <Link href='/profile'><MenuItem onClick={handleClose} >Profile</MenuItem></Link>
            <Link href='/portal'><MenuItem onClick={handleClose} >Portal</MenuItem></Link>
            {/* <MenuItem onClick={handleClose}></MenuItem> */}
          </Menu>
            </>
          }
        </div>
    </div>
  )
}
