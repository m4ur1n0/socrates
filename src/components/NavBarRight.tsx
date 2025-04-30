"use client"
import { useUser } from '@/context/userContext'
import React from 'react'


const NavBarRight = () => {
    const {user} = useUser();

  return (
    <div className='h-screen flex flex-col w-[8%] bg-gray-200 shadow-inner py-8 px-5'>

        <div className='user-profile-picture w-auto'>
            <img src={user?.profilePic || '/images/bank_pfp.jpg'} className='object-fit rounded-full ring ring-gray-400 ring-2 ring-offset-2' />
        </div> 
        
    </div>
  )
}

export default NavBarRight