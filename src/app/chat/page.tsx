import ChatWindow from '@/components/ChatWindow'
import NavBarRight from '@/components/NavBarRight'
import React from 'react'

const page = () => {
  return (
    <div className='chat-page w-screen h-screen flex gap-2'>

      <div className='questions-sidebar w-[25%] h-full flex flex-col items-center bg-gray-200'>
        xxx
      </div>

      <div className='main-chat-window w-full h-full'>
        <ChatWindow />
      </div>

      <NavBarRight />

    </div>
  )
}

export default page