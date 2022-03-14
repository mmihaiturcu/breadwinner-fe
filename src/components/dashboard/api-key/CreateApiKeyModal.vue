<template>
    <q-dialog v-model="showCreateApiKeyModal">
        <q-card class="create-api-key-modal-card-container">
            <q-card-section>
                <div class="text-h6">Create API Key</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
                <q-form @submit="createApiKey">
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
                    <q-card-actions align="center">
                        <q-btn
                            type="submit"
                            label="Create"
                            color="primary"
                            icon="mdi-key-plus"
                            :loading="loading"
                        />
                        <q-btn flat v-close-popup label="Cancel" />
                    </q-card-actions>
                </q-form>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { createAPIKey } from 'src/service/service';
import { useUserStore } from 'src/stores';
import { useApiKeyStore } from 'src/stores/apiKey';
import { useGlobalI18n } from 'src/utils/hooks';
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'CreateApiKeyModal',
    setup() {
        const apiKeyStore = useApiKeyStore();
        const userStore = useUserStore();
        const { showCreateApiKeyModal, createApiKeyRequest, newAPIKey, showReceiveAPIKeyModal } =
            storeToRefs(apiKeyStore);
        const { userDetails } = storeToRefs(userStore);
        const { t } = useGlobalI18n();

        return {
            showCreateApiKeyModal,
            createApiKeyRequest,
            userDetails,
            newAPIKey,
            apiKeyStore,
            t,
            showReceiveAPIKeyModal,
            loading: ref(false),
        };
    },
    methods: {
        async createApiKey() {
            this.loading = true;

            const response = await createAPIKey({
                hostname: this.createApiKeyRequest.hostname,
                userId: this.userDetails.id,
            });

            this.loading = false;

            this.newAPIKey = response.data;
            this.showReceiveAPIKeyModal = true;

            // Refresh API keys list to include the new one, and hide this modal.
            await this.apiKeyStore.refreshApiKeys();
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
