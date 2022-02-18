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
    actions: {
        async refreshPayloads(userId: User['id']) {
            const response = await getPayloadsForUser(userId);

            this.payloads = response.data;
        },
    },
});

export type PayloadStore = ReturnType<typeof usePayloadStore>;
