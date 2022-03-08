<template>
    <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { getLoggedInSession } from 'src/service/service';
import { useUserStore } from './stores';
import { storeToRefs } from 'pinia';
import { DEFAULT_ROUTES } from './utils/constants';

export default defineComponent({
    name: 'App',
    setup() {
        const userStore = useUserStore();
        const { csrfToken, userDetails } = storeToRefs(userStore);

        return {
            userStore,
            csrfToken,
            userDetails,
        };
    },
    async created() {
        const sessionResponse = await getLoggedInSession();
        if (sessionResponse.data !== '') {
            this.userStore.$patch({
                userDetails: {
                    id: sessionResponse.data.id,
                    email: sessionResponse.data.email,
                    role: sessionResponse.data.role,
                },
                isLoggedIn: true,
                csrfToken: sessionResponse.data.csrfToken,
            });
            await this.$router.replace({ path: DEFAULT_ROUTES[this.userDetails.role] });
        }
    },
});
</script>
