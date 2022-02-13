<template>
    <q-dialog v-model="showCreateApiKeyModal">
        <q-card class="create-api-key-modal-card-container">
            <q-card-section>
                <div class="text-h6">Create API Key</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
                <q-form>
                    <div class="q-pa-sm q-ma-sm">
                        <q-input
                            name="hostname"
                            type="text"
                            outlined
                            label="Hostname"
                            v-model="createApiKeyRequest.hostname"
                            :rules="[
                                (value) =>
                                    /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/.test(value) ||
                                    value === 'localhost' ||
                                    'The inputted value is not a valid hostname.',
                            ]"
                        >
                            <template v-slot:prepend>
                                <q-icon
                                    :name="$q.platform.is.ios ? 'mdi-desktop-mac' : 'mdi-monitor'"
                                />
                            </template>
                        </q-input>
                    </div>
                </q-form>
            </q-card-section>

            <q-card-actions align="center">
                <q-btn label="Create" color="primary" icon="mdi-key-plus" @click="createApiKey" />
                <q-btn flat v-close-popup label="Cancel" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { createAPIKey } from 'src/service/service';
import { useUserStore } from 'src/stores';
import { useApiKeyStore } from 'src/stores/apiKey';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'CreateApiKeyModal',
    setup() {
        const apiKeyStore = useApiKeyStore();
        const userStore = useUserStore();
        const { showCreateApiKeyModal, createApiKeyRequest } = storeToRefs(apiKeyStore);
        const { userDetails } = storeToRefs(userStore);

        return {
            showCreateApiKeyModal,
            createApiKeyRequest,
            userDetails,
            apiKeyStore,
        };
    },
    methods: {
        async createApiKey() {
            const response = await createAPIKey({
                hostname: this.createApiKeyRequest.hostname,
                userId: this.userDetails.id,
            });

            // TODO: Logic for displaying API key to user (dialog CARD window, make it look nice)
            console.log(response.data);

            // Refresh API keys list to include the new one, and hide this modal.
            await this.apiKeyStore.refreshApiKeys(this.userDetails.id);
            this.showCreateApiKeyModal = false;
        },
    },
});
</script>

<style scoped lang="scss">
.create-api-key-modal-card-container {
    width: 500px;
}
</style>
