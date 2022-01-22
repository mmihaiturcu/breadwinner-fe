declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: string;
        VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
        VUE_ROUTER_BASE: string | undefined;
        BACKEND_HTTPS_URL: string;
        BACKEND_WSS_URL: string;
    }
}
