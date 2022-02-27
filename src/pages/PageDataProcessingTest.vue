<template>
    <q-page class="column q-pa-md">
        <q-input type="text" placeholder="API Key" v-model="testAPIKey" />
        <q-btn
            :disable="!testAPIKey"
            icon="mdi-connection"
            color="primary"
            label="Connect to server"
            @click="connectToServer"
        />
    </q-page>
</template>

<script lang="ts">
import { PayloadToProcess } from 'src/types/models';
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'PageApiKeys',
    setup() {
        const testAPIKey = ref('');

        return {
            testAPIKey,
        };
    },
    methods: {
        connectToServer() {
            const ws = new WebSocket(process.env.BACKEND_WSS_URL, this.testAPIKey);
            ws.onerror = () => {
                this.$q.notify({
                    type: 'negative',
                    message:
                        'WSS connection could not be established. Please supply a valid API key.',
                });
            };
            ws.onopen = () => {
                this.$q.notify({
                    type: 'positive',
                    message: 'WSS connection established!',
                });

                // request chunk, TODO: process
                ws.send('blabla');
            };
            ws.onmessage = (event: MessageEvent<string>) => {
                const payload = JSON.parse(event.data) as PayloadToProcess;
                console.log('Received payload to process', payload);
            };
            ws.onclose = () => {
                console.log('closed');
            };
        },
    },
});
</script>
