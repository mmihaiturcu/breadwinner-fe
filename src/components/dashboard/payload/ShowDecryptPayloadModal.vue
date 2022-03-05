<template>
    <q-dialog v-model="showDecryptPayloadModal" persistent>
        <div>
            <q-stepper v-model="currentPayloadDecryptionStep" color="primary" animated>
                <q-step
                    :name="1"
                    title="Upload key pair"
                    icon="mdi-key-chain"
                    active-icon="mdi-key-chain"
                    :done="currentPayloadDecryptionStep > 1"
                >
                    <DecryptPayloadStep1 />
                </q-step>

                <q-step
                    :name="2"
                    title="Decrypt payload"
                    icon="mdi-lock-open-check"
                    active-icon="mdi-lock-open-check"
                    :done="currentPayloadDecryptionStep > 2"
                >
                    <DecryptPayloadStep2 />
                </q-step>
            </q-stepper>
        </div>
    </q-dialog>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { usePayloadStore } from 'src/stores';
import { useGlobalI18n } from 'src/utils/hooks';
import { defineComponent } from 'vue';
import DecryptPayloadStep1 from './DecryptPayloadStep1.vue';
import DecryptPayloadStep2 from './DecryptPayloadStep2.vue';

export default defineComponent({
    name: 'ShowDecryptPayloadModal',
    components: {
        DecryptPayloadStep1,
        DecryptPayloadStep2,
    },
    setup() {
        const payloadStore = usePayloadStore();
        const { showDecryptPayloadModal, currentPayloadDecryptionStep } = storeToRefs(payloadStore);
        const { t } = useGlobalI18n();

        return {
            showDecryptPayloadModal,
            currentPayloadDecryptionStep,
            t,
        };
    },
});
</script>

<!-- <style scoped lang="scss">
$dialog-width: 1200px;
$dialog-height: 1000px;

.create-payload-stepper-container {
    width: clamp(100vw, 100vw, #{$dialog-width});
    max-width: $dialog-width;
    // height: $dialog-height;
    // max-height: $dialog-height;
}
</style> -->
