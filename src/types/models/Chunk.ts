export interface Chunk {
    length: number;
    cipherText: Record<string, string>; // serialized CipherText
}
