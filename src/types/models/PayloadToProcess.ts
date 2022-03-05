import { ChunkToProcess, JSONSchema, Payload } from '.';

export interface PayloadToProcess {
    id: Payload['id'];
    jsonSchema: JSONSchema;
    chunk: ChunkToProcess;
    publicKey: string;
}
