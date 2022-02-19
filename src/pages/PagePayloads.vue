<template>
    <q-page class="column q-pa-md">
        <q-table
            title="Payloads"
            :rows="payloads"
            :columns="columns"
            row-key="name"
            grid
            hide-header
        >
            <template v-slot:top-right>
                <q-input borderless dense debounce="300" placeholder="Search" v-model="searchValue">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </template>

            <template v-slot:item="props">
                <div
                    class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
                    :style="props.selected ? 'transform: scale(0.95);' : ''"
                >
                    <q-card :class="props.selected ? 'bg-grey-2' : ''">
                        <q-card-section>
                            <q-checkbox dense v-model="props.selected" :label="props.row.name" />
                        </q-card-section>
                        <q-separator />
                        <q-list dense>
                            <q-item v-for="col in props.cols" :key="col.name">
                                <q-item-section>
                                    <q-item-label>{{ col.label }}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                    <q-item-label caption>{{ col.value }}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-card>
                </div>
            </template>
        </q-table>
        <CreatePayloadModal v-if="showCreatePayloadModal" />
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="add" color="accent" @click="openAddPayloadModal" />
        </q-page-sticky>
    </q-page>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { usePayloadStore } from 'src/stores';
import { defineComponent, ref } from 'vue';
import CreatePayloadModal from 'src/components/dashboard/payload/CreatePayloadModal.vue';

export default defineComponent({
    name: 'PagePayloads',
    components: { CreatePayloadModal },
    setup() {
        const payloadStore = usePayloadStore();
        const { payloads, showCreatePayloadModal } = storeToRefs(payloadStore);
        return {
            payloads,
            columns: [
                { name: 'prefix', label: 'Prefix', field: 'prefix', sortable: true },
                { name: 'hostname', label: 'Hostname', field: 'hostname', sortable: true },
                { name: 'createdAt', label: 'Created at', field: 'createdAt', sortable: true },
            ],
            searchValue: ref(''),
            showCreatePayloadModal,
        };
    },
    methods: {
        openAddPayloadModal() {
            this.showCreatePayloadModal = true;
        },
    },
});
</script>

<style scoped lang="scss">
@import 'src/css/quasar.variables.scss';

$list-header-height: 48px;

.card-list-container {
    padding: 16px;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: $list-header-height auto;
    gap: 10px;
    overflow-x: hidden;
    overflow-y: auto;
}

.list-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0px 5px;
    position: sticky;
    top: 18px;
    left: 0;
    background: white;
    border-radius: 4px;
    box-shadow: map-get($map: $elevation-umbra-shadow-map, $key: 2) $elevation-umbra-shadow-color,
        map-get($map: $elevation-penumbra-shadow-map, $key: 2) $elevation-penumbra-shadow-color,
        map-get($map: $elevation-ambient-shadow-map, $key: 2) $elevation-ambient-shadow-color;
}

.card-list {
    display: grid;
    gap: 10px;
    padding: 18px;
    justify-content: center;
}
</style>
