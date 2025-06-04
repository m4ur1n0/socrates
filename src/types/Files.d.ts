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
    id? : string;
    comment? : string;
}