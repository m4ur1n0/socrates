"use client"
import type { HighlightRegion } from "@/types/Files";
import { createContext, ReactNode, useContext, useState } from "react"
import { UploadedFileState } from "@/types/Files"

interface FileContextType {
    uploadedFileState : UploadedFileState | null;
    setUploadedFileState : Function;
    highlightSection : Function;
    highlights : HighlightRegion[];

  }
  
  const FileContext = createContext<FileContextType>({
    uploadedFileState : null,
    highlights : [],

    setUploadedFileState : () => {},
    highlightSection : () => {},

  })
  
  // Hook for user context
  // eslint-disable-next-line react-refresh/only-export-components
  export const useFile = () => useContext(FileContext)


  const FileContextProvider = ({ children }: { children: ReactNode }) => {

    const [uploadedFileState, setUploadedFileState] = useState<UploadedFileState | null>(null);
    const [highlights, setHighlights] = useState<HighlightRegion[]>([]);
    
    function highlightSection(highlight : HighlightRegion) {
        // this is where the real highlight regions are computed?


        return;
    }
   
    const value = {
        uploadedFileState,
        highlights,

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