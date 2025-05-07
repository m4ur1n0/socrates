"use client"

import * as pdfjs from 'pdfjs-dist'
import mammoth from 'mammoth'

export async function extractText(file : File): Promise<string> {

    const fileType = file.name.split('.').pop()?.toLowerCase();

    if (fileType === "pdf") {
        // deal w pdf first

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data : arrayBuffer}).promise;

        let text = '';

        for (let i = 0; i < pdf.numPages; i++) {
            // for each page, parse
            const page = await pdf.getPage(i + 1); // indexed @ 1
            const content = await page.getTextContent();
            text += content.items.map((item : any) => item.str).join(' ') + '\n';

        }

        return text;
    } else if (fileType === "txt") {
        // easiest
        return await file.text();
    } else if (fileType === 'docx' || fileType === "doc") {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({arrayBuffer});
        return result.value;
    } else {
        throw new Error('unsupported file ype') // will never occur, only accepts above types
    }

}