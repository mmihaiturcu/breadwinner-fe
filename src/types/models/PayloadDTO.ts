import { JSONSchema } from 'breadwinner';
import { Chunk } from '.';

export interface PayloadDTO {
    label: string;
    chunks: Chunk[];
    jsonSchema: JSONSchema;
    publicKey: string;
    galoisKeys?: string;
    relinKeys?: string;
}
