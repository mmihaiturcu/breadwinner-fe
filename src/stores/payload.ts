import { defineStore } from 'pinia';
import { createPayload, getPayloadsForUser } from 'src/service/service';
import { Chunk, Dataset, KeyPair, Payload, PayloadDTO, PayloadTab } from 'src/types/models';
import { CHUNK_SIZE } from 'src/utils/constants';
import FHEModule from 'src/utils/FHEModule';
import { chunkArray } from 'src/utils/helper';
import { Notify } from 'quasar';
import { useUserStore } from '.';
import { OperandTypes, Operations } from 'src/types/enums';

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
    keyPair: KeyPair;
    generatedKeyPairs: {
        pair: KeyPair;
        label: string;
    }[];
    showKeyPairModal: boolean;
    showDecryptPayloadModal: boolean;
    payloadToDecryptId: Payload['id'];
    currentPayloadDecryptionStep: number;
    uploadedKeyPairFile: null | File;
    showEditPayloadTabModal: boolean;
    payloadTabToEdit: PayloadTab | null;
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
    generatedKeyPairs: [],
    showKeyPairModal: false,
    showDecryptPayloadModal: false,
    payloadToDecryptId: -1,
    currentPayloadDecryptionStep: 1,
    uploadedKeyPairFile: null,
    showEditPayloadTabModal: false,
    payloadTabToEdit: null,
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
            FHEModule.initKeyGenerator();

            const payloads: PayloadDTO[] = this.payloadTabs.map((payloadTab) => {
                const keyPair = FHEModule.generateKeys();
                let galoisKeys = undefined as undefined | string;
                // Special case if we're performing addition for a single array (sum of its elements). In this case, we have to create special Galois keys.
                if (
                    payloadTab.state.operations.some(
                        (operation) =>
                            operation.operationObject.name === Operations.ADD &&
                            operation.operands.length === 1 &&
                            operation.operands[0].type === OperandTypes.ARRAY
                    )
                ) {
                    galoisKeys = FHEModule.generateGaloisKeys();
                }

                // Get the selected columns of the dataset, in order to chunk & encrypt them.
                const selectedColumnIndicesSet: Set<number> = new Set();

                payloadTab.state.operations
                    .map((operation) => operation.operands)
                    .forEach((operands) => {
                        operands
                            .filter((operand) => 'columnIndex' in operand)
                            .forEach((operand) =>
                                selectedColumnIndicesSet.add(operand.columnIndex as number)
                            );
                    });

                const chunksByColumn: Record<number, number[][]> = {};

                selectedColumnIndicesSet.forEach((columnIndex) => {
                    chunksByColumn[columnIndex] = chunkArray(
                        this.uploadedDataset.data.map((row) => row[columnIndex] as number),
                        CHUNK_SIZE
                    ) as number[][];
                });

                console.log(chunksByColumn);

                const dataLengths = chunksByColumn[
                    selectedColumnIndicesSet.values().next().value as number
                ].map((chunk) => chunk.length);

                const chunks = new Array<Chunk>(dataLengths.length);

                dataLengths.forEach((chunkLength, index) => {
                    const chunkObject: Record<string, string> = {};

                    selectedColumnIndicesSet.forEach(
                        (columnIndex) =>
                            (chunkObject[columnIndex] = FHEModule.encryptData(
                                chunksByColumn[columnIndex][index]
                            ).save())
                    );
                    chunks[index] = {
                        length: chunkLength,
                        cipherText: chunkObject,
                    };
                });

                this.generatedKeyPairs.push({ pair: keyPair, label: payloadTab.label });

                return {
                    userId: userStore.userDetails.id,
                    label: payloadTab.label,
                    chunks,
                    jsonSchema: {
                        totalDataLength: this.uploadedDataset.data.length,
                        operations: payloadTab.state.operations.map((operation) => ({
                            name: operation.operationObject.name,
                            operands: operation.operands.map((operand) => ({
                                field: operand.value as string,
                                type: operand.type,
                            })),
                            resultType: operation.resultType,
                        })),
                    },
                    publicKey: keyPair.publicKey,
                    galoisKeys,
                };
            });
            console.log(payloads);

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
