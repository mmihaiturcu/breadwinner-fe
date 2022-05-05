<template>
    <q-page class="column q-pa-md">
        <q-table
            class="payloads-table"
            title="Payloads"
            :rows="payloads"
            :columns="columns"
            row-key="name"
            grid
            hide-header
        >
            <template v-slot:item="props">
                <div
                    class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
                    :style="props.selected ? 'transform: scale(0.95);' : ''"
                >
                    <q-card
                        class="payload-card"
                        :class="{
                            'bg-grey-2': props.selected,
                            'processing-complete': props.row.progress === 1,
                        }"
                    >
                        <Logo class="payload-breadwinner-logo" />
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
                        <q-separator />
                        <q-card-section class="actions-container column justify-center">
                            <q-card-actions v-if="props.row.progress === 1" align="center">
                                <q-btn
                                    color="primary"
                                    icon="mdi-lock-open"
                                    label="Decrypt result"
                                    @click="openDecryptPayloadModal(props.row.id)"
                                />
                            </q-card-actions>
                            <q-linear-progress
                                v-else
                                rounded
                                stripe
                                size="20px"
                                :value="props.row.progress"
                                :color="props.row.progress === 1 ? 'primary' : 'accent'"
                            >
                                <div class="absolute-full flex flex-center">
                                    <q-badge
                                        :color="props.row.progress === 1 ? 'accent' : 'primary'"
                                        text-color="white"
                                        :label="`Progress: ${Math.floor(
                                            props.row.progress * 100
                                        )}%`"
                                    />
                                </div>
                            </q-linear-progress>
                        </q-card-section>
                    </q-card>
                </div>
            </template>
        </q-table>
        <CreatePayloadModal v-if="showCreatePayloadModal" />
        <ShowKeyPairModal v-if="showKeyPairModal" />
        <ShowDecryptPayloadModal v-if="showDecryptPayloadModal" />
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="add" color="accent" @click="openAddPayloadModal" />
        </q-page-sticky>
    </q-page>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { usePayloadStore } from 'src/stores';
import { defineComponent } from 'vue';
import CreatePayloadModal from 'src/components/dashboard/payload/CreatePayloadModal.vue';
import ShowKeyPairModal from 'src/components/dashboard/payload/ShowKeyPairModal.vue';
import Logo from 'src/components/Logo.vue';
import ShowDecryptPayloadModal from 'src/components/dashboard/payload/ShowDecryptPayloadModal.vue';

export default defineComponent({
    name: 'PagePayloads',
    components: { CreatePayloadModal, ShowKeyPairModal, Logo, ShowDecryptPayloadModal },
    setup() {
        const payloadStore = usePayloadStore();
        const { payloads, showCreatePayloadModal, showKeyPairModal, showDecryptPayloadModal } =
            storeToRefs(payloadStore);
        return {
            payloads,
            columns: [
                { name: 'label', label: 'Label', field: 'label', sortable: true },
                { name: 'noChunks', label: 'Number of chunks', field: 'noChunks', sortable: true },
                {
                    name: 'totalDataLength',
                    label: 'Total input data length',
                    field: 'totalDataLength',
                    sortable: true,
                },
            ],
            showCreatePayloadModal,
            showKeyPairModal,
            showDecryptPayloadModal,
            payloadStore,
        };
    },
    methods: {
        openAddPayloadModal() {
            this.showCreatePayloadModal = true;
        },
        openDecryptPayloadModal(payloadId: number) {
            this.payloadStore.$patch({
                showDecryptPayloadModal: true,
                payloadToDecryptId: payloadId,
            });
        },
    },
    async created() {
        await this.payloadStore.refreshPayloads();
    },
});
</script>

<style scoped lang="scss">
@use 'sass:math';
@import 'src/css/quasar.variables.scss';

$logo-size: 50px;

.payload-breadwinner-logo {
    --size: #{$logo-size};
    position: absolute;
    left: calc(50% - #{$logo-size / 2});
    top: 10px;
}
.payload-card {
    &.processing-complete {
        .payload-breadwinner-logo {
            :deep(svg) {
                animation-play-state: paused;
            }
        }
    }
}

.actions-container {
    height: 84px;
}

.q-linear-progress {
    height: 36px;
}

:deep(.payloads-table) {
    .q-table__middle {
        margin-bottom: 20px;
    }

    .q-table__grid-content {
        row-gap: 40px;
    }
}
</style>
