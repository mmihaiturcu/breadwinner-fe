<template>
    <q-dialog v-model="showCreatePayloadModal" persistent>
        <q-card class="create-payload-stepper-container">
            <q-toolbar class="bg-primary text-white">
                <q-avatar>
                    <q-icon name="mdi-cog" color="accent" />
                </q-avatar>

                <q-toolbar-title>
                    <span class="text-weight-bold">Data payload creation</span>
                </q-toolbar-title>
            </q-toolbar>

            <q-separator />

            <div>
                <q-stepper v-model="currentPayloadCreationStep" color="primary" animated>
                    <q-step
                        :name="1"
                        title="Upload dataset"
                        icon="mdi-cloud-upload"
                        active-icon="mdi-cloud-upload"
                        :done="currentPayloadCreationStep > 1"
                    >
                        <CreatePayloadStep1 />
                    </q-step>

                    <q-step
                        :name="2"
                        title="Create payloads & operations"
                        icon="mdi-table-cog"
                        active-icon="mdi-table-cog"
                        :done="currentPayloadCreationStep > 2"
                    >
                        <CreatePayloadStep2 />
                    </q-step>

                    <q-step
                        :name="3"
                        title="Confirm payloads"
                        icon="mdi-help-rhombus"
                        active-icon="mdi-help-rhombus"
                        :done="currentPayloadCreationStep > 3"
                    >
                        <CreatePayloadStep3 />
                    </q-step>
                    <q-step
                        :name="4"
                        title="Pay"
                        icon="mdi-cash"
                        active-icon="mdi-cash"
                        :done="currentPayloadCreationStep > 4"
                    >
                        <CreatePayloadStep4 />
                    </q-step>
                </q-stepper>
                <AddOperationModal v-if="showAddOperationModal" />
            </div>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { usePayloadStore } from 'src/stores';
import { useGlobalI18n } from 'src/utils/hooks';
import { defineComponent } from 'vue';
import CreatePayloadStep1 from './CreatePayloadStep1.vue';
import CreatePayloadStep2 from './CreatePayloadStep2.vue';
import CreatePayloadStep3 from './CreatePayloadStep3.vue';
import CreatePayloadStep4 from './CreatePayloadStep4.vue';
import AddOperationModal from './AddOperationModal.vue';
import { getCheckoutLink } from 'src/service/service';

export default defineComponent({
    name: 'CreateApiKeyModal',
    components: {
        CreatePayloadStep1,
        CreatePayloadStep2,
        CreatePayloadStep3,
        CreatePayloadStep4,
        AddOperationModal,
    },
    setup() {
        const payloadStore = usePayloadStore();
        const { showCreatePayloadModal, currentPayloadCreationStep, showAddOperationModal } =
            storeToRefs(payloadStore);
        const { t } = useGlobalI18n();

        return {
            showCreatePayloadModal,
            currentPayloadCreationStep,
            t,
            showAddOperationModal,
            payloadStore,
        };
    },
    async created() {
        const response = await getCheckoutLink();
        if (response.data) {
            this.payloadStore.$patch({
                currentPayloadCreationStep: 4,
                checkoutURL: response.data,
            });
        }
    },
});
</script>

<style scoped lang="scss">
$dialog-width: 1200px;
$dialog-height: 1000px;

.create-payload-stepper-container {
    width: clamp(100vw, 100vw, #{$dialog-width});
    max-width: $dialog-width;
    // height: $dialog-height;
    // max-height: $dialog-height;
}
</style>
