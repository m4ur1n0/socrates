import ChatWindow from '@/components/ChatWindow'
import ChunkView from '@/components/ChunkView'
// import NavBarRight from '@/components/NavBarRight'
import React from 'react'

const page = () => {
  return (
    <div className='chat-page w-screen h-screen flex gap-2'>

      <div className='questions-sidebar w-[25%] h-full flex flex-col items-center justify-center p-5'>
        <div className="pdf-viewer bg-gray-50 border shadow-inner rounded-lg h-[60%] w-full flex justify-center items-center">
          {/* <p className='text-center text-gray-400'>PDF View Unavailable at the moment.</p> */}
          <ChunkView  />
        </div>
      </div>

      <div className='main-chat-window w-full h-full'>
        <ChatWindow />
      </div>

      {/* <NavBarRight /> */}

    </div>
  )
}

export default page