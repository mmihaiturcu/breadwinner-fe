<template>
    <q-card class="finish-account-card q-pa-md">
        <q-form
            class="form-container row items-center justify-center"
            @submit="submitFinishAccount"
        >
            <div class="form">
                <div class="q-pa-sm q-ma-sm">
                    <q-input
                        outlined
                        type="password"
                        v-model="passwordPayload.password"
                        label="Password"
                        lazy-rules
                        :rules="[
                            (value) => value.match(/.*[0-9].*/) || t('confirm.atLeastANumber'),
                            (value) =>
                                value.match(/(?=.*[A-Z])/) || t('confirm.atLeastAnUppercase'),
                            (value) => value.match(/(?=.*\W)/) || t('confirm.atLeastASymbol'),
                            (value) =>
                                (value.length >= 8 && value.length <= 20) ||
                                t('confirm.passwordBetweenMinAndMax'),
                        ]"
                    >
                        <template v-slot:prepend>
                            <q-icon name="mdi-lock-open" />
                        </template>
                    </q-input>
                </div>
                <div class="q-pa-sm q-ma-sm">
                    <q-input
                        outlined
                        type="password"
                        v-model="passwordPayload.repeatedPassword"
                        label="Confirm password"
                        lazy-rules
                        :rules="[
                            (value) => value.match(/.*[0-9].*/) || t('confirm.atLeastANumber'),
                            (value) =>
                                value.match(/(?=.*[A-Z])/) || t('confirm.atLeastAnUppercase'),
                            (value) => value.match(/(?=.*\W)/) || t('confirm.atLeastASymbol'),
                            (value) =>
                                (value.length >= 8 && value.length <= 20) ||
                                t('confirm.passwordBetweenMinAndMax'),
                            (value) =>
                                value === passwordPayload.password ||
                                t('confirm.passwordsIdentical'),
                        ]"
                    >
                        <template v-slot:prepend>
                            <q-icon name="mdi-lock-open-check" />
                        </template>
                    </q-input>
                </div>
                <q-card-section class="q-mt-md">
                    <div class="row justify-center">
                        <q-btn
                            :loading="loading"
                            type="submit"
                            color="primary"
                            label="Confirm"
                            icon="mdi-account-lock"
                        />
                    </div>
                </q-card-section>
            </div>
        </q-form>
    </q-card>
</template>

<script lang="ts">
import { AxiosError } from 'axios';
import { checkAccountConfirmationValid, finishAccount } from 'src/service/service';
import { useGlobalI18n } from 'src/utils/hooks';
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
    name: 'FinishAccountForm',
    setup() {
        const route = useRoute();
        const { t } = useGlobalI18n();

        return {
            t,
            loading: ref(false),
            passwordPayload: ref({
                password: '',
                repeatedPassword: '',
            }),
            confirmationUUID: route.query.uuid as string,
        };
    },
    methods: {
        async submitFinishAccount() {
            this.loading = true;
            await finishAccount({
                password: this.passwordPayload.password,
                confirmationUuid: this.confirmationUUID,
            })
                .then(async () => {
                    this.$q.notify({
                        type: 'positive',
                        message: this.t('confirm.success'),
                    });
                    await this.$router.replace({ path: '/login' });
                })
                .catch((error: AxiosError) => {
                    if (error.response) {
                        switch (error.response.status) {
                            case 404: {
                                this.$q.notify({
                                    type: 'negative',
                                    message: this.t('confirm.noUserFound'),
                                });
                                break;
                            }
                        }
                    }
                })
                .finally(() => (this.loading = false));
        },
    },
    beforeCreate() {
        checkAccountConfirmationValid({ uuid: this.confirmationUUID }).catch(
            async (error: AxiosError) => {
                if (error.response) {
                    switch (error.response.status) {
                        case 404:
                            this.$q.notify({
                                type: 'negative',
                                message: this.t('confirm.invalidLink'),
                            });
                            break;
                        case 409:
                            this.$q.notify({
                                type: 'negative',
                                message: this.t('confirm.alreadyUsedLink'),
                            });
                            break;
                        case 410:
                            this.$q.notify({
                                type: 'negative',
                                message: this.t('confirm.expiredLink'),
                            });
                            break;
                    }
                    await this.$router.replace({ path: '/login' });
                }
            }
        );
    },
});
</script>

<style scoped lang="scss">
.finish-account-card {
    width: 300px;
}
</style>
