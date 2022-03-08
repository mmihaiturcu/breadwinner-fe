<template>
    <q-form class="form-container row items-center justify-center" @submit="register">
        <div>
            <div class="q-pa-sm q-ma-sm">
                <div class="text-h6 text-primary text-center text-bold">I am a</div>
                <q-btn-toggle
                    push
                    toggle-color="primary"
                    v-model="registerPayload.userRole"
                    :options="[
                        {
                            value: Role.DATA_SUPPLIER,
                            slot: 'data-supplier',
                            icon: 'mdi-database-arrow-up',
                            label: 'Data supplier',
                        },
                        {
                            value: Role.DATA_PROCESSOR,
                            slot: 'data-processor',
                            icon: 'mdi-cog-transfer',
                            label: 'Data processor',
                        },
                    ]"
                />
            </div>

            <q-separator />

            <div class="q-pa-sm q-ma-sm">
                <q-input
                    outlined
                    type="email"
                    v-model="registerPayload.email"
                    label="Email"
                    autocomplete="username"
                    lazy-rules
                    :rules="[(value) => validateEmail(value) || t('register.invalidEmail')]"
                >
                    <template v-slot:prepend>
                        <q-icon name="mdi-email" />
                    </template>
                </q-input>
            </div>
            <q-card-section class="q-mt-md">
                <div class="row justify-center">
                    <q-btn
                        :loading="loading"
                        type="submit"
                        color="primary"
                        label="Register"
                        icon="mdi-account-plus"
                        autocomplete="current-password"
                    />
                </div>
            </q-card-section>
        </div>
    </q-form>
</template>

<script lang="ts">
import { AxiosError } from 'axios';
import { storeToRefs } from 'pinia';
import { registerAccount } from 'src/service/service';
import { useUserStore } from 'src/stores/user';
import { Role } from 'src/types/enums';
import { useEmailValidation, useGlobalI18n } from 'src/utils/hooks';
import { ref, defineComponent } from 'vue';

export default defineComponent({
    name: 'RegisterForm',
    setup() {
        const userStore = useUserStore();

        const { registerPayload, currentActiveAuthenticationComponent } = storeToRefs(userStore);
        const { t } = useGlobalI18n();
        const { validateEmail } = useEmailValidation();

        return {
            Role,
            registerPayload,
            currentActiveAuthenticationComponent,
            loading: ref(false),
            t,
            validateEmail,
            userStore,
        };
    },
    methods: {
        async register() {
            this.loading = true;
            // call login endpoint
            await registerAccount(this.registerPayload)
                .then(() => {
                    this.$q.notify({
                        type: 'positive',
                        message: this.t('register.success'),
                    });
                    this.currentActiveAuthenticationComponent = 'LoginForm';
                })
                .catch((error: AxiosError) => {
                    if (error.response) {
                        switch (error.response.status) {
                            case 409: {
                                this.$q.notify({
                                    type: 'negative',
                                    message: this.t('register.userAlreadyExists'),
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
.form-container {
    width: 100%;
    height: 100%;
}
.form {
    width: 100%;
}
</style>
