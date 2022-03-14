import { Chunk, JSONSchema } from '.';

export interface PayloadDTO {
    label: string;
    chunks: Chunk[];
    jsonSchema: JSONSchema;
    publicKey: string;
    galoisKeys?: string;
    relinKeys?: string;
}
