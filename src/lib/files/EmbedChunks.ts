import { pipeline } from "@xenova/transformers";

let embedder : any = null;

export async function generateEmbeddings(chunks : string[]) : Promise<number[][]> {
    // return vector map

    if (!embedder) {
        embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }

    const embeddings : number[][] = [];

    for (const chunk of chunks) {
        const output = await embedder(chunk, {pooling: 'mean', normalize: true});
    }

    return embeddings;
}

