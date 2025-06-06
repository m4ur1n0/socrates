export type ChunkDocument = {
    chunk : string;
    embedding : number[];
    index : number;
    indexInPage? : number;
    page : number;
    id : string;
}