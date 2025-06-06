import ChatWindow from '@/components/ChatWindow'
import DocViewer from '@/components/DocViewer'
import NavBarRight from '@/components/NavBarRight'
import React from 'react'

const page = () => {
  return (
    <div className='chat-page w-screen h-screen flex gap-2'>

      <div className='questions-sidebar w-[25%] h-full bg-gray-200 flex'>
        <div className='flex-1 relative border border-red-500'>
          {/* Now <DocViewer/> can fill 100% of this flex-1 container */}
          <DocViewer />
        </div>
      </div>

      <div className='main-chat-window w-full h-full'>
        <ChatWindow />
      </div>

      <NavBarRight />

    </div>
  )
}

export default page