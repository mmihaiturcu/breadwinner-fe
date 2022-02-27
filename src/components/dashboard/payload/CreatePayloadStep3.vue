<template>
    <q-stepper-navigation align="center">
        <q-btn
            color="primary"
            label="Submit"
            icon="mdi-arrow-right-bold"
            @click="preparePayloads"
        />
    </q-stepper-navigation>
</template>

<script lang="ts">
import { usePayloadStore } from 'src/stores';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'CreatePayloadStep3',
    setup() {
        const payloadStore = usePayloadStore();

        return {
            payloadStore,
        };
    },
    methods: {
        async preparePayloads() {
            await this.payloadStore.processPayloads();
        },
    },
});
</script>
