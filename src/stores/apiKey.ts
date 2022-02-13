import { defineStore } from 'pinia';
import { getApiKeysForUser } from 'src/service/service';
import { APIKey, User } from 'src/types/models';
import { CreateApiKeyRequest } from 'src/types/requests';

const storeID = 'apiKey';

interface ApiKeyStoreState {
    apiKeys: APIKey[];
    showCreateApiKeyModal: boolean;
    createApiKeyRequest: CreateApiKeyRequest;
}

const ApiKeyStoreState: ApiKeyStoreState = {
    apiKeys: [],
    showCreateApiKeyModal: false,
    createApiKeyRequest: {
        userId: -1,
        hostname: '',
    },
};

export { ApiKeyStoreState };

export const useApiKeyStore = defineStore({
    id: storeID,
    state: (): ApiKeyStoreState => ApiKeyStoreState,
    actions: {
        async refreshApiKeys(userId: User['id']) {
            const response = await getApiKeysForUser(userId);

            this.apiKeys = response.data;
        },
    },
});

export type ApiKeyStore = ReturnType<typeof useApiKeyStore>;
