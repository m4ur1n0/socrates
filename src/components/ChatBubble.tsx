import React from 'react'

type Props = {
    message : any // NEEDS TO CHANGE
}

const ChatBubble = ({message}: Props) => {
    // knows if it is a user or a bot, will align properly
  return (
    <div className={`flex rounded-xl w-fit max-w-[85%] h-auto p-2 ${
        message.role === "USER" ? "bg-gray-200 ml-auto" : "ml-0 border border-gray-300"
    }`}>
        <p
        className='text-wrap text-left'>
            {message.content.message}
        </p>
        
    </div>
  )
}

export default ChatBubble