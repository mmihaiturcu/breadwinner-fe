<template>
    <q-layout class="login-layout" view="lHh Lpr lFf">
        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'LoginLayout',
});
</script>

<style scoped lang="scss">
.login-layout {
    background-color: #13001c;
}
</style>
