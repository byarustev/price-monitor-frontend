/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_WS_URL: string;
    readonly VITE_LOG_LEVEL: string;
    readonly VITE_PAPERTRAIL_HOST: string;
    readonly VITE_PAPERTRAIL_PORT: string;
    readonly VITE_PAPERTRAIL_HOSTNAME: string;
    readonly MODE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
} 