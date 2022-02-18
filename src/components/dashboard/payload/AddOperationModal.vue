<template>
    <q-dialog v-model="showAddOperationModal">
        <q-card>
            <q-card-section>
                <div class="text-h6">Add operation</div>
            </q-card-section>
            <q-card-section>
                <!-- TODO: Add <q-select> with operations (icons as well .... )-->
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { usePayloadStore } from 'src/stores';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'AddOperationModal',
    setup() {
        const payloadStore = usePayloadStore();

        const { showAddOperationModal } = storeToRefs(payloadStore);

        return {
            showAddOperationModal,
        };
    },
});
</script>
