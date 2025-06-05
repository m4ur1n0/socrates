import React from 'react'

interface Props {
  message: {
    role: "USER" | "BOT",
    content: {
      message: string;
    },
    loading?: boolean; // <-- add this
  }
}

const ChatBubble = ({ message }: Props) => {
  const isUser = message.role === "USER";

  return (
    <div
      className={`flex rounded-xl w-fit max-w-[85%] h-auto px-4 py-3 ${
        isUser ? "bg-gray-200 ml-auto" : "ml-0 border border-gray-300"
      }`}
    >
      <p className='text-wrap text-left text-base leading-relaxed'>
        {message.loading ? '...' : message.content.message}
      </p>
    </div>
  );
};


export default ChatBubble