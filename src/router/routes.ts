import { Role } from 'src/types/enums';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('layouts/LoginLayout.vue'),
        children: [
            {
                path: '',
                redirect: 'login',
            },
            {
                path: 'login',
                component: () => import('layouts/LoginLayout.vue'),
                children: [{ path: '/login', component: () => import('src/pages/PageLogin.vue') }],
            },
            {
                path: 'confirmation',
                component: () => import('layouts/LoginLayout.vue'),
                children: [
                    { path: '/confirmation', component: () => import('src/pages/PageConfirm.vue') },
                ],
            },
        ],
    },
    {
        path: '/main',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            { path: '', redirect: 'dashboard' },
            {
                path: 'dashboard',
                component: () => import('src/pages/PageDashboard.vue'),
                meta: {
                    requiresAuthentication: true,
                    availableRoles: {
                        [Role.ADMIN]: true,
                        [Role.DATA_PROCESSOR]: true,
                        [Role.DATA_SUPPLIER]: true,
                    },
                },
            },
            {
                name: 'apiKeys',
                path: 'api-keys',
                component: () => import('src/pages/PageApiKeys.vue'),
                meta: {
                    requiresAuthentication: true,
                    availableRoles: {
                        [Role.ADMIN]: true,
                        [Role.DATA_SUPPLIER]: false,
                        [Role.DATA_PROCESSOR]: true,
                    },
                },
            },
            {
                name: 'dataProcessingTest',
                path: 'data-processing-test',
                component: () => import('src/pages/PageDataProcessingTest.vue'),
                meta: {
                    requiresAuthentication: true,
                    availableRoles: {
                        [Role.ADMIN]: true,
                        [Role.DATA_SUPPLIER]: false,
                        [Role.DATA_PROCESSOR]: true,
                    },
                },
            },
            {
                name: 'payloads',
                path: 'payloads',
                component: () => import('src/pages/PagePayloads.vue'),
                meta: {
                    requiresAuthentication: true,
                    availableRoles: {
                        [Role.ADMIN]: true,
                        [Role.DATA_SUPPLIER]: true,
                        [Role.DATA_PROCESSOR]: false,
                    },
                },
            },
            {
                name: 'payments',
                path: 'payments',
                component: () => import('src/pages/PagePayments.vue'),
                meta: {
                    requiresAuthentication: true,
                    availableRoles: {
                        [Role.ADMIN]: true,
                        [Role.DATA_SUPPLIER]: false,
                        [Role.DATA_PROCESSOR]: true,
                    },
                },
            },
            {
                name: 'twoFactorAuthentication',
                path: 'two-factor-authentication',
                component: () => import('src/pages/Page2FA.vue'),
                meta: {
                    requiresAuthentication: true,
                    availableRoles: {
                        [Role.ADMIN]: true,
                        [Role.DATA_SUPPLIER]: true,
                        [Role.DATA_PROCESSOR]: true,
                    },
                },
            },
        ],
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/Error404.vue'),
    },
];

export default routes;
