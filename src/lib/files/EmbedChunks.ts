import { pipeline } from "@xenova/transformers";


let embedder : any = null;

export async function getEmbedder() {
    if (!embedder) {
        embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
            progress_callback : console.log,
        });
    }

    return embedder;
}

export async function generateEmbeddings(chunks : string[]) : Promise<number[][]> {
    // return vector map

    await getEmbedder();

    const embeddings : number[][] = [];

    for (const chunk of chunks) {
        const output = await embedder(chunk, {pooling: 'mean', normalize: true});
        embeddings.push(output.data);
    }

    // save to localStorage
    localStorage.setItem("chunks", JSON.stringify(chunks));
    localStorage.setItem("embeddings", JSON.stringify(embeddings));

    return embeddings;
}

function objectToList(obj : any) {
    const list = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const index = parseInt(key);
        list[index] = obj[key];
      }
    }
    return list;
  }

export function loadCachedEmbeddings() : {chunks : string[], embeddings : number[][]} | null {
    const chunkStr = localStorage.getItem("chunks");
    const embStr = localStorage.getItem("embeddings");

    if (chunkStr && embStr) {
        return {
            chunks : JSON.parse(chunkStr),
            embeddings : JSON.parse(embStr).map((emb: any) => objectToList(emb))
        };
    }

    // nothing cached == return null
    console.log("NO CACHED EMBVEDDINGS");
    return null;
}

export function cosineSimilarity(a : number[], b: number[]) : number {
    // take in two vectors, find their cosine similarity
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (normA * normB);
}

export async function getChunksFromInput(userInput : string, chunks : string[], embeddings : number[][], topK = 2) : Promise<string[]> {

    const embedder = await getEmbedder();
    const inputEmbedding = (await embedder(userInput, {
        pooling : 'mean',
        normalize : true
    })).data;

    const similarities = embeddings.map((emb, i) => ({
        index : i,
        score : cosineSimilarity(inputEmbedding, emb)
    }));

    const topKChunks = similarities.sort((a, b) => b.score - a.score).slice(0, topK).map(({index}) => chunks[index]);

    return topKChunks;
}