import { defineStore } from 'pinia';
import { getPayloadsForUser } from 'src/service/service';
import { Dataset, Payload, PayloadTab, User } from 'src/types/models';

const storeID = 'payload';

interface PayloadStoreState {
    payloads: Payload[];
    showCreatePayloadModal: boolean;
    currentPayloadCreationStep: number;
    uploadedFile: null | File;
    uploadedDataset: Dataset;
    payloadTabs: PayloadTab[];
    currentPayloadTabName: string;
    showAddOperationModal: boolean;
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
        async refreshPayloads(userId: User['id']) {
            const response = await getPayloadsForUser(userId);

            this.payloads = response.data;
        },
    },
});

export type PayloadStore = ReturnType<typeof usePayloadStore>;
