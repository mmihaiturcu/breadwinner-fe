<template>
    <q-dialog v-model="showKeyPairModal" persistent>
        <q-card class="receive-key-pair-modal-card-container">
            <q-toolbar class="bg-primary text-white">
                <q-avatar>
                    <q-icon name="mdi-key" color="accent" />
                </q-avatar>

                <q-toolbar-title>
                    <span class="text-weight-bold">{{ t('payload.keysCreatedTitle') }}</span>
                </q-toolbar-title>
            </q-toolbar>

            <q-card-section>
                {{ t('payload.keysCreatedMessage') }}
            </q-card-section>

            <q-card-section>
                <q-item>
                    <q-item-section>
                        <q-item-label overline class="text-uppercase">{{
                            t('payload.keysCreatedDisclaimerTitle')
                        }}</q-item-label>
                        <q-item-label class="key-pair-disclaimer text-negative">
                            {{ t('payload.keysCreatedDisclaimer') }}
                        </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <q-btn
                            icon="mdi-content-save"
                            color="primary"
                            :label="`Download key pair${generatedKeyPairs.length > 1 ? 's' : ''}`"
                            @click="downloadKeyPair"
                        />
                    </q-item-section>
                </q-item>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn label="Close" flat color="primary" @click="confirmKeyPair" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { usePayloadStore } from 'src/stores/payload';
import { useGlobalI18n } from 'src/utils/hooks';
import { defineComponent } from 'vue';
import { saveAs } from 'file-saver';

export default defineComponent({
    name: 'CreateApiKeyModal',
    setup() {
        const payloadStore = usePayloadStore();
        const { showKeyPairModal, generatedKeyPairs, payloadTabs } = storeToRefs(payloadStore);
        const { t } = useGlobalI18n();

        return {
            generatedKeyPairs,
            t,
            showKeyPairModal,
            payloadTabs,
        };
    },
    methods: {
        downloadKeyPair() {
            this.generatedKeyPairs.forEach((keyPair) => {
                const file = new File(
                    [JSON.stringify(keyPair.pair)],
                    `keyPair${keyPair.label}.json`,
                    {
                        type: 'application/json',
                    }
                );
                saveAs(file);
            });
        },
        confirmKeyPair() {
            this.showKeyPairModal = false;
            this.generatedKeyPairs = [];
        },
    },
});
</script>

<style scoped lang="scss">
.receive-key-pair-modal-card-container {
    width: 500px;
}

.key-pair-disclaimer {
    font-weight: bold;
}
</style>
