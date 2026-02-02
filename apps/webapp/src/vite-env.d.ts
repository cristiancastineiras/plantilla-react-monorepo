/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BASE_PATH: string;
    readonly VITE_HOST: string;
    readonly VITE_NOMBRE_APP: string;
    readonly VITE_PROTOCOLO: string;
    readonly VITE_PUERTO: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
