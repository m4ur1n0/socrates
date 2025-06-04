"use client"

import { createContext, ReactNode, useContext, useState } from "react"
import { UploadedFileState } from "@/types/Files"

interface FileContextType {
    uploadedFileState : UploadedFileState | null;
    setUploadedFileState : Function;
    highlightSection : Function;

  }
  
  const FileContext = createContext<FileContextType>({
    uploadedFileState : null,
    setUploadedFileState : () => {},
    highlightSection : () => {},
  })
  
  // Hook for user context
  // eslint-disable-next-line react-refresh/only-export-components
  export const useFile = () => useContext(FileContext)


  const FileContextProvider = ({ children }: { children: ReactNode }) => {

    const [uploadedFileState, setUploadedFileState] = useState<UploadedFileState | null>(null);
    
    function highlightSection() {
        return;
    }
   
    const value = {
        uploadedFileState,
        setUploadedFileState,
        highlightSection,
    }

    return (
        <FileContext.Provider
            value = {value}
        >
            {children}
        </FileContext.Provider>
    )
  }

export {FileContextProvider, useContext}