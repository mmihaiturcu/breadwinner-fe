export function getNoChunksInArray(length: number, chunkSize: number) {
    return Math.ceil(length / chunkSize);
}

export function chunkArray(array: unknown[], chunkSize: number): Array<Array<unknown>> {
    const length = array.length;
    const chunks = new Array<Array<unknown>>(getNoChunksInArray(length, chunkSize));
    let currentChunk = 0;

    for (let i = 0; i < length; i += chunkSize) {
        chunks[currentChunk++] = array.slice(i, i + chunkSize);
    }

    return chunks;
}

export function doNothing() {
    return;
}
