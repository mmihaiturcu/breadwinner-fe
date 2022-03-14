<template>
    <q-page class="column items-center justify-center">
        <q-card v-if="userDetails.enabled2FA">
            <q-toolbar class="bg-primary text-white">
                <q-avatar>
                    <q-icon name="mdi-shield" color="accent" />
                </q-avatar>

                <q-toolbar-title>
                    <span class="text-weight-bold">Two factor authentication is enabled</span>
                </q-toolbar-title>
            </q-toolbar>
            <q-card-actions class="q-pa-md" align="center">
                <q-btn
                    color="negative"
                    icon="mdi-close-thick"
                    label="Disable 2FA"
                    :loading="loading"
                    @click="disable2FA"
                />
            </q-card-actions>
        </q-card>
        <q-stepper v-else v-model="currentEnable2FAStep" color="primary" animated>
            <q-step
                :name="1"
                title="Request 2FA activation"
                icon="mdi-account-plus"
                active-icon="mdi-account-plus"
                :done="currentEnable2FAStep > 1"
            >
                <Enable2FAStep1 />
            </q-step>

            <q-step
                :name="2"
                title="Provide first 2FA token"
                icon="mdi-two-factor-authentication"
                active-icon="mdi-two-factor-authentication"
                :done="currentEnable2FAStep > 2"
            >
                <Enable2FAStep2 />
            </q-step>
        </q-stepper>
    </q-page>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { disable2FA } from 'src/service/service';
import { useUserStore } from 'src/stores';
import { defineComponent, ref } from 'vue';
import Enable2FAStep1 from 'src/components/dashboard/two-factor-authentication/Enable2FAStep1.vue';
import Enable2FAStep2 from 'src/components/dashboard/two-factor-authentication/Enable2FAStep2.vue';

export default defineComponent({
    name: 'Page2FA',
    components: { Enable2FAStep1, Enable2FAStep2 },
    setup() {
        const userStore = useUserStore();
        const { userDetails, currentEnable2FAStep } = storeToRefs(userStore);
        const loading = ref(false);
        return {
            userDetails,
            loading,
            userStore,
            currentEnable2FAStep,
        };
    },
    methods: {
        async disable2FA() {
            await disable2FA().then(() => {
                this.userDetails.enabled2FA = false;
            });
        },
    },
});
</script>
