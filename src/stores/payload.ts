import { defineStore } from 'pinia';
import { createPayload, getPayloadsForUser } from 'src/service/service';
import { Dataset, Payload, PayloadDTO, PayloadTab } from 'src/types/models';
import { CHUNK_SIZE } from 'src/utils/constants';
import FHEModule from 'src/utils/FHEModule';
import { chunkArray } from 'src/utils/helper';
import { Notify } from 'quasar';
import { useUserStore } from '.';

const storeID = 'payload';

interface PayloadStoreState {
    uploadedFile: null | File;
    uploadedDataset: Dataset;
    payloads: Payload[];
    showCreatePayloadModal: boolean;
    currentPayloadCreationStep: number;
    payloadTabs: PayloadTab[];
    currentPayloadTabName: string;
    showAddOperationModal: boolean;
    keyPair: {
        publicKey: string;
        privateKey: string;
    };
    showKeyPairModal: boolean;
}

const PayloadStoreState: PayloadStoreState = {
    payloads: [],
    showCreatePayloadModal: false,
    currentPayloadCreationStep: 1,
    uploadedFile: null,
    uploadedDataset: {
        headers: [],
        data: [],
    },
    payloadTabs: [],
    currentPayloadTabName: '',
    showAddOperationModal: false,
    keyPair: {
        publicKey: '',
        privateKey: '',
    },
    showKeyPairModal: false,
};

export { PayloadStoreState };

export const usePayloadStore = defineStore({
    id: storeID,
    state: (): PayloadStoreState => PayloadStoreState,
    getters: {
        numericHeaders: (state) =>
            state.uploadedDataset.headers.filter((header) => header.isNumeric),
        currentPayloadTab: (state) =>
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            state.payloadTabs.find((tab) => tab.name === state.currentPayloadTabName)!,
    },
    actions: {
        async refreshPayloads() {
            const userStore = useUserStore();
            const response = await getPayloadsForUser(userStore.userDetails.id);

            this.payloads = response.data;
        },
        async processPayloads() {
            const userStore = useUserStore();

            await FHEModule.initFHEContext();
            this.keyPair = FHEModule.generateKeys();

            const payloads: PayloadDTO[] = this.payloadTabs.map((payloadTab) => {
                const chunks = chunkArray(
                    this.uploadedDataset.data.map(
                        (row) => row[payloadTab.state.selectedHeader!.value] as number
                    ),
                    CHUNK_SIZE
                ) as number[][];
                this.uploadedDataset.data.map(
                    (row) => row[payloadTab.state.selectedHeader!.value] as number
                );

                return {
                    userId: userStore.userDetails.id,
                    chunks: chunks.map((chunk) => ({
                        length: chunk.length,
                        cipherText: FHEModule.encryptData(chunk).saveArray(),
                    })),
                    jsonSchema: {
                        totalDataLength: this.uploadedDataset.data.length,
                        operations: payloadTab.state.operations.map((operation) => ({
                            name: operation.operationObject.name,
                            operands: operation.operands.map((operand) => operand.value),
                        })),
                    },
                };
            });

            for (const payload of payloads) {
                await createPayload(payload);
            }

            this.showCreatePayloadModal = false;
            this.showKeyPairModal = true;

            Notify.create({
                type: 'positive',
                message: `Your payload${
                    payloads.length > 1 ? 's' : ''
                } have been created successfully. You will receive an e-mail notification when they have been fully processed.`,
            });

            await this.refreshPayloads();
        },
    },
});

export type PayloadStore = ReturnType<typeof usePayloadStore>;
