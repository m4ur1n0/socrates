// "use client"
// import { useFile } from '@/context/fileContext'
// import { HighlightRegion } from '@/types/Files'
// import React, { useEffect, useState } from 'react'
// import { Highlight, PdfHighlighter, PdfLoader, Popup } from 'react-pdf-highlighter'

// // type Props = {
// //     fileUrl : string
// //     highlights : HighlightRegion[]
// //     onNewHighlight? : (highlight : HighlightRegion) => void;
// // }

// import { pdfjs } from 'react-pdf'
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

// import 'pdfjs-dist/web/pdf_viewer.css';


// const DocViewer = () => {


//     const {uploadedFileState} = useFile();

//     const [localHighlights, setLocalHighlights] = useState<HighlightRegion[]>(uploadedFileState?.highlights || []);

//     useEffect(() => {
//         if (uploadedFileState?.highlights) {
//           setLocalHighlights(uploadedFileState.highlights);
//         }
//     }, [uploadedFileState?.highlights]);


//     console.log('DocViewer render – fileUrl is:', uploadedFileState?.fileUrl);


//     if (!uploadedFileState?.fileUrl) {
//         return (
//             <div className='no-doc-text'>
//                 <p>No Document Uploaded</p>
//             </div>
//         );
//     }

//     const scrollViewerTo = (highlight : HighlightRegion) => {

//         const el = document.querySelector(`[data-highlight-id=${highlight.id}]`);
//         if (el) el.scrollIntoView({behavior : "smooth"});

//     }

    

//   return (
//     <div className='relative document-viewer-thumbnail w-full h-full rounded-xl overflow-hidden border'>

//         <PdfLoader url={uploadedFileState.fileUrl} beforeLoad={<div className="p-4 text-center text-gray-500 h-full w-full ">Loading...</div>}>
//             {
//                 (pdfDocument) =>(
//                     <div style={{position : "absolute", top : 0, left : 0, bottom: 0, right : 0, width : "100%", height : "100%"}}>
//                         <div
//                             className='pdfViewer h-full w-full border-green-400'
//                             style={{position : 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
//                         />
//                         <PdfHighlighter
//                             pdfDocument={pdfDocument}
//                             enableAreaSelection = {() => false}
//                             scrollRef={() => {}}
//                             onScrollChange={()=>{}}
//                             onSelectionFinished={()=>{}}
//                             highlights = {localHighlights.map((h) => ({
//                                 id : h.id,
//                                 content : {text: h.text},
//                                 position : h.position,
//                                 comment : {emoji : "", text : ""}
//                             }))}
//                             highlightTransform={(highlight, index, setTip, hideTip, viewportToScaled, screenshot, isScrolledTo) => (
//                                 <Popup
//                                     popupContent={null}
//                                     onMouseOver={() => setTip(highlight, hideTip)}
//                                     onMouseOut={hideTip}
//                                     key={index}
//                                 >
//                                     <Highlight
//                                         isScrolledTo={isScrolledTo}
//                                         position={highlight.position}
//                                         comment={{emoji : "", text : ""}}
//                                     />
//                                 </Popup>
//                             )}
//                         />
//                     </div>
//                 )
                
//             }
//         </PdfLoader>
        
//     </div>
//   )
// }

// export default DocViewer


// // cutting room floor:

// /**
//  * onSelectionFinished={(
//                             position,
//                             content,
//                             hideTipAndSelection,
//                         ) => {
//                             const newHighlight : HighlightRegion = {
//                                 page : position.pageNumber,
//                                 text : content.text as string,
//                                 id : `hl-${Date.now()}`
//                             };

//                             setLocalHighlights((prev) => [...prev, newHighlight]);
//                             onNewHighlight?.(newHighlight);

//                             hideTipAndSelection();
//                         }}

                        
//  */

// components/DocViewer.tsx

"use client"

import { useFile } from '@/context/fileContext'
import { HighlightRegion } from '@/types/Files'
import React, { useEffect, useState, useRef } from 'react'
import { Highlight, PdfHighlighter, PdfLoader, Popup } from 'react-pdf-highlighter'

