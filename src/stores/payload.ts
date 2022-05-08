import { defineStore } from 'pinia';
import {
    createPayload,
    createPaymentForUnattachedPayloads,
    getPayloadsForUser,
} from 'src/service/service';
import { Chunk, Dataset, Payload, PayloadDTO, PayloadTab } from 'src/types/models';
import { CHUNK_SIZE } from 'src/utils/constants';
import { chunkArray } from 'src/utils/helper';
import { Notify } from 'quasar';
import { KeyPair, OperationType, FHEModule, SchemeType } from 'breadwinner';
import { OperandTypes } from 'src/types/enums';

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
    checkoutURL: string;
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
    checkoutURL: '',
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
            const response = await getPayloadsForUser();

            this.payloads = response.data;
        },
        async processPayloads(): Promise<Promise<void>> {
            const payloads: PayloadDTO[] = [];

            const payloadPromises = [];

            for (const payloadTab of this.payloadTabs) {
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

                let schemeType: SchemeType = SchemeType.BGV;

                selectedColumnIndicesSet.forEach((columnIndex) => {
                    const columnData = this.uploadedDataset.data.map(
                        (row) => row[columnIndex] as number
                    );
                    if (
                        schemeType !== SchemeType.CKKS &&
                        columnData.find((value) => !Number.isInteger(value))
                    ) {
                        schemeType = SchemeType.CKKS;
                    }
                    chunksByColumn[columnIndex] = chunkArray(columnData, CHUNK_SIZE) as number[][];
                });

                const dataLengths = chunksByColumn[
                    selectedColumnIndicesSet.values().next().value as number
                ].map((chunk) => chunk.length);

                const chunks = new Array<Chunk>(dataLengths.length);

                await FHEModule.initFHEContext(schemeType);
                const keyPair = FHEModule.generateKeys();
                let galoisKeys = undefined as undefined | string;
                // Special case if we're performing addition for a single array (sum of its elements). In this case, we have to create special Galois keys.
                if (
                    payloadTab.state.operations.some(
                        (operation) =>
                            operation.operationObject.type === OperationType.ADD &&
                            operation.operands.length === 1 &&
                            operation.operands[0].type === OperandTypes.ARRAY
                    )
                ) {
                    galoisKeys = FHEModule.generateGaloisKeys();
                }

                let relinKeys = undefined as undefined | string;

                // Special case for multiplication, we must relinearize ciphertext after multiplication.

                if (
                    payloadTab.state.operations.some(
                        (operation) => operation.operationObject.requiresRelinKeys
                    )
                ) {
                    relinKeys = FHEModule.generateRelinKeys();
                }

                dataLengths.forEach((chunkLength, index) => {
                    const chunkObject: Record<string, string> = {};

                    selectedColumnIndicesSet.forEach(
                        (columnIndex) =>
                            (chunkObject[columnIndex] = FHEModule.encryptData(
                                chunksByColumn[columnIndex][index]
                            ))
                    );
                    chunks[index] = {
                        length: chunkLength,
                        cipherText: chunkObject,
                    };
                });

                this.generatedKeyPairs.push({ pair: keyPair, label: payloadTab.label });

                FHEModule.deallocate();

                payloadPromises.push(
                    createPayload({
                        label: payloadTab.label,
                        chunks,
                        jsonSchema: {
                            schemeType,
                            operations: payloadTab.state.operations.map((operation) => ({
                                type: operation.operationObject.type,
                                operands: operation.operands.map((operand) => ({
                                    field: operand.value as string,
                                    type: operand.type,
                                    ...('plaintextValue' in operand
                                        ? {
                                              plaintextValue: operand.plaintextValue,
                                              ...(operand.isRaw ? { isRaw: true } : {}),
                                          }
                                        : {}),
                                })),
                                resultType: operation.resultType,
                            })),
                        },
                        publicKey: keyPair.publicKey,
                        galoisKeys,
                        relinKeys,
                    })
                );
            }

            await Promise.all(payloadPromises).catch(() => {
                Notify.create({
                    type: 'negative',
                    message: 'An internal error has occurred.',
                });
            });

            const response = await createPaymentForUnattachedPayloads();

            this.checkoutURL = response.data;

            this.showKeyPairModal = true;

            Notify.create({
                type: 'positive',
                message: `Your payload${
                    payloads.length > 1 ? 's' : ''
                } have been created successfully. Their processing shall begin as soon as your payment is accepted.`,
            });

            await this.refreshPayloads();
        },
    },
});

export type PayloadStore = ReturnType<typeof usePayloadStore>;
