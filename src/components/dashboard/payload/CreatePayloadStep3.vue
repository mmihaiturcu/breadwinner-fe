<template>
    <div class="row items-center justify-center">
        <q-item-label overline class="q-ma-sm text-uppercase text-bold">
            Total price:
        </q-item-label>
        <div class="row items-center justify-center text-h5">
            <q-icon color="primary" name="mdi-currency-usd" />
            <div class="text-center">
                {{ payloadPrice }}
            </div>
        </div>
    </div>
    <q-stepper-navigation class="row flex-center navigation" align="center">
        <q-btn
            flat
            label="Back"
            icon="mdi-arrow-left-bold"
            @click="currentPayloadCreationStep -= 1"
        />
        <q-btn
            color="primary"
            label="Submit payloads"
            icon="mdi-database-arrow-up"
            :loading="loading"
            @click="preparePayloads"
        />
    </q-stepper-navigation>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { usePayloadStore } from 'src/stores';
import {
    CHUNK_SIZE,
    MIN_PAYLOAD_PRICE,
    PRICE_PER_CHUNK,
    PRICE_PER_OPERATION,
} from 'src/utils/constants';
import { getNoChunksInArray } from 'src/utils/helper';
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'CreatePayloadStep3',
    setup() {
        const payloadStore = usePayloadStore();
        const { currentPayloadCreationStep, uploadedDataset, payloadTabs } =
            storeToRefs(payloadStore);

        return {
            payloadStore,
            loading: ref(false),
            currentPayloadCreationStep,
            uploadedDataset,
            payloadTabs,
        };
    },
    computed: {
        payloadPrice() {
            let price = 0;
            const noChunks = getNoChunksInArray(this.uploadedDataset.data[0].length, CHUNK_SIZE);
            for (const payloadTab of this.payloadTabs) {
                price +=
                    PRICE_PER_CHUNK * noChunks +
                    PRICE_PER_OPERATION * payloadTab.state.operations.length * noChunks;
            }
            return Math.max(MIN_PAYLOAD_PRICE, price).toFixed(2);
        },
    },
    methods: {
        async preparePayloads() {
            this.loading = true;
            await this.payloadStore.processPayloads().finally(() => {
                this.payloadStore.$patch({
                    currentPayloadCreationStep: 4,
                    uploadedFile: null,
                    uploadedDataset: {
                        headers: [],
                        data: [],
                    },
                    payloadTabs: [],
                    currentPayloadTabName: '',
                });
                this.loading = false;
            });
        },
    },
});
</script>

<style scoped lang="scss">
.navigation {
    gap: 16px;
}
</style>
