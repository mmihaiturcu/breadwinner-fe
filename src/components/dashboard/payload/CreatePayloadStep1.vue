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
        const { uploadedFile, currentPayloadCreationStep, uploadedDataset } =
            storeToRefs(payloadStore);

        return {
            uploadedFile,
            currentPayloadCreationStep,
            payloadStore,
            uploadedDataset,
        };
    },
    methods: {
        onNext() {
            if (this.uploadedFile) {
                Papa.parse(this.uploadedFile, {
                    worker: true,
                    header: false,
                    dynamicTyping: true,
                    complete: (result: Papa.ParseResult<unknown[]>) => {
                        const headers = result.data.shift();
                        result.data.forEach(
                            (data: unknown, index) => ((data as { index: number }).index = index)
                        );
                        this.uploadedDataset = {
                            data: result.data,
                            headers: headers!.map((header, index) => {
                                return {
                                    label: header as string,
                                    value: index,
                                    isNumeric: typeof result.data[0][index] === 'number',
                                };
                            }),
                        };
                        this.payloadStore.$patch({
                            currentPayloadCreationStep: this.currentPayloadCreationStep + 1,
                            payloadTabs: [
                                {
                                    name: 'Payload 1',
                                    label: 'Payload 1',
                                    state: {
                                        selectedRows: [],
                                        operations: [],
                                    },
                                },
                            ],
                            currentPayloadTabName: 'Payload 1',
                        });
                    },
                });
            }
        },
    },
});
</script>
