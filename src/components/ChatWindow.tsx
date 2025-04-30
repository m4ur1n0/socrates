"use client"
import { useChat } from '@/context/chatContext';
import { genericGeminiQuery } from '@/lib/gemini/gemini';
import React, { useEffect, useRef, useState } from 'react'
import ChatBubble from './ChatBubble';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

const ChatWindow = () => {

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const endOfMessagesRef = useRef<HTMLDivElement>(null);
    const textAreaMaxHeight = 300;


    const [inputContent, setInputContent] = useState("");
    const [generationState, setGenerationState] = useState(false);

    const {
        chatHistory,
        questionsHistory,
        textbookContext,
        setChatHistory,
        setQuestionsHistory,
        setTextbookContext,

    } = useChat();

    const adjustTextAreaHeight = () => {
        if (inputRef.current) {
            inputRef.current.style.height="auto";
            inputRef.current.style.height=`${Math.min(inputRef.current.scrollHeight, textAreaMaxHeight)}px`;
        }
    };

    function handleInputChange(curr : string) {
        setInputContent(curr);
    }


    async function handleInputSubmit() {
        // get input from controlled variable, send to gemini, output result.

        if (!inputContent) return;
        setGenerationState(true);

        setChatHistory((prev : any[]) => [
            ...prev,
            {
                role : "USER", 
                content : {
                    message : inputContent
                }
            }
        ]);

        // can do custom logic here re : if this is the first chat or something.... for now just send away

        // eventually we'll have gemini return a json-structured response, for now we go with a string
        const prompt = inputContent;

        try {
            const resp = await genericGeminiQuery(prompt, chatHistory);

            if (!resp) {
                throw new Error("Error occurred in gemini api call...");
            }

            setInputContent("");

            // do something to parse the actual response we get, rn just pretending

            // here we can assume we've received a valid response
            // update chat history
            setChatHistory((prev : any[]) => [
                ...prev,
                {
                    role : "BOT",
                    content : {
                        message : resp
                    }
                }
            ]);

            setGenerationState(false);


        } catch (err) {
            console.error(`Error occurred on input submit : ${err}`);
        }

    }

    useEffect(() => {
        if (inputRef.current) {
            adjustTextAreaHeight();
        }
    }, [inputContent]);

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleInputSubmit();
        } else if (e.key === "Enter" && e.shiftKey) {
          e.preventDefault();
          setInputContent((prev) => prev + "\n");
        }
    }

    useEffect(() => {
        if (chatHistory.length >= 1) {
            endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatHistory]);

  return (
    <div className='w-full h-full flex flex-col justify-center p-10 pt-0 relative'>
        
        {/* CHAT BUBBLES (WILL CHANGE STYLE) */}
        <div className="messages-window flex flex-col w-full h-auto max-h-[80%] items-start gap-2 overflow-hidden overflow-y-scroll">
            {
                chatHistory.length > 0 ? 
                (
                    chatHistory.map((chatMsg, idx) => (
                        <ChatBubble message={chatMsg} key={idx} />
                    ))
                ) : (
                    <p className='w-full text-center mt-5 text-gray-800'>
                        Start learning, or ask Socrates a question.
                    </p>
                )
            }

            <div className="scrollTo-ref" ref={endOfMessagesRef} />

        </div>

        {/* USER INPUT FIELD */}
        <div className='user-input-field absolute bottom-2 w-full p-5 flex justify-center items-center gap-3 z-30'>
            <Textarea
                className='w-[80%] rounded-lg overflow-y-auto resize-none bg-white z-40'
                placeholder='Talk to Socrates...'
                ref={inputRef}
                value={inputContent}
                onChange={(e) => {
                    e.preventDefault();
                    handleInputChange(e.target.value);
                }}

                disabled={generationState}
                onKeyDown={handleKeyDown}
            />

            <Button
                variant={'outline'}
                className='bg-green-300 w-[5%] aspect-square rounded-full h-full'
                onClick={handleInputSubmit}
                disabled={generationState}
            >

            </Button>
        </div>


    </div>
  )
}

export default ChatWindow