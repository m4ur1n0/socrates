// file for chunking text for RAG

export function chunkText(text : string, chunkSize? : number, overlap? : number) {
    if (!chunkSize) {
        chunkSize = 300;
    }

    if (!overlap) {
        overlap = 50;
    }

    const words = text.split(/\s+/); // split by whitespace
    const chunks = [];

    for (let i = 0; i < words.length; i+= chunkSize - overlap) {
        const chunk = words.slice(i, i+chunkSize).join(' ');
        chunks.push(chunk);
        if (i +  chunkSize >= words.length) break;
    }

    return chunks;
}

