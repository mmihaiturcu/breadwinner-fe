<template>
    <q-stepper-navigation class="row flex-center navigation" align="center">
        <q-btn
            color="primary"
            label="Pay"
            :icon="STRIPE_ICON_PATH"
            :loading="loading"
            :href="checkoutURL"
        />
    </q-stepper-navigation>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { getCheckoutLink } from 'src/service/service';
import { usePayloadStore } from 'src/stores';
import { STRIPE_ICON_PATH } from 'src/utils/constants';
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'CreatePayloadStep4',
    setup() {
        const payloadStore = usePayloadStore();
        const { currentPayloadCreationStep, checkoutURL } = storeToRefs(payloadStore);
        const loading = ref(false);

        return {
            STRIPE_ICON_PATH,
            loading,
            currentPayloadCreationStep,
            checkoutURL,
        };
    },
    methods: {
        async proceedToPaymentGateway() {
            this.loading = true;
            const response = await getCheckoutLink();
            this.loading = false;
            window.location.href = response.data;
        },
    },
});
</script>
