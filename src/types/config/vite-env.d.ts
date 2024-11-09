/// <reference types="vite/client" />

export interface ImportMetaEnv {
    VITE_CUENTAS_API_URL: string;
    // Add other environment variables here as needed
}
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  