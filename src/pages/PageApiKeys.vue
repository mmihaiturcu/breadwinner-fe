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
            <template #body-cell-actions="props">
                <q-td :props="props">
                    <div class="column justify-center items-center">
                        <q-icon
                            size="md"
                            class="hover-accent cursor-pointer"
                            name="mdi-delete"
                            @click="deleteAPIKey(props.row.id)"
                        >
                            <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                                Delete API Key
                            </q-tooltip>
                        </q-icon>
                    </div>
                </q-td>
            </template>
            <template #body-cell-createdAt="props">
                <q-td :props="props">
                    {{ formatDateSimple(props.value) }}
                </q-td>
            </template>
        </q-table>
        <CreateApiKeyModal v-if="showCreateApiKeyModal" />
        <NewAPIKeyModal v-if="showReceiveAPIKeyModal" />
    </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CreateApiKeyModal from 'src/components/dashboard/api-key/CreateApiKeyModal.vue';
import NewAPIKeyModal from 'src/components/dashboard/api-key/NewAPIKeyModal.vue';
import { useApiKeyStore, useUserStore } from 'src/stores';
import { storeToRefs } from 'pinia';
import { APIKey } from 'src/types/models';
import { deleteAPIKey } from 'src/service/service';
import { AxiosError } from 'axios';
import { useGlobalI18n, useFormatting } from 'src/utils/hooks';

export default defineComponent({
    name: 'PageApiKeys',
    components: { CreateApiKeyModal, NewAPIKeyModal },
    setup() {
        const apiKeyStore = useApiKeyStore();
        const userStore = useUserStore();
        const { t } = useGlobalI18n();
        const { showCreateApiKeyModal, showReceiveAPIKeyModal, apiKeys } = storeToRefs(apiKeyStore);
        const { userDetails } = storeToRefs(userStore);
        const { formatDateSimple } = useFormatting();
        return {
            apiKeys,
            showCreateApiKeyModal,
            showReceiveAPIKeyModal,
            userDetails,
            apiKeyStore,
            t,
            formatDateSimple,
            columns: [
                { name: 'actions', label: 'Actions', field: '', sortable: false },
                { name: 'prefix', label: 'Prefix', field: 'prefix', sortable: true },
                { name: 'hostname', label: 'Hostname', field: 'hostname', sortable: true },
                { name: 'createdAt', label: 'Created at', field: 'createdAt', sortable: true },
            ],
        };
    },
    methods: {
        openCreateApiKeyModal() {
            this.showCreateApiKeyModal = true;
        },
        async deleteAPIKey(id: APIKey['id']) {
            this.$q.loading.show();

            await deleteAPIKey(id)
                .then(async () => {
                    this.$q.notify({
                        type: 'positive',
                        message: this.t('apiKeys.deletedSuccessfully'),
                    });
                    await this.apiKeyStore.refreshApiKeys();
                })
                .catch((error: AxiosError) => {
                    if (error.response) {
                        switch (error.response.status) {
                            case 404: {
                                this.$q.notify({
                                    type: 'negative',
                                    message: this.t('apiKeys.notFound'),
                                });
                                break;
                            }
                        }
                    }
                })
                .finally(() => this.$q.loading.hide());
        },
    },
    async mounted() {
        await this.apiKeyStore.refreshApiKeys();
    },
});
</script>
