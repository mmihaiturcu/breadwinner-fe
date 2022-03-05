<template>
    <q-form class="column items-center" @submit="onNext">
        <q-file
            color="primary"
            filled
            v-model="uploadedKeyPairFile"
            label="Upload your key pair"
            :style="{ width: '330px' }"
            accept=".json"
            :rules="[(value) => value || 'You must first upload a file.']"
        >
            <template v-slot:prepend>
                <q-icon name="mdi-key-chain" />
            </template>
        </q-file>
        <q-stepper-navigation>
            <q-btn type="submit" color="primary" label="Next" icon="mdi-arrow-right-bold" />
        </q-stepper-navigation>
    </q-form>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { usePayloadStore } from 'src/stores';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'CreatePayloadStep1',
    setup() {
        const payloadStore = usePayloadStore();
        const { currentPayloadDecryptionStep, uploadedKeyPairFile } = storeToRefs(payloadStore);

        return {
            uploadedKeyPairFile,
            currentPayloadDecryptionStep,
        };
    },
    methods: {
        onNext() {
            if (this.uploadedKeyPairFile) {
                this.currentPayloadDecryptionStep++;
            }
        },
    },
});
</script>
