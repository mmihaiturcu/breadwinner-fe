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
                },
            },
            {
                name: 'apiKeys',
                path: 'api-keys',
                component: () => import('src/pages/PageApiKeys.vue'),
                meta: {
                    requiresAuthentication: true,
                },
            },
            {
                name: 'payloads',
                path: 'payloads',
                component: () => import('src/pages/PagePayloads.vue'),
                meta: {
                    requiresAuthentication: true,
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
