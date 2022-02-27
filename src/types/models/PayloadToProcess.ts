import { ChunkToProcess, Payload } from '.';

export interface PayloadToProcess {
    id: Payload['id'];
    jsonSchema: Payload['jsonSchema'];
    chunks: ChunkToProcess[];
}
