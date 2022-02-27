import { Chunk } from '.';

export interface Payload {
    id: number;
    jsonSchema: string;
    dataSupplierId: number;
    chunks: Chunk[];
}
