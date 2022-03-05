<template>
    <q-dialog v-model="showReceiveAPIKeyModal" persistent>
        <q-card class="receive-api-key-modal-card-container">
            <q-card-section>
                <div class="text-h6">{{ t('apiKeys.createdTitle') }}</div>
            </q-card-section>

            <q-card-section>
                {{ t('apiKeys.createdMessage') }}
            </q-card-section>

            <q-card-section>
                <span>{{ t('apiKeys.createdYourKeyIs') }}</span>
            </q-card-section>

            <q-card-section>
                <q-item
                    class="navigation-breadwinner-item"
                    clickable
                    @click="copyAPIKeyToClipboard"
                >
                    <q-item-section avatar>
                        <q-icon name="mdi-key" color="primary" />
                    </q-item-section>

                    <q-item-section>
                        <div
                            class="api-key-message text-h6 text-uppercase text-center accent text-accent text-bold roboto"
                        >
                            {{ newAPIKey }}
                        </div>
                    </q-item-section>
                    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                        <div class="text-h6">
                            <strong>Copy to clipboard <q-icon name="mdi-content-copy" /></strong>
                        </div>
                    </q-tooltip>
                </q-item>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn label="Close" flat color="primary" @click="confirmNewAPIKey" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { useApiKeyStore } from 'src/stores/apiKey';
import { useGlobalI18n } from 'src/utils/hooks';
import { defineComponent } from 'vue';
import { copyToClipboard } from 'quasar';

export default defineComponent({
    name: 'CreateApiKeyModal',
    setup() {
        const apiKeyStore = useApiKeyStore();
        const { newAPIKey, showReceiveAPIKeyModal } = storeToRefs(apiKeyStore);
        const { t } = useGlobalI18n();

        return {
            newAPIKey,
            t,
            showReceiveAPIKeyModal,
        };
    },
    methods: {
        async copyAPIKeyToClipboard() {
            await copyToClipboard(this.newAPIKey);
            this.$q.notify({
                type: 'positive',
                message: this.t('apiKeys.copied'),
            });
        },
        confirmNewAPIKey() {
            this.showReceiveAPIKeyModal = false;
            this.newAPIKey = '';
        },
    },
});
</script>

<style scoped lang="scss">
.receive-api-key-modal-card-container {
    width: 500px;
}

.api-key-message {
    font-size: 17px;
}
</style>
