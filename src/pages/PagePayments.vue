<template>
    <q-page class="column items-center justify-center">
        <q-card>
            <q-toolbar class="bg-primary text-white">
                <q-avatar>
                    <q-icon name="mdi-cash-multiple" color="accent" />
                </q-avatar>

                <q-toolbar-title>
                    <span class="text-weight-bold">Manage payments account</span>
                </q-toolbar-title>
            </q-toolbar>
            <q-card-actions class="q-pa-md" align="center">
                <q-btn
                    color="primary"
                    :icon="STRIPE_ICON_PATH"
                    label="Access"
                    :loading="loading"
                    @click="accessAccount"
                />
            </q-card-actions>
        </q-card>
    </q-page>
</template>

<script lang="ts">
import { getConnectedStripeAccountLink } from 'src/service/service';
import { STRIPE_ICON_PATH } from 'src/utils/constants';
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'PagePayments',
    setup() {
        const loading = ref(false);
        return {
            loading,
            STRIPE_ICON_PATH,
        };
    },
    methods: {
        async accessAccount() {
            this.loading = true;
            const response = await getConnectedStripeAccountLink();
            this.loading = false;

            console.log(response);

            window.location.href = response.data;
        },
    },
});
</script>
