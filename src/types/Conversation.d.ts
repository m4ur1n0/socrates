import { ChunkDocument } from "./ChunkDocument";

export interface Conversation {
    conversationId : string;
    userId : string;
    embeddingMap : ChunkDocument[];
    chatHistory : any[];
    lastAccessedDate? : Date;
}