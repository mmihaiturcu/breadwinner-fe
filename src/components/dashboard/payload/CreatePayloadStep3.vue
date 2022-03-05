<template>
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
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'CreatePayloadStep3',
    setup() {
        const payloadStore = usePayloadStore();
        const { currentPayloadCreationStep } = storeToRefs(payloadStore);

        return {
            payloadStore,
            loading: ref(false),
            currentPayloadCreationStep,
        };
    },
    methods: {
        async preparePayloads() {
            this.loading = true;
            await this.payloadStore.processPayloads().finally(() => {
                this.payloadStore.$patch({
                    showCreatePayloadModal: false,
                    currentPayloadCreationStep: 1,
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
