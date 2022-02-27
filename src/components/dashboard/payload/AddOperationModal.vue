<template>
    <q-dialog v-model="showAddOperationModal" persistent>
        <q-card class="add-operation-modal-card-container">
            <q-card-section>
                <div class="text-h6">Add operation</div>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <q-select
                    class="header-select"
                    name="operation"
                    label="Operation"
                    :options="OPERATIONS"
                    :model-value="operation.operationObject"
                    @update:model-value="changeOperation"
                >
                    <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps">
                            <q-item-section avatar>
                                <q-icon :name="scope.opt.icon" />
                            </q-item-section>
                            <q-item-section>
                                <q-item-label>{{ scope.opt.label }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </template>
                </q-select>

                <template v-if="operation.operationObject">
                    <div
                        v-for="(operand, index) in operation.operands"
                        :key="index"
                        class="operand-container"
                    >
                        <q-select
                            :name="`select-operand-${index}`"
                            v-model="operation.operands[index]"
                            :options="availableOperands"
                            :label="`Operand ${index + 1}`"
                        >
                            <template v-slot:option="scope">
                                <q-item v-bind="scope.itemProps">
                                    <q-item-section avatar>
                                        <q-icon :name="scope.opt.icon" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </template>
                        </q-select>
                        <q-btn
                            v-if="canRemoveOperands && index === operation.operands.length - 1"
                            icon="mdi-delete"
                            color="primary"
                            @click="removeOperand(index)"
                        />
                    </div>

                    <q-btn
                        v-if="operation.operands.length < operation.operationObject.maxOperands"
                        class="q-mt-md"
                        color="primary"
                        icon="mdi-plus"
                        label="Add operand"
                        @click="addOperand"
                    />
                </template>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn
                    type="submit"
                    label="Add"
                    color="primary"
                    icon="mdi-plus"
                    :disable="!canAddOperation"
                    @click="addOperation"
                />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { usePayloadStore } from 'src/stores';
import { defineComponent, ref } from 'vue';
import { OPERATIONS } from 'src/utils/constants';
import { QSelectProps } from 'quasar';
import { Operation } from 'src/types/models';

export default defineComponent({
    name: 'AddOperationModal',
    setup() {
        const payloadStore = usePayloadStore();

        const { showAddOperationModal, currentPayloadTab } = storeToRefs(payloadStore);

        return {
            showAddOperationModal,
            OPERATIONS,
            operation: ref({
                operationObject: null as null | Operation,
                operands: [null],
            }),
            currentPayloadTab,
        };
    },
    computed: {
        availableOperands(): QSelectProps['options'] {
            return [
                {
                    label: this.currentPayloadTab.state.selectedHeader!.label,
                    value: 'data',
                    icon: 'mdi-numeric',
                },
                ...this.currentPayloadTab.state.operations.map((operation, index) => ({
                    label: `Operation ${index + 1} result`,
                    value: index,
                    icon: 'mdi-numeric',
                })),
            ];
        },
        canAddOperation(): boolean {
            return (
                this.operation.operationObject != null &&
                this.operation.operands.every((operand) => operand != null)
            );
        },
        canRemoveOperands(): boolean {
            return this.operation.operationObject
                ? this.operation.operands.length > this.operation.operationObject.minOperands &&
                      this.operation.operationObject.minOperands !==
                          this.operation.operationObject.maxOperands
                : false;
        },
    },
    methods: {
        changeOperation(newOperation: Operation) {
            this.operation.operationObject = newOperation;
            this.operation.operands = new Array(newOperation.minOperands).fill(null);
        },
        addOperand() {
            this.operation.operands.push(null);
        },
        removeOperand(index: number) {
            this.operation.operands.splice(index, 1);
        },
        addOperation() {
            this.currentPayloadTab.state.operations.push(
                JSON.parse(JSON.stringify(this.operation))
            );
            this.showAddOperationModal = false;
        },
    },
});
</script>

<style scoped lang="scss">
.add-operation-modal-card-container {
    width: 500px;
}

.operand-container {
    display: grid;
    grid-template-columns: 1fr 30px;
    justify-content: center;
    align-items: center;
    gap: 10px;
}
</style>
