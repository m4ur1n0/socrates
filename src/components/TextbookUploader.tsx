
import React from 'react'
import { Button } from './ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'


type Props = {
    fileRef : React.RefObject<File | null>
    setFileState : React.Dispatch<React.SetStateAction<number>>
}


const TextbookUploader = ({fileRef, setFileState}: Props) => {

    /* We're gonna want it to be a file icon if none has been uploaded, else, a checkmark */

    /** upload file dialog */


    

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        fileRef.current = e.target.files?.[0] || null;
    }

    async function handleFileUpload() {
        //ensure we have a file
        if (fileRef.current === null) {
            setFileState(3);
            return;
        }

        // otherwise we just have to trigger a change in the ChatWindow
        setFileState(1);
        

    }

  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant="outline" className="rounded-full w-[50px] h-[50px] p-0 cursor-pointer absolute top-5 left-5">
                <img className='upload-vector-icon object-fit' src="/vectors/upload_vector.svg" />
            </Button>
        </DialogTrigger>
        <DialogContent className=''>

            <DialogHeader>
                <DialogTitle>Upload Work Materials</DialogTitle>
                <DialogDescription>
                    For best results, we recommend between 5 and 10 pages.
                </DialogDescription>
            </DialogHeader>

            <div className='textbook-upload-dialog-content w-full h-full p-5'>

                {/* <Label className='p-1' htmlFor='textbook'>Materials File: </Label> */}
                <Input 
                    id="textbook" 
                    type="file" 
                    accept='.pdf,.doc,.docx,.txt'
                    onChange={handleFileChange}
                />

            </div>

            <DialogClose asChild>
                <div className='custom-close w-full justify-center items-center'>
                    <Button className='close-and-submit-button' onClick={handleFileUpload}>Done</Button>
                </div>
            </DialogClose>
            
        </DialogContent>

    </Dialog>
  )
}

export default TextbookUploader

function uuidv4() {
    throw new Error('Function not implemented.')
}
