<template>
    <div class="column justify-center">
        <q-btn
            color="primary"
            icon="mdi-two-factor-authentication"
            label="Request 2FA activation"
            :loading="loading"
            @click="request2FAActivation"
        />
    </div>
</template>

<script lang="ts">
import { getTrialQRCodeSecret } from 'src/service/service';
import { useUserStore } from 'src/stores';
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'Enable2FAStep1',
    setup() {
        const userStore = useUserStore();
        const loading = ref(false);

        return {
            userStore,
            loading,
        };
    },
    methods: {
        async request2FAActivation() {
            this.loading = true;
            const response = await getTrialQRCodeSecret().finally(() => {
                this.loading = false;
            });
            this.userStore.$patch({
                trialQRCodeDataURI: response.data.qrCodeDataURI,
                trial2FASecret: response.data.secret,
                currentEnable2FAStep: 2,
            });
        },
    },
});
</script>
