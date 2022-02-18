<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

                <q-toolbar-title>Breadwinner</q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-drawer v-model="leftDrawerOpen" bordered>
            <q-list>
                <q-item class="navigation-breadwinner-item">
                    <q-item-section avatar class="relative-position">
                        <Logo class="navigation-breadwinner-logo" />
                    </q-item-section>

                    <q-item-section>
                        <div
                            class="breadwinner-title text-h5 text-uppercase text-center accent text-accent gentona-bold"
                        >
                            Breadwinner
                        </div>
                    </q-item-section>
                </q-item>
                <q-separator />
                <q-item
                    v-for="(item, index) in navigationItems"
                    :key="index"
                    clickable
                    ripple
                    @click="item.clickHandler"
                >
                    <q-item-section avatar>
                        <q-icon
                            :name="item.icon"
                            :color="$route.name === item.routeName ? 'accent' : ''"
                        ></q-icon>
                    </q-item-section>

                    <q-item-section>{{ item.label }}</q-item-section>
                </q-item>
            </q-list>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from 'src/stores/user';
import { Role } from 'src/types/enums';
import { NavigationItem } from 'src/types/models';
import { useGlobalI18n } from 'src/utils/hooks';
import { defineComponent, ref } from 'vue';
import Logo from 'src/components/Logo.vue';

export default defineComponent({
    name: 'MainLayout',
    components: { Logo },
    setup() {
        const leftDrawerOpen = ref(false);
        const { t } = useGlobalI18n();
        const userStore = useUserStore();
        const { userDetails } = storeToRefs(userStore);
        return {
            leftDrawerOpen,
            toggleLeftDrawer() {
                leftDrawerOpen.value = !leftDrawerOpen.value;
            },
            t,
            userStore,
            userDetails,
        };
    },
    computed: {
        apiKeysNavigationItem(): NavigationItem {
            return {
                icon: 'mdi-key',
                label: this.t('navigation.apiKeys'),
                routeName: 'apiKeys',
                clickHandler: async () => {
                    await this.$router.replace({ path: '/main/api-keys' });
                },
            };
        },
        payloadsNavigationItem(): NavigationItem {
            return {
                icon: 'mdi-database-lock',
                label: this.t('navigation.payloads'),
                routeName: 'payloads',
                clickHandler: async () => {
                    await this.$router.replace({ path: '/main/payloads' });
                },
            };
        },
        dataSupplierNavigationItems(): NavigationItem[] {
            return [this.payloadsNavigationItem];
        },
        dataProcessorNavigationItems(): NavigationItem[] {
            return [this.apiKeysNavigationItem];
        },
        adminNavigationItems(): NavigationItem[] {
            return [];
        },
        navigationItems(): NavigationItem[] {
            switch (this.userDetails.role) {
                case Role.DATA_SUPPLIER: {
                    return this.dataSupplierNavigationItems;
                }
                case Role.DATA_PROCESSOR: {
                    return this.dataProcessorNavigationItems;
                }
                case Role.ADMIN: {
                    return this.adminNavigationItems;
                }
                default:
                    return [];
            }
        },
    },
});
</script>

<style scoped lang="scss">
.navigation-breadwinner-item {
    height: 50px;

    .navigation-breadwinner-logo {
        --size: 25px;

        position: absolute;
        top: 15px;
        left: 15px;
    }
}
</style>
