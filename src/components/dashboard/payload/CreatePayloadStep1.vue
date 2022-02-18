<template>
    <q-form class="column items-center" @submit="onNext">
        <q-file
            color="primary"
            filled
            v-model="uploadedFile"
            label="Upload a dataset"
            :style="{ width: '330px' }"
            accept=".csv, .xlsx, .xls"
            :rules="[(value) => value || 'You must first upload a file.']"
        >
            <template v-slot:prepend>
                <q-icon name="cloud_upload" />
            </template>
        </q-file>
        <q-stepper-navigation>
            <q-btn type="submit" color="primary" label="Next" icon="mdi-arrow-right-bold" />
        </q-stepper-navigation>
    </q-form>
</template>

<script lang="ts">
import Papa from 'papaparse';
import { storeToRefs } from 'pinia';
import { usePayloadStore } from 'src/stores';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'CreatePayloadStep1',
    setup() {
        const payloadStore = usePayloadStore();
        const { uploadedFile, currentPayloadCreationStep } = storeToRefs(payloadStore);

        return {
            uploadedFile,
            currentPayloadCreationStep,
            payloadStore,
        };
    },
    methods: {
        onNext() {
            if (this.uploadedFile) {
                // Logic for processing the file with papaparse
                Papa.parse(this.uploadedFile, {
                    worker: true,
                    header: false,

                    complete: (result) => {
                        const headers = result.data.shift() as string[];
                        result.data.forEach(
                            (data: unknown, index) => ((data as { index: number }).index = index)
                        );
                        this.payloadStore.$patch({
                            uploadedDataset: {
                                data: result.data as unknown[][],
                                headers,
                            },
                            currentPayloadCreationStep: this.currentPayloadCreationStep + 1,
                            payloadTabs: [{ name: 'Payload 1', state: { selectedRows: [] } }],
                            currentPayloadTabName: 'Payload 1',
                        });
                        // const chunks: number[][][] = chunkArray(
                        //     result.data,
                        //     CHUNK_SIZE
                        // ) as number[][][];
                        // console.log('Chunks', chunks);
                        // const firstChunk = chunks[0];
                        // // TODO: find elegant way to handle this.
                        // const valueColumn = firstChunk.map((val) => val[5]);
                        // valueColumn.shift();
                        // const { seal, context } = await this.initFHEContext();
                        // const { publicKey, secretKey } = this.generateKeys(seal, context);
                        // const serializedSecretKey = secretKey.save();
                        // console.log(serializedSecretKey);
                        // const encryptedValues = this.encryptData(
                        //     seal,
                        //     context,
                        //     publicKey,
                        //     valueColumn
                        // );
                        // const decryptedValues = this.decryptData(
                        //     seal,
                        //     context,
                        //     secretKey,
                        //     encryptedValues
                        // );
                        // console.log(decryptedValues);
                    },
                });
            }
        },
    },
});
</script>
