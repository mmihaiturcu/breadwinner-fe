export interface Chunk {
    length: number;
    cipherText: Uint8Array; // serialized CipherText
}
