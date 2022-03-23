<template>
    <q-page class="column q-pa-md flex-center">
        <q-card>
            <q-card-section>
                <q-input type="text" placeholder="API Key" v-model="testAPIKey" />
            </q-card-section>
            <q-card-actions>
                <q-btn
                    :disable="!testAPIKey"
                    icon="mdi-connection"
                    color="primary"
                    label="Initialize Breadwinner module"
                    @click="initializeModule"
                />
            </q-card-actions>
        </q-card>
    </q-page>
</template>

<script lang="ts">
import { BreadwinnerModule } from 'breadwinner';
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'PageDataProcessingTest',
    setup() {
        const testAPIKey = ref('');

        return {
            testAPIKey,
        };
    },
    methods: {
        initializeModule() {
            BreadwinnerModule.init(this.testAPIKey);
        },
    },
    beforeRouteLeave() {
        BreadwinnerModule.disconnect();
    },
});
</script>
