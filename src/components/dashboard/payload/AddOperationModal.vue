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
                        :class="{ plaintext: operand?.isPlaintext }"
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

                        <q-input
                            v-if="operand?.isPlaintext"
                            type="number"
                            v-model.number="operand.plaintextValue"
                        />

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
                <q-btn flat v-close-popup label="Cancel" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { usePayloadStore } from 'src/stores';
import { defineComponent, ref } from 'vue';
import { OPERATIONS } from 'src/utils/constants';
import { OperandOption, Operation, ResultType } from 'src/types/models';
import { OperandTypes, OperationType } from 'src/types/enums';

export default defineComponent({
    name: 'AddOperationModal',
    setup() {
        const payloadStore = usePayloadStore();

        const { showAddOperationModal, currentPayloadTab, numericHeaders } =
            storeToRefs(payloadStore);

        return {
            showAddOperationModal,
            OPERATIONS,
            operation: ref({
                operationObject: null as null | Operation,
                operands: [null] as (null | OperandOption)[],
                resultType: null as null | OperandTypes,
            }),
            currentPayloadTab,
            numericHeaders,
            availableOperands: [] as OperandOption[],
        };
    },
    computed: {
        operationSpecificConditions(): boolean {
            switch (this.operation.operationObject?.type) {
                case OperationType.EXPONENTIATION:
                    return (
                        this.operation.operands.length === 2 &&
                        this.operation.operands[1]!.isRaw === true
                    );
                case OperationType.DIVIDE:
                    return (
                        this.operation.operands.length === 2 &&
                        this.operation.operands[1]!.isPlaintext === true
                    );
                default:
                    return true;
            }
        },
        canAddOperation(): boolean {
            return (
                this.operation.operationObject != null &&
                this.operation.operands.every(
                    (operand) =>
                        operand !== null && (!operand.isPlaintext || operand.plaintextValue !== '')
                ) &&
                this.parsedOperationResultType !== null &&
                this.parsedOperationResultType !== undefined &&
                !this.operation.operands.every((operand) => operand!.isPlaintext)
            );
        },
        canRemoveOperands(): boolean {
            return this.operation.operationObject
                ? this.operation.operands.length > this.operation.operationObject.minOperands &&
                      this.operation.operationObject.minOperands !==
                          this.operation.operationObject.maxOperands
                : false;
        },
        parsedOperationResultType(): OperandTypes | null {
            // Extract the type of each operand.
            const operandTypes = this.operation.operands.map((operand) => operand!.type);

            // Prepare to walk the "operation result type" tree, in order to find out the operation's result type.
            let operationResultType = this.operation.operationObject!.resultTypes as
                | OperandTypes
                | ResultType
                | null;

            for (const operandType of operandTypes) {
                operationResultType = (operationResultType as ResultType)[operandType];
            }

            // Special case that checks if the "operation result type" tree was not parsed completely (this happens when the number of operands is < maxOperands)
            if (operationResultType && typeof operationResultType === 'object') {
                operationResultType = operationResultType[OperandTypes.NONE];
            }
            console.log('Parsed result', operationResultType);
            return operationResultType as OperandTypes | null;
        },
    },
    methods: {
        setAvailableOperands() {
            this.availableOperands = [
                ...this.numericHeaders.map((header) => ({
                    label: header.label,
                    value: `d${header.value}`,
                    icon: 'mdi-numeric',
                    type: OperandTypes.ARRAY,
                    columnIndex: header.value,
                })),
                ...this.currentPayloadTab.state.operations.map((operation, index) => ({
                    label: `Operation ${index + 1} result`,
                    value: index,
                    icon: 'mdi-numeric',
                    type: operation.resultType,
                })),
                {
                    label: 'Plaintext number',
                    value: `p${this.currentPayloadTab.state.operations.length}`,
                    icon: 'mdi-numeric',
                    type: OperandTypes.NUMBER,
                    isPlaintext: true,
                    isRaw: this.operation.operationObject?.type === OperationType.EXPONENTIATION,
                    plaintextValue: '',
                },
            ];
        },
        changeOperation(newOperation: Operation) {
            this.operation.operationObject = newOperation;
            this.operation.operands = new Array(newOperation.minOperands).fill(null);
            this.setAvailableOperands();
        },
        addOperand() {
            this.operation.operands.push(null);
        },
        removeOperand(index: number) {
            this.operation.operands.splice(index, 1);
        },
        addOperation() {
            // After the tree walk, operationResultType holds the type of the operation's result.
            this.operation.resultType = this.parsedOperationResultType;

            this.currentPayloadTab.state.operations.push(
                JSON.parse(JSON.stringify(this.operation))
            );
            console.log('Added new operation', JSON.parse(JSON.stringify(this.operation)));
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

    &.plaintext {
        grid-template-columns: 1fr 100px 30px;
    }
}
</style>
