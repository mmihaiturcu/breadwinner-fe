<template>
    <q-page class="column q-pa-md">
        <q-table title="API Keys" :rows="apiKeys" :columns="columns" row-key="id" color="accent">
            <template v-slot:top>
                <q-btn
                    icon="mdi-key-plus"
                    color="primary"
                    label="Create"
                    @click="openCreateApiKeyModal"
                />
            </template>
        </q-table>
        <CreateApiKeyModal v-if="showCreateApiKeyModal" />
    </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CreateApiKeyModal from 'src/components/dashboard/api-key/CreateApiKeyModal.vue';
import { useApiKeyStore, useUserStore } from 'src/stores';
import { storeToRefs } from 'pinia';

export default defineComponent({
    name: 'PageApiKeys',
    components: { CreateApiKeyModal },
    setup() {
        const apiKeyStore = useApiKeyStore();
        const userStore = useUserStore();
        const { showCreateApiKeyModal, apiKeys } = storeToRefs(apiKeyStore);
        const { userDetails } = storeToRefs(userStore);

        return {
            apiKeys,
            showCreateApiKeyModal,
            userDetails,
            apiKeyStore,
        };
    },
    computed: {
        columns() {
            return [
                { name: 'prefix', label: 'Prefix', field: 'prefix', sortable: true },
                { name: 'hostname', label: 'Hostname', field: 'hostname', sortable: true },
                { name: 'createdAt', label: 'Created at', field: 'createdAt', sortable: true },
            ];
        },
    },
    methods: {
        openCreateApiKeyModal() {
            this.showCreateApiKeyModal = true;
        },
    },
    async mounted() {
        await this.apiKeyStore.refreshApiKeys(this.userDetails.id);
    },
});
</script>
