<template>
    <div>
        <q-tabs
            v-model="currentPayloadTabName"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="left"
            narrow-indicator
        >
            <q-tab
                v-for="payloadTab in payloadTabs"
                :key="payloadTab.name"
                :name="payloadTab.name"
                :label="payloadTab.name"
            />
            <q-icon
                name="mdi-plus"
                size="md"
                class="accent-primary cursor-pointer"
                @click="addNewPayloadTab"
            />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="currentPayloadTabName" animated>
            <q-tab-panel
                v-for="payloadTab in payloadTabs"
                :key="payloadTab.name"
                :name="payloadTab.name"
            >
                <q-splitter v-model="splitTabRatio">
                    <template v-slot:before>
                        <q-table
                            class="dataset-table"
                            row-key="index"
                            style="height: 800px"
                            title="Dataset"
                            :rows="uploadedDataset.data"
                            :columns="columns"
                            color="accent"
                            virtual-scroll
                            :pagination="pagination"
                            :rows-per-page-options="[0]"
                            selection="multiple"
                            v-model:selected="payloadTab.state.selectedRows"
                        >
                        </q-table>
                    </template>

                    <template v-slot:after>
                        <div class="q-pa-md">
                            <q-toolbar class="bg-primary">
                                <q-toolbar-title class="text-center text-white">
                                    Operations
                                </q-toolbar-title>
                            </q-toolbar>

                            <div class="q-mt-md column items-center">
                                <q-btn
                                    color="primary"
                                    icon="mdi-plus"
                                    @click="openAddOperationModal"
                                    >Add operation</q-btn
                                >
                            </div>
                        </div>
                    </template>
                </q-splitter>
            </q-tab-panel>
        </q-tab-panels>
    </div>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { QTableProps } from 'quasar';
import { usePayloadStore } from 'src/stores';
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'CreatePayloadStep1',
    setup() {
        const payloadStore = usePayloadStore();
        const { uploadedDataset, payloadTabs, currentPayloadTabName } = storeToRefs(payloadStore);

        return {
            uploadedDataset,
            pagination: ref({
                rowsPerPage: 1000,
            }),
            payloadStore,
            payloadTabs,
            currentPayloadTabName,
            splitTabRatio: ref(80),
        };
    },
    computed: {
        columns(): QTableProps['columns'] {
            return this.uploadedDataset.headers.map((header, index) => {
                return {
                    name: header,
                    label: header,
                    field: (row: unknown[]) => row[index],
                };
            });
        },
    },
    methods: {
        addNewPayloadTab() {
            this.payloadStore.$patch((state) => {
                state.payloadTabs.push({
                    name: `Payload ${this.payloadTabs.length + 1}`,
                    state: {
                        selectedRows: [],
                    },
                });
            });
        },
        openAddOperationModal() {
            this.payloadStore.$patch({
                showAddOperationModal: true,
            });
        },
    },
});
</script>

<style scoped lang="scss">
.dataset-table {
    width: 100%;
    height: 100%;
}
</style>
