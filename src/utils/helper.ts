export const chunkArray = function(array: unknown[], chunkSize: number): Array<Array<unknown>> {
    const length = array.length;
    const chunks = new Array<Array<unknown>>(Math.ceil(length / chunkSize));
    let currentChunk = 0;

    for (let i = 0; i < length; i += chunkSize) {
        chunks[currentChunk++] = array.slice(i, i + chunkSize);
    }

    return chunks;
};
