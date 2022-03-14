<template>
    <q-form class="form-container row items-center justify-center" @submit="login">
        <div class="form">
            <div class="q-pa-sm q-ma-sm">
                <q-input
                    outlined
                    type="email"
                    v-model="loginPayload.email"
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
            <div class="q-pa-sm q-ma-sm">
                <q-input
                    outlined
                    type="password"
                    v-model="loginPayload.password"
                    label="Password"
                    lazy-rules
                    :rules="[
                        (value) => value.match(/.*[0-9].*/) || t('confirm.atLeastANumber'),
                        (value) => value.match(/(?=.*[A-Z])/) || t('confirm.atLeastAnUppercase'),
                        (value) => value.match(/(?=.*\W)/) || t('confirm.atLeastASymbol'),
                        (value) =>
                            (value.length >= 8 && value.length <= 20) ||
                            t('confirm.passwordBetweenMinAndMax'),
                    ]"
                >
                    <template v-slot:prepend>
                        <q-icon name="mdi-lock" />
                    </template>
                </q-input>
            </div>
            <q-card-section class="q-mt-md">
                <div class="row justify-center">
                    <q-btn
                        :loading="loading"
                        type="submit"
                        color="primary"
                        label="Login"
                        icon="mdi-login"
                    />
                </div>
            </q-card-section>
        </div>
    </q-form>
</template>

<script lang="ts">
import { AxiosError } from 'axios';
import { storeToRefs } from 'pinia';
import { loginUser } from 'src/service/service';
import { useUserStore } from 'src/stores/user';
import { useEmailValidation, useGlobalI18n } from 'src/utils/hooks';
import { defineComponent, ref } from 'vue';
import { DEFAULT_ROUTES } from 'src/utils/constants';

export default defineComponent({
    name: 'LoginForm',
    setup() {
        const userStore = useUserStore();
        const { t } = useGlobalI18n();
        const { validateEmail } = useEmailValidation();
        const { loginPayload, userDetails } = storeToRefs(userStore);
        return {
            loginPayload,
            loading: ref(false),
            userDetails,
            t,
            userStore,
            validateEmail,
        };
    },
    methods: {
        async login() {
            this.loading = true;
            await loginUser(this.loginPayload)
                .then(async (response) => {
                    this.userStore.$patch({
                        userDetails: {
                            id: response.data.id,
                            email: response.data.email,
                            role: response.data.role,
                            enabled2FA: response.data.shouldValidate2FA,
                        },
                        csrfToken: response.data.csrfToken,
                    });
                    if (response.data.shouldValidate2FA) {
                        this.userStore.$patch({
                            showInput2FATokenModal: true,
                        });
                    } else {
                        this.userStore.$patch({
                            isLoggedIn: true,
                        });
                        await this.$router.replace({ path: DEFAULT_ROUTES[this.userDetails.role] });
                    }
                })
                .catch((error: AxiosError) => {
                    if (error.response) {
                        switch (error.response.status) {
                            case 401: {
                                this.$q.notify({
                                    type: 'negative',
                                    message: this.t('login.accountNotFound'),
                                });
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
