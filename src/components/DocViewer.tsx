"use client"
import { HighlightRegion } from '@/types/Files'
import React, { useState } from 'react'
import { Highlight, PdfHighlighter, PdfLoader, Popup } from 'react-pdf-highlighter'

type Props = {
    fileUrl : string
    highlights : HighlightRegion[]
    onNewHighlight? : (highlight : HighlightRegion) => void;
}

const DocViewer = ({fileUrl , highlights, onNewHighlight}: Props) => {

    const [localHighlights, setLocalHighlights] = useState<HighlightRegion[]>(highlights);

    const scrollViewerTo = (highlight : HighlightRegion) => {

        const el = document.querySelector(`[data-highlight-id=${highlight.id}]`);
        if (el) el.scrollIntoView({behavior : "smooth"});

    }

  return (
    <div className='document-viewer-thumbnail w-full border rounded-xl overflow-hidden'>

        <PdfLoader url={fileUrl} beforeLoad={<div className="p-4 text-center">Loading...</div>}>
            {
                (pdfDocument) =>(
                    <PdfHighlighter
                        pdfDocument={pdfDocument}
                        enableAreaSelection = {(event) => event.altKey}
                        scrollRef={() => {}}
                        highlights = {localHighlights.map((h, i) => ({
                            id : h.id || `hl-${i}`,
                            content : {text: h.text},
                            position : {
                                pageNumber : h.page,
                                boundingRect : {}, // auto generate if needed -- PSYCH THIS DOESN'T SEEM TO WORK   
                                rects : [],
                            },
                            comment : ""
                        }))}
                        onSelectionFinished={(
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

                        highlightTransform={(highlight, index, setTip, hideTip, viewportToScaled, screenshot, isScrolledTo) => (
                            <Popup
                                popupContent={null}
                                onMouseOver={setTip}
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