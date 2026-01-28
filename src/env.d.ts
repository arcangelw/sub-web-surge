/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_SUBCONVERTER_DEFAULT_BACKEND: string
  readonly VITE_PROJECT: string

  readonly VITE_SUBCONVERTER_REMOTE_CONFIG: string
  readonly VITE_SUBCONVERTER_DOC_ADVANCED: string
  readonly VITE_BACKEND_RELEASE: string

  readonly VITE_CONFIG_UPLOAD_API: string
  readonly VITE_USE_STORAGE: string
  readonly VITE_CACHE_TTL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: any;
    $copyText: (text: string) => Promise<void>;
    $message: any; // ElMessage
    $alert: any;
    $confirm: any;
    $prompt: any;
    $notify: any;
    $loading: any;
    $getOS: () => {
      isTablet: boolean;
      isIPhone: boolean;
      isAndroid: boolean;
      isPc: boolean;
    }
  }
}
