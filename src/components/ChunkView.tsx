"use client"

import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useFile } from '@/context/fileContext'


const ChunkView = () => {

    const {relevantChunk} = useFile();

    const [chunk, setChunk] = useState("");

    useEffect(() => {
        console.log("chunk updated!!!!!!!!!!!!!!!")
        setChunk(relevantChunk);
    }, [relevantChunk])

  return (
    <Dialog>
        <DialogTrigger asChild>
            <div className='chunk-thumbnail w-full h-full p-1 flex justify-center items-center'>
                <p className=' overflow-ellipses text-center text-gray-400'
                    style={{
                        fontSize : (chunk ? "0.3rem" : "1rem")
                    }}
                >
                    {chunk !== "" ? chunk : "No relevant information to display yet..."}
                </p>
            </div>
        </DialogTrigger>

        <DialogContent className='overflow-y-scroll'>
            <DialogHeader>
                <DialogTitle>
                    <div className=' '>
                        Relevant information from your materials...
                    </div>
                </DialogTitle>
            </DialogHeader>

            <div className='render-text-chunk h-[400px] max-h-[400px] overflow-hidden overflow-y-scroll'>
                <p>
                    ... <br />
                    {chunk}
                    <br />
                    ...
                </p>
            </div>

        </DialogContent>
    </Dialog>
  )
}

export default ChunkView