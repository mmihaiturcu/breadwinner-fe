import { boot } from 'quasar/wrappers';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { Notify } from 'quasar';
import { CSRF_HEADER_NAME } from 'src/utils/constants';
import { useUserStore } from 'src/stores';
import { storeToRefs } from 'pinia';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $axios: AxiosInstance;
    }
}

declare module 'axios' {
    export interface AxiosRequestConfig {
        withCsrf?: boolean;
        preSession?: boolean;
    }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: process.env.BACKEND_HTTPS_URL });

export default boot(({ app }) => {
    // for use inside Vue files (Options API) through this.$axios and this.$api
    app.config.globalProperties.$axios = axios;
    // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
    //       so you won't necessarily have to import axios in each vue file

    app.config.globalProperties.$api = api;
    // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
    //       so you can easily perform requests against your app's API

    const userStore = useUserStore();
    const { csrfToken } = storeToRefs(userStore);

    api.interceptors.request.use(async (config) => {
        if (config.preSession) {
            await userStore.regenerateSession();
        }

        if (config.withCsrf) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            config.headers.common[CSRF_HEADER_NAME] = csrfToken.value;
        }

        return config;
    });

    api.interceptors.response.use(
        (response) => {
            console.log(response);
            return Promise.resolve(response);
        },
        async (error: Error | AxiosError) => {
            if (error.message === 'Network Error') {
                Notify.create({
                    type: 'negative',
                    message: 'The connection to the server could not be established.',
                });
            }

            return Promise.reject(error);
        }
    );
});

export { api };
