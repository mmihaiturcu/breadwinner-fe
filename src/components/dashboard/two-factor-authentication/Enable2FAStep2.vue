<template>
    <q-form @submit="activate2FA">
        <q-img :src="trialQRCodeDataURI" :ratio="1" />
        <q-card-section>
            <q-item>
                <q-item-section avatar>
                    <q-icon name="mdi-two-factor-authentication" color="primary" />
                </q-item-section>

                <q-item-section>
                    <q-input
                        type="text"
                        label="Token"
                        :rules="[validate2FAToken]"
                        v-model="trial2FAToken"
                    />
                </q-item-section>
                <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                    <div class="token-disclaimer">
                        Please scan the QR code above into any authenticator application and provide
                        a resulting token.
                    </div>
                </q-tooltip>
            </q-item>
        </q-card-section>

        <q-card-actions align="center">
            <q-btn
                type="submit"
                color="primary"
                icon="mdi-two-factor-authentication"
                label="Activate 2FA"
                :loading="loading"
            />
        </q-card-actions>
    </q-form>
</template>

<script lang="ts">
import { AxiosError } from 'axios';
import { storeToRefs } from 'pinia';
import { enable2FA } from 'src/service/service';
import { useUserStore } from 'src/stores';
import { use2FATokenValidation } from 'src/utils/hooks';
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'Enable2FAStep2',
    setup() {
        const userStore = useUserStore();
        const { trialQRCodeDataURI, trial2FAToken, trial2FASecret } = storeToRefs(userStore);
        const { validate2FAToken } = use2FATokenValidation();
        const loading = ref(false);

        return {
            trialQRCodeDataURI,
            trial2FASecret,
            trial2FAToken,
            userStore,
            loading,
            validate2FAToken,
        };
    },
    methods: {
        async activate2FA() {
            this.loading = true;

            await enable2FA({
                secret: this.trial2FASecret,
                token: this.trial2FAToken,
            })
                .then(() => {
                    this.$q.notify({
                        type: 'positive',
                        message: 'Two factor authentication has been successfully enabled!',
                    });
                    this.userStore.$patch((state) => {
                        state.userDetails.enabled2FA = true;
                        state.trial2FASecret = '';
                        state.trial2FAToken = '';
                        state.currentEnable2FAStep = 1;
                    });
                })
                .catch((error: AxiosError) => {
                    if (error.response) {
                        switch (error.response.status) {
                            case 400: {
                                this.$q.notify({
                                    type: 'negative',
                                    message: 'The provided 2FA token is invalid. Please try again.',
                                });
                                break;
                            }
                        }
                    }
                })
                .finally(() => (this.loading = false));
        },
    },
});
</script>

<style scoped lang="scss">
.token-disclaimer {
    font-size: 16px;
}
</style>
