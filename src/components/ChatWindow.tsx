"use client"
import { chunkText } from '@/lib/files/ChunkText'
import { generateEmbeddings, getChunksFromInput, loadCachedEmbeddings } from '@/lib/files/EmbedChunks'
import { extractText } from '@/lib/files/TextExtraction'
import { saveConversation } from '@/lib/firebase/db'
import { useChat } from '@/context/chatContext';
import { createStudyPlanQuery, genericGeminiQuery } from '@/lib/gemini/gemini';
import React, { useEffect, useRef, useState } from 'react'
import ChatBubble from './ChatBubble';
import TextbookUploader from './TextbookUploader';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useUser } from '@/context/userContext'
import { Conversation } from '@/types/Conversation'
import {v4 as uuidv4 } from 'uuid'
import { useFile } from '@/context/fileContext'
import { UploadedFileState } from '@/types/Files'

const ChatWindow = () => {

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const fileRef = useRef<File | null>(null);

    const endOfMessagesRef = useRef<HTMLDivElement>(null);
    const textAreaMaxHeight = 300;


    const [inputContent, setInputContent] = useState("");
    const [generationState, setGenerationState] = useState(false);
    // fileState shows where we are in terms of having a file
    // 0 == no file uploaded
    // 1 == file uploaded, parsing/chunking/embedding in process
    // 2 == file uploaded and stored properly
    // 3 == failure
    const [fileState, setFileState] = useState(0);
    const [conversationId, setConversationId] = useState<string>(uuidv4() as string);
    const {uploadedFileState, setUploadedFileState, highlightSection} = useFile();

    const {
        chatHistory,
        questionsHistory,
        textbookContext,
        setChatHistory,
        setQuestionsHistory,
        setTextbookContext,

    } = useChat();

    const {user} = useUser();

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
        let promptChunks : string[] = [];

        const obj = loadCachedEmbeddings();
        if (obj) {
            const {chunks, embeddings} = obj;

            console.log(`HERE ARE THE EMBEDDINGS IM SENDING : \n${JSON.stringify(embeddings)}\n`);

            const inputChunks = await getChunksFromInput(prompt, chunks, embeddings);
            promptChunks = inputChunks as string[];

        } else {
            console.log("WE DID NOT LOAD ANY CHNKS");
        }



        try {
            const resp = await genericGeminiQuery(prompt, chatHistory, promptChunks);


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

    async function saveAndStoreConversationFirstTime() {
        // the signaler would have checked, but never hurts to double
        if (fileRef.current === null) return; // fail ? error ?

        // extract text
        const file = fileRef.current;
        const textProm = extractText(file);
        const fileURL = URL.createObjectURL(file);
        const {text, pages} = await textProm;

        // save for the doc viewer
        // only acccept pdf now, init with no highlights
        const f : UploadedFileState = {
            name : file.name,
            type : "pdf",
            fileUrl : fileURL,
            textContent : text,
            pageTexts : pages,
            highlights : []
        };

        setUploadedFileState(f);

        console.log(`TEXT : ${text}\n\n`);

        // chunk text
        const chunks = chunkText(text, 300, 50);
        console.log(`CHUNKS : ${chunks}\n\n`);

        // generate list of topics
        const topicsP = createStudyPlanQuery(text);


        // embed chunks
        const embeddingsP = generateEmbeddings(chunks);

        const [topics, embeddings] = await Promise.all([topicsP, embeddingsP]);

        console.log(`EMBEDDINGS : ${embeddings}\n\n`);

        console.log(`TOPICS PLAN : ${topics}\n\n`);


        const conv : Conversation = {
            conversationId,
            userId : user?.userId as string,
            embeddingMap : chunks.map((chunk, idx) => {
                return {
                    chunk,
                    embedding : embeddings[idx],
                    index : idx
                }
            }),
            chatHistory,
            lastAccessedDate : new Date()
        };

        // STORE EMBEDDINGS IN LOCAL STORAGE
        // STORE CHUNKS IN LOCAL STORAGE

        // const res = await saveConversation(conv);
        const res = true;

        setFileState(res ? 2 : 3); // succ or fail

        if (res) console.log("everything went well...?");


    }

    useEffect(() => {
        // whenever fileState flips from anything to 1 (set by file uploader, we want to parse and save)

        if (fileState === 1) {
            saveAndStoreConversationFirstTime();
        }

    }, [fileState])

  return (
    <div className='w-full h-full flex flex-col justify-start items-center p-10 pt-[5%] relative'>

        {/* FILE UPLOAD BUTTON */}
        <TextbookUploader fileRef={fileRef} setFileState={setFileState} fileState={fileState} />
        
        {/* CHAT BUBBLES (WILL CHANGE STYLE) */}
        <div className="messages-window flex flex-col w-[90%] h-[85%] max-h-[85%] items-start gap-2 overflow-hidden overflow-y-scroll no-scrollbar">
            { 
                chatHistory.length > 0 ? 
                (
                    chatHistory.map((chatMsg, idx) => (
                        <ChatBubble message={chatMsg} key={idx} />
                    ))
                ) : (
                    <p className='w-full text-center mt-5 text-gray-500 '>
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

