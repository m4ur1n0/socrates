// "use client"
// import * as pdfjs from 'pdfjs-dist'
import mammoth from 'mammoth'

// pdfjs.GlobalWorkerOptions.workerSrc = ``;

type TextResp = {
    text : string;
    pages : string[];
    arrayBuffer : any;

}

export async function extractText(file : File): Promise<TextResp> {

    const fileType = file.name.split('.').pop()?.toLowerCase();

    if (fileType === "pdf") {
        // deal w pdf first
        // const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js');

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data : arrayBuffer}).promise;

        let text = '';
        let pages = [];

        for (let i = 0; i < pdf.numPages; i++) {
            // for each page, parse
            const page = await pdf.getPage(i + 1); // indexed @ 1
            const content = await page.getTextContent();
            text += content.items.map((item : any) => item.str).join(' ') + '\n';
            pages.push(content);

        }

        return {text, pages, arrayBuffer};
    } else if (fileType === "txt") {
        // easiest
        return  {text : await file.text(), pages : [], arrayBuffer : null};
    } else if (fileType === 'docx' || fileType === "doc") {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({arrayBuffer});
        return {text : result.value, pages : [], arrayBuffer : null};
    } else {
        throw new Error('unsupported file type') // will never occur, only accepts above types
    }

}