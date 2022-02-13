<template>
    <q-card class="authentication-card q-pa-md q-pt-xl">
        <div class="authentication-type-toggle-container">
            <q-btn-toggle
                push
                toggle-color="primary"
                v-model="currentActiveAuthenticationComponent"
                :options="[
                    {
                        value: 'LoginForm',
                        slot: 'login-form',
                        icon: 'mdi-login',
                    },
                    {
                        value: 'RegisterForm',
                        slot: 'register-form',
                        icon: 'mdi-account-plus',
                    },
                ]"
            />
        </div>
        <transition
            mode="out-in"
            :enter-active-class="enterActiveClass"
            :leave-active-class="leaveActiveClass"
        >
            <component :is="currentActiveAuthenticationComponent" />
        </transition>
    </q-card>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from 'src/stores/user';
import { defineComponent } from 'vue';
import LoginForm from './LoginForm.vue';
import RegisterForm from './RegisterForm.vue';

export default defineComponent({
    name: 'AuthenticationForm',
    components: {
        LoginForm,
        RegisterForm,
    },
    setup() {
        const userStore = useUserStore();
        const { currentActiveAuthenticationComponent } = storeToRefs(userStore);
        return {
            currentActiveAuthenticationComponent,
        };
    },
    computed: {
        enterActiveClass(): string {
            return `animated ${
                this.currentActiveAuthenticationComponent === 'LoginForm'
                    ? 'slideInLeft'
                    : 'slideInRight'
            }`;
        },
        leaveActiveClass(): string {
            return `animated ${
                this.currentActiveAuthenticationComponent === 'LoginForm'
                    ? 'slideOutRight'
                    : 'slideOutLeft'
            }`;
        },
    },
});
</script>

<style scoped lang="scss">
$toggle-width: 40px;
.authentication-card {
    width: 400px;
    overflow: hidden;
    z-index: 1;

    .authentication-type-toggle-container {
        position: absolute;
        right: 10px;
        top: 10px;
    }
}
</style>
