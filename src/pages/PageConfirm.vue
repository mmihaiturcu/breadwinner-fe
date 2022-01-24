<template>
    <q-page class="column items-center justify-center">
        <FinishAccountForm />
    </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FinishAccountForm from 'src/components/FinishAccountForm.vue';

export default defineComponent({
    name: 'PageConfirm',
    components: {
        FinishAccountForm,
    },
});
</script>
