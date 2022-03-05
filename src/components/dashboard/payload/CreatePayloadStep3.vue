<template>
    <q-stepper-navigation align="center">
        <q-btn
            color="primary"
            label="Submit"
            icon="mdi-arrow-right-bold"
            :loading="loading"
            @click="preparePayloads"
        />
    </q-stepper-navigation>
</template>

<script lang="ts">
import { usePayloadStore } from 'src/stores';
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'CreatePayloadStep3',
    setup() {
        const payloadStore = usePayloadStore();

        return {
            payloadStore,
            loading: ref(false),
        };
    },
    methods: {
        async preparePayloads() {
            this.loading = true;
            await this.payloadStore.processPayloads().finally(() => (this.loading = false));
        },
    },
});
</script>
