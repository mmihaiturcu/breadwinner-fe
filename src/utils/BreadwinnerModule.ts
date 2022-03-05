import { Notify } from 'quasar';
import { Operations, WebsocketEventTypes } from 'src/types/enums';
import { ChunkToProcess, JSONSchema, PayloadToProcess } from 'src/types/models';
import FHEModule from './FHEModule';
import OperationsCalculator from './OperationsCalculator';

class BreadwinnerModule {
    public static instance: BreadwinnerModule;
    private apiKey?: string;
    private websocketConnection?: WebSocket;

    public static getInstance(): BreadwinnerModule {
        if (!this.instance) {
            this.instance = new BreadwinnerModule();
        }

        return this.instance;
    }

    private requestPayload() {
        this.websocketConnection?.send(
            JSON.stringify({ eventType: WebsocketEventTypes.REQUEST_CHUNK })
        );
    }

    private onWebsocketOpen(event: Event) {
        console.log('open', event);
        Notify.create({
            type: 'positive',
            message: 'WSS connection established!',
        });

        this.requestPayload();
    }

    private onWebsocketError(event: Event) {
        console.log('error', event);
        Notify.create({
            type: 'negative',
            message: 'WSS connection could not be established. Please supply a valid API key.',
        });
    }

    private onWebsocketClosed(event: Event) {
        console.log('closed', event);
    }

    private processChunk(chunk: ChunkToProcess, jsonSchema: JSONSchema): string {
        console.log(chunk.input);
        const dataObject = new Map<string | number, string>([['data', chunk.input]]);
        console.log(dataObject, chunk, jsonSchema, dataObject.get('data'));

        const evaluator = FHEModule.seal?.Evaluator(FHEModule.context!);

        if (evaluator) {
            for (const [index, operation] of jsonSchema.operations.entries()) {
                switch (operation.name) {
                    case Operations.ADD:
                        dataObject.set(
                            index,
                            OperationsCalculator[Operations.ADD](
                                evaluator,
                                ...operation.operands.map((operand) => ({
                                    type: operand.type,
                                    data: dataObject.get(operand.field)!,
                                }))
                            )
                        );
                        break;
                }
            }
        } else {
            throw new Error('Evaluator not available.');
        }

        return dataObject.get(jsonSchema.operations.length - 1)!;
    }

    private async processPayload(event: MessageEvent<string>) {
        if (event.data) {
            const payload = JSON.parse(event.data) as PayloadToProcess;
            const chunkToProcess = payload.chunk;

            Notify.create({
                type: 'positive',
                message: `Received chunk to process containing ${chunkToProcess.length} records`,
            });

            console.log('Received payload to process', payload);

            await FHEModule.initFHEContext();
            FHEModule.setPublicKey(payload.publicKey);

            const result = this.processChunk(chunkToProcess, payload.jsonSchema);

            this.websocketConnection?.send(
                JSON.stringify({
                    eventType: WebsocketEventTypes.SEND_CHUNK_PROCESSING_RESULT,
                    data: result,
                })
            );
        } else {
            Notify.create({
                type: 'negative',
                message: 'Did not receive any chunk.',
            });
        }

        setTimeout(() => this.requestPayload(), 60000);
    }

    private initializeWebsocketConnection() {
        this.websocketConnection = new WebSocket(process.env.BACKEND_WSS_URL, this.apiKey);
        this.websocketConnection.onmessage = (event: MessageEvent<string>) =>
            this.processPayload(event);
        this.websocketConnection.onerror = (event) => this.onWebsocketError(event);
        this.websocketConnection.onclose = (event) => this.onWebsocketClosed(event);
        this.websocketConnection.onopen = (event) => this.onWebsocketOpen(event);
    }

    public init(apiKey: string) {
        this.apiKey = apiKey;

        if (this.websocketConnection) {
            this.websocketConnection.close();
        }

        this.initializeWebsocketConnection();
    }
}

export default BreadwinnerModule.getInstance();
