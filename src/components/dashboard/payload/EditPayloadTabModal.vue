<template>
    <q-dialog v-model="showEditPayloadTabModal" persistent>
        <q-card class="receive-key-pair-modal-card-container">
            <q-toolbar class="bg-primary text-white">
                <q-avatar>
                    <q-icon name="mdi-label" color="accent" />
                </q-avatar>

                <q-toolbar-title>
                    <span class="text-weight-bold">Edit payload label</span>
                </q-toolbar-title>
            </q-toolbar>

            <q-card-section>
                <q-form @submit="closeModal">
                    <q-input
                        type="text"
                        placeholder="Label"
                        v-model="payloadTabToEdit!.label"
                        :rules="[
                            (value) => value.length || 'The label must have at least a character.',
                        ]"
                    />
                    <q-card-actions align="right">
                        <q-btn type="submit" label="Close" flat color="primary" />
                    </q-card-actions>
                </q-form>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { usePayloadStore } from 'src/stores/payload';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'EditPayloadTabModal',
    setup() {
        const payloadStore = usePayloadStore();
        const { payloadTabToEdit, showEditPayloadTabModal } = storeToRefs(payloadStore);

        return {
            payloadTabToEdit,
            showEditPayloadTabModal,
            payloadStore,
        };
    },
    methods: {
        closeModal() {
            this.payloadStore.$patch((state) => {
                state.payloadTabToEdit = null;
                state.showEditPayloadTabModal = false;
            });
        },
    },
});
</script>

<style scoped lang="scss">
.receive-key-pair-modal-card-container {
    width: 500px;
}

.key-pair-disclaimer {
    font-weight: bold;
}
</style>
