import { CipherText } from 'node-seal/implementation/cipher-text';
import { Notify } from 'quasar';
import { Operations, WebsocketEventTypes } from 'src/types/enums';
import { ChunkToProcess, PayloadToProcess } from 'src/types/models';
import { REWARD_TIMEOUT_MS } from './constants';
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
        this.websocketConnection?.send(JSON.stringify({ type: WebsocketEventTypes.REQUEST_CHUNK }));
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

    private processChunk(chunk: ChunkToProcess, payload: PayloadToProcess): string {
        console.log(chunk.input);
        const dataObject = new Map<string | number, CipherText>();
        const dataCipherText = FHEModule.seal!.CipherText();
        dataCipherText.load(FHEModule.context!, chunk.input);
        dataObject.set('data', dataCipherText);

        const galoisKeys = FHEModule.seal!.GaloisKeys();

        if (payload.galoisKeys) {
            galoisKeys.load(FHEModule.context!, payload.galoisKeys);
        }

        const evaluator = FHEModule.seal?.Evaluator(FHEModule.context!);

        if (evaluator) {
            for (const [index, operation] of payload.jsonSchema.operations.entries()) {
                switch (operation.name) {
                    case Operations.ADD:
                        dataObject.set(
                            index,
                            OperationsCalculator[Operations.ADD](
                                evaluator,
                                galoisKeys,
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

        return dataObject.get(payload.jsonSchema.operations.length - 1)!.save();
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

            const result = this.processChunk(chunkToProcess, payload);

            console.log('processing result', result);

            this.websocketConnection?.send(
                JSON.stringify({
                    type: WebsocketEventTypes.SEND_CHUNK_PROCESSING_RESULT,
                    data: {
                        chunkId: chunkToProcess.id,
                        result,
                    },
                })
            );
        } else {
            Notify.create({
                type: 'negative',
                message: 'Did not receive any chunk.',
            });
        }

        setTimeout(() => this.requestPayload(), REWARD_TIMEOUT_MS);
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
