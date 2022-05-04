<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

                <q-toolbar-title>Breadwinner</q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-drawer v-model="leftDrawerOpen" bordered>
            <q-list class="column full-height">
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
                    class="navigation-item"
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
import { logout } from 'src/service/service';

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
        dataProcessingTestNavigationItem(): NavigationItem {
            return {
                icon: 'mdi-database-cog',
                label: this.t('navigation.dataProcessingTest'),
                routeName: 'dataProcessingTest',
                clickHandler: async () => {
                    await this.$router.replace({ path: '/main/data-processing-test' });
                },
            };
        },
        twoFactorAuthenticationNavigationItem(): NavigationItem {
            return {
                icon: 'mdi-two-factor-authentication',
                label: this.t('navigation.twoFactorAuthentication'),
                routeName: 'twoFactorAuthentication',
                clickHandler: async () => {
                    await this.$router.replace({ path: '/main/two-factor-authentication' });
                },
            };
        },
        paymentsNavigationItem(): NavigationItem {
            return {
                icon: 'mdi-account-cash',
                label: this.t('navigation.payments'),
                routeName: 'payments',
                clickHandler: async () => {
                    await this.$router.replace({ path: '/main/payments' });
                },
            };
        },
        logoutNavigationItem(): NavigationItem {
            return {
                icon: 'mdi-logout',
                label: this.t('navigation.logout'),
                routeName: 'logout',
                clickHandler: async () => {
                    const response = await logout();
                    this.userStore.csrfToken = response.data;
                    await this.$router.replace({ path: '/login' });
                },
            };
        },
        dataSupplierNavigationItems(): NavigationItem[] {
            return [
                this.payloadsNavigationItem,
                this.twoFactorAuthenticationNavigationItem,
                this.logoutNavigationItem,
            ];
        },
        dataProcessorNavigationItems(): NavigationItem[] {
            return [
                this.apiKeysNavigationItem,
                this.dataProcessingTestNavigationItem,
                this.paymentsNavigationItem,
                this.twoFactorAuthenticationNavigationItem,
                this.logoutNavigationItem,
            ];
        },
        adminNavigationItems(): NavigationItem[] {
            return [this.twoFactorAuthenticationNavigationItem, this.logoutNavigationItem];
        },
        navigationItems(): NavigationItem[] {
            switch (this.userDetails.role) {
                case Role.DATA_SUPPLIER: {
                    return this.dataSupplierNavigationItems;
                }
                case Role.DATA_PROCESSOR: {
                    return this.dataProcessorNavigationItems;
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

.navigation-item {
    &:last-child {
        margin-top: auto;
    }
}
</style>