// ─── BEGINNING EDIT ───
// We must tell pdf.js where to find its worker. 
// (Without this, PdfLoader/PDFViewer won’t initialize correctly.)
import { pdfjs } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
// ─── ENDING EDIT ───

import 'pdfjs-dist/web/pdf_viewer.css'

const DocViewer = () => {
  const { uploadedFileState } = useFile()
  const [localHighlights, setLocalHighlights] = useState<HighlightRegion[]>(uploadedFileState?.highlights || [])

  useEffect(() => {
    if (uploadedFileState?.highlights) {
      setLocalHighlights(uploadedFileState.highlights)
    }
  }, [uploadedFileState?.highlights])

  console.log('DocViewer render – fileUrl is:', uploadedFileState?.fileUrl)

  if (!uploadedFileState?.fileUrl) {
    return (
      <div className='no-doc-text flex items-center justify-center w-full h-full'>
        <p>No Document Uploaded</p>
      </div>
    )
  }

  // ─── BEGINNING EDIT ───
  // Create a ref for the scrollable container that PdfHighlighter will mount into.
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  // ─── ENDING EDIT ───

//   const scrollViewerTo = (highlight: HighlightRegion) => {
//     const el = document.querySelector(`[data-highlight-id=${highlight.id}]`)
//     if (el) el.scrollIntoView({ behavior: 'smooth' })
//   }

  return (
    <div className='relative document-viewer-thumbnail w-full h-full rounded-xl overflow-hidden border'>
      <PdfLoader
        url={uploadedFileState.fileUrl}
        beforeLoad={
          <div className="p-4 text-center text-gray-500 h-full w-full">
            Loading...
          </div>
        }
      >
        {(pdfDocument) => (
          // ─── BEGINNING EDIT ───
          <div
            // This is the “positioned ancestor” for both the scroll container and PdfHighlighter.
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}
          >
            {/* 
              1) This <div> is the container that PdfHighlighter will call “getComputedStyle(container).position” on. 
                 It MUST be: position: absolute; top/left/right/bottom = 0; overflow: auto; 
                 so that PDFViewer sees “container.style.position === 'absolute'” 
                 and also has a real scrollable area. 
            */}
            <div
              ref={scrollContainerRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: 'auto',
              }}
            >
              {/*
                2) Inside that scroll container, PDF.js’s <PDFViewer> will mount into a child DIV 
                   with className="pdfViewer". By default, PDF.js expects:
                     .pdfViewer { position: absolute; top: 0; left: 0; } 
                   Then PDF.js will size & render pages inside of it. 
              */}
              <div
                className='pdfViewer'
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  // (You **do not** need bottom/right here: PDF.js will assign width/height per page.)
                }}
              />
            </div>

            {/*
               3) Finally, PdfHighlighter is a “sibling” to the scroll container (still under the same relative parent).
                  We tell it how to find the scrollable area by giving it scrollRef={() => scrollContainerRef.current}.
            */}
            <PdfHighlighter
              pdfDocument={pdfDocument}
              enableAreaSelection={() => false}
              scrollRef={() => scrollContainerRef.current}
              onScrollChange={() => { }}
              onSelectionFinished={() => { }}
              highlights={localHighlights.map((h) => ({
                id: h.id,
                content: { text: h.text },
                position: h.position,
                comment: { emoji: '', text: '' },
              }))}
              highlightTransform={(
                highlight,
                index,
                setTip,
                hideTip,
                viewportToScaled,
                screenshot,
                isScrolledTo
              ) => (
                <Popup
                  popupContent={null}
                  onMouseOver={() => setTip(highlight, hideTip)}
                  onMouseOut={hideTip}
                  key={index}
                >
                  <Highlight
                    isScrolledTo={isScrolledTo}
                    position={highlight.position}
                    comment={{ emoji: '', text: '' }}
                  />
                </Popup>
              )}
            />
          </div>
          // ─── ENDING EDIT ───
        )}
      </PdfLoader>
    </div>
  )
}

export default DocViewer
