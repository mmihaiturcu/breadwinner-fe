import { Chunk, JSONSchema, User } from '.';

export interface PayloadDTO {
    userId: User['id'];
    chunks: Chunk[];
    jsonSchema: JSONSchema;
}
