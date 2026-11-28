/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUBSCRIPTION_CREDITS_ADDRESS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
