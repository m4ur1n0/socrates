"use client"
import { useFile } from '@/context/fileContext'
import { HighlightRegion } from '@/types/Files'
import React, { useEffect, useState } from 'react'
import { Highlight, PdfHighlighter, PdfLoader, Popup } from 'react-pdf-highlighter'

// type Props = {
//     fileUrl : string
//     highlights : HighlightRegion[]
//     onNewHighlight? : (highlight : HighlightRegion) => void;
// }

const DocViewer = () => {


    const {uploadedFileState, setUploadedFileState, highlightSection} = useFile();
    const fileUrl = uploadedFileState?.fileUrl || "";

    const [localHighlights, setLocalHighlights] = useState<HighlightRegion[]>(uploadedFileState?.highlights || []);

    if (!fileUrl) return null;

    const scrollViewerTo = (highlight : HighlightRegion) => {

        const el = document.querySelector(`[data-highlight-id=${highlight.id}]`);
        if (el) el.scrollIntoView({behavior : "smooth"});

    }

    useEffect(() => {
        if (uploadedFileState?.highlights) {
          setLocalHighlights(uploadedFileState.highlights);
        }
    }, [uploadedFileState?.highlights]);

  return (
    <div className='document-viewer-thumbnail w-full border rounded-xl overflow-hidden'>

        <PdfLoader url={fileUrl} beforeLoad={<div className="p-4 text-center text-gray-500">Loading...</div>}>
            {
                (pdfDocument) =>(
                    <PdfHighlighter
                        pdfDocument={pdfDocument}
                        enableAreaSelection = {() => false}
                        scrollRef={() => {}}
                        onScrollChange={()=>{}}
                        onSelectionFinished={()=>{}}
                        highlights = {localHighlights.map((h) => ({
                            id : h.id,
                            content : {text: h.text},
                            position : h.position,
                            comment : {emoji : "", text : ""}
                        }))}
                        highlightTransform={(highlight, index, setTip, hideTip, viewportToScaled, screenshot, isScrolledTo) => (
                            <Popup
                                popupContent={null}
                                onMouseOver={() => setTip(highlight, hideTip)}
                                onMouseOut={hideTip}
                                key={index}
                            >
                                <Highlight
                                    isScrolledTo={isScrolledTo}
                                    position={highlight.position}
                                    comment={{emoji : "", text : ""}}
                                />
                            </Popup>
                        )}
                    />
                )
                
            }
        </PdfLoader>
        
    </div>
  )
}

export default DocViewer


// cutting room floor:

/**
 * onSelectionFinished={(
                            position,
                            content,
                            hideTipAndSelection,
                        ) => {
                            const newHighlight : HighlightRegion = {
                                page : position.pageNumber,
                                text : content.text as string,
                                id : `hl-${Date.now()}`
                            };

                            setLocalHighlights((prev) => [...prev, newHighlight]);
                            onNewHighlight?.(newHighlight);

                            hideTipAndSelection();
                        }}

                        
 */