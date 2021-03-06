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
                :label="payloadTab.label"
                @dblclick="onDoubleClickTab(payloadTab)"
            />
            <q-icon
                name="mdi-plus"
                size="md"
                class="hover-primary cursor-pointer"
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
                <q-splitter v-model="splitTabRatio" style="height: 800px">
                    <template v-slot:before>
                        <q-table
                            class="dataset-table"
                            row-key="index"
                            title="Dataset"
                            :rows="uploadedDataset.data"
                            :columns="columns"
                            color="accent"
                            virtual-scroll
                            :pagination="pagination"
                            :rows-per-page-options="[100, 1000]"
                        >
                        </q-table>
                    </template>

                    <template v-slot:after>
                        <div class="q-pa-md">
                            <q-toolbar class="q-mt-md bg-primary">
                                <q-toolbar-title class="text-center text-white">
                                    Operations
                                </q-toolbar-title>
                            </q-toolbar>

                            <div class="operations-container scroll">
                                <q-list bordered separator>
                                    <q-item
                                        v-for="(operation, index) in payloadTab.state.operations"
                                        :key="index"
                                    >
                                        <q-item-section avatar>
                                            <q-icon :name="operation.operationObject.icon" />
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label>{{
                                                operation.operands
                                                    .map((operand) =>
                                                        operand.isPlaintext
                                                            ? operand.plaintextValue
                                                            : operand.label
                                                    )
                                                    .join(', ')
                                            }}</q-item-label>
                                        </q-item-section>
                                        <q-item-section
                                            v-if="index === payloadTab.state.operations.length - 1"
                                            side
                                        >
                                            <q-icon
                                                class="hover-accent cursor-pointer"
                                                name="mdi-delete"
                                                @click="removeLatestOperation"
                                            />
                                        </q-item-section>
                                    </q-item>
                                </q-list>

                                <q-btn
                                    class="q-mt-md full-width"
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
        <q-stepper-navigation class="row flex-center navigation">
            <q-btn
                flat
                label="Back"
                icon="mdi-arrow-left-bold"
                @click="currentPayloadCreationStep -= 1"
            />
            <q-btn
                :disable="!canNavigateToStep3"
                color="primary"
                label="Next"
                icon="mdi-arrow-right-bold"
                @click="currentPayloadCreationStep += 1"
            />
        </q-stepper-navigation>
        <EditPayloadTabModal v-if="showEditPayloadTabModal" />
    </div>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { QSelectProps, QTableProps } from 'quasar';
import { usePayloadStore } from 'src/stores';
import { PayloadTab } from 'src/types/models/PayloadTab';
import { defineComponent, ref } from 'vue';
import EditPayloadTabModal from './EditPayloadTabModal.vue';

export default defineComponent({
    name: 'CreatePayloadStep1',
    setup() {
        const payloadStore = usePayloadStore();
        const {
            uploadedDataset,
            payloadTabs,
            currentPayloadTabName,
            currentPayloadTab,
            currentPayloadCreationStep,
            showEditPayloadTabModal,
        } = storeToRefs(payloadStore);
        return {
            uploadedDataset,
            pagination: ref({
                rowsPerPage: 1000,
            }),
            payloadStore,
            payloadTabs,
            currentPayloadTabName,
            splitTabRatio: ref(80),
            currentPayloadTab,
            currentPayloadCreationStep,
            showEditPayloadTabModal,
        };
    },
    computed: {
        columns(): QTableProps['columns'] {
            return this.uploadedDataset.headers.map((header, index) => {
                return {
                    name: header.label,
                    label: header.label,
                    field: (row: unknown[]) => row[index],
                };
            });
        },
        numericHeaderOptions(): QSelectProps['options'] {
            return this.payloadStore.numericHeaders.map((header) => ({
                label: header.label,
                value: header.value,
                icon: 'mdi-numeric',
            }));
        },
        canNavigateToStep3(): boolean {
            return (
                this.currentPayloadTab.state.operations.length > 0 &&
                this.payloadTabs.every((payloadTab) => payloadTab.state.operations.length > 0)
            );
        },
    },
    methods: {
        addNewPayloadTab() {
            this.payloadStore.$patch((state) => {
                state.payloadTabs.push({
                    name: `Payload ${this.payloadTabs.length + 1}`,
                    label: `Payload ${this.payloadTabs.length + 1}`,
                    state: {
                        operations: [],
                    },
                });
            });
        },
        openAddOperationModal() {
            this.payloadStore.$patch({
                showAddOperationModal: true,
            });
        },
        removeLatestOperation() {
            this.currentPayloadTab.state.operations.pop();
        },
        onDoubleClickTab(payloadTab: PayloadTab) {
            this.payloadStore.$patch((state) => {
                state.payloadTabToEdit = payloadTab;
                state.showEditPayloadTabModal = true;
            });
        },
    },
    components: { EditPayloadTabModal },
});
</script>

<style scoped lang="scss">
.dataset-table {
    width: 100%;
    height: 100%;
}

.header-select {
    width: 100%;
}

.operations-container {
    max-height: 100%;
}

.navigation {
    gap: 16px;
}
</style>
