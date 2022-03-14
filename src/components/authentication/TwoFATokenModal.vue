<template>
    <q-dialog class="2fa-token-modal" v-model="showInput2FATokenModal">
        <q-card>
            <q-toolbar class="bg-primary text-white">
                <q-avatar>
                    <q-icon name="mdi-two-factor-authentication" color="accent" />
                </q-avatar>

                <q-toolbar-title>
                    <span class="text-weight-bold">Please provide a 2FA token</span>
                </q-toolbar-title>
            </q-toolbar>
            <q-form @submit="submit2FAToken">
                <div class="q-pa-md">
                    <q-input
                        type="text"
                        label="2FA Token"
                        :rules="[validate2FAToken]"
                        v-model="twoFAToken"
                    />
                </div>
                <q-card-actions align="center">
                    <q-btn
                        type="submit"
                        label="Validate"
                        color="primary"
                        icon="mdi-two-factor-authentication"
                        :loading="loading"
                    />
                </q-card-actions>
            </q-form>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { AxiosError } from 'axios';
import { storeToRefs } from 'pinia';
import { validate2FAToken } from 'src/service/service';
import { useUserStore } from 'src/stores';
import { DEFAULT_ROUTES } from 'src/utils/constants';
import { use2FATokenValidation } from 'src/utils/hooks';
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: '2FATokenModal',
    setup() {
        const userStore = useUserStore();
        const { showInput2FATokenModal, twoFAToken, userDetails } = storeToRefs(userStore);
        const { validate2FAToken } = use2FATokenValidation();
        const loading = ref(false);

        return {
            showInput2FATokenModal,
            twoFAToken,
            loading,
            userDetails,
            userStore,
            validate2FAToken,
        };
    },
    methods: {
        async submit2FAToken() {
            await validate2FAToken({ token: this.twoFAToken })
                .then(async () => {
                    this.userStore.$patch({
                        isLoggedIn: true,
                        showInput2FATokenModal: false,
                    });
                    await this.$router.replace({ path: DEFAULT_ROUTES[this.userDetails.role] });
                })
                .catch((error: AxiosError) => {
                    if (error.response) {
                        switch (error.response.status) {
                            case 401:
                                this.$q.notify({
                                    type: 'negative',
                                    message:
                                        'The provided two factor authentication code is invalid. Please try again.',
                                });
                                break;
                        }
                    }
                })
                .finally(() => (this.loading = false));
        },
    },
});
</script>
