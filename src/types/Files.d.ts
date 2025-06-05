export type UploadedFileState = {
    name : string;
    type : 'pdf' | 'docx' | 'doc' | 'txt';
    fileUrl : string; // from URL.createObjectURL --> could also be used to access from a remote bucket like s3
    textContent : string; // full text from the file.
    pageTexts? : string[]; // if we want to store text per page here
    highlights : HighlightRegion[];
}

export type HighlightRegion = {
    page : number;
    text : string;
    id : string;
    comment? : string;
    position : { // identical to IHighlight.position
        pageNumber : number;
        boundingRect : {
            x1 : number;
            y1 : number;
            x2 : number;
            y2 : number;
            width : number;
            height : number;
        };
        rects : Array<{
            x1 : number;
            y1 : number;
            x2 : number;
            y2 : number;
            width : number;
            height : number;
        }>;
    }
}

export type EmbeddedChunk = {
    page : number; // 0-indexed
    chunk : string; 
    indexInPage : number;
    embedding? : number[];

}

