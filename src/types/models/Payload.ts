export interface Payload {
    noProcessedChunks: number;
    totalChunks: number;
    uploadedAt: Date;
    schema: Record<string, unknown>;
}
