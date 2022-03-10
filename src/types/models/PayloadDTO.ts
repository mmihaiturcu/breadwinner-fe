import { Chunk, JSONSchema, User } from '.';

export interface PayloadDTO {
    userId: User['id'];
    label: string;
    chunks: Chunk[];
    jsonSchema: JSONSchema;
    publicKey: string;
    galoisKeys?: string;
}
