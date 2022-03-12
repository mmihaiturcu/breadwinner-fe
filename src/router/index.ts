import { route } from 'quasar/wrappers';
import { useUserStore } from 'src/stores/user';
import { Role } from 'src/types/enums';
import { DEFAULT_ROUTES } from 'src/utils/constants';
import {
    createMemoryHistory,
    createRouter,
    createWebHashHistory,
    createWebHistory,
} from 'vue-router';
import routes from './routes';
declare module 'vue-router' {
    export interface RouteMeta extends Record<string | number | symbol, unknown> {
        requiresAuthentication?: boolean;
        availableRoles: Record<Role, boolean>;
    }
}

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
    const createHistory = process.env.SERVER
        ? createMemoryHistory
        : process.env.VUE_ROUTER_MODE === 'history'
        ? createWebHistory
        : createWebHashHistory;

    const Router = createRouter({
        scrollBehavior: (to, from, savedPosition) => {
            return savedPosition ?? { left: 0, top: 0 };
        },
        routes,
        // Leave this as is and make changes in quasar.conf.js instead!
        // quasar.conf.js -> build -> vueRouterMode
        // quasar.conf.js -> build -> publicPath
        history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE),
    });

    Router.beforeEach((to, from, next) => {
        const userStore = useUserStore();
        if (to.matched.some((record) => record.meta.requiresAuthentication)) {
            if (!userStore.isLoggedIn) {
                next({
                    path: '/login',
                    params: { nextUrl: to.fullPath },
                });
            } else {
                if (to.meta.availableRoles[userStore.userDetails.role]) {
                    next();
                } else {
                    next({
                        path: DEFAULT_ROUTES[userStore.userDetails.role],
                    });
                }
            }
        } else {
            next();
        }
    });

    return Router;
});
